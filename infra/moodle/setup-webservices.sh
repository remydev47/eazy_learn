#!/usr/bin/env bash
# Enables Moodle web services, creates the "Dashboard API" external service with
# all functions the Next.js frontend needs, and generates a token.
#
# Idempotent: safe to re-run. If something already exists it's left alone.
#
# Run from the repo root (or anywhere — uses absolute paths):
#   ./infra/moodle/setup-webservices.sh
#
# Outputs the generated token to ./infra/moodle/.token (gitignored).

set -euo pipefail

CONTAINER="${MOODLE_CONTAINER:-ezay-moodle-app}"
SERVICE_NAME="Dashboard API"
SERVICE_SHORTNAME="dashboard_api"
TOKEN_FILE="$(cd "$(dirname "$0")" && pwd)/.token"

# Functions the Next.js frontend calls — keep in sync with frontend/lib/moodle/client.ts
FUNCTIONS=(
  core_webservice_get_site_info
  core_enrol_get_users_courses
  core_completion_get_activities_completion_status
  mod_assign_get_assignments
  gradereport_user_get_grade_items
  core_calendar_get_calendar_events
  core_enrol_get_enrolled_users
  report_log_get_entries
  core_user_get_users
  core_user_get_users_by_field
  core_user_update_users
  core_role_assign_roles
  core_course_get_courses
  core_course_get_courses_by_field
)

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
  echo "ERROR: container '${CONTAINER}' is not running."
  echo "Start the stack first:  cd infra/moodle && docker compose up -d"
  exit 1
fi

echo "==> Waiting for Moodle to finish bootstrapping inside ${CONTAINER}..."
# Bitnami image takes ~2-3 min on first boot. Poll for the CLI being usable.
for i in {1..120}; do
  if docker exec "${CONTAINER}" test -f /opt/bitnami/moodle/admin/cli/cfg.php 2>/dev/null; then
    break
  fi
  sleep 2
done
echo "    Moodle CLI is available."

run_cli() {
  # Run a moodle CLI php script as the `daemon` user that owns /opt/bitnami/moodle
  docker exec -u daemon "${CONTAINER}" php "$@"
}

# ── 1. Enable web services + REST protocol ─────────────────────────────────────
echo "==> Enabling web services and REST protocol..."
run_cli /opt/bitnami/moodle/admin/cli/cfg.php --name=enablewebservices --set=1
# Enable REST in the active protocols list. cfg.php sets a single value, so
# we use --component=core and the webserviceprotocols config item.
run_cli /opt/bitnami/moodle/admin/cli/cfg.php --name=webserviceprotocols --set=rest

# Enable the built-in moodle_mobile_app service. NextAuth uses this for
# login/token.php credential validation (it's preconfigured to accept any
# authenticated user; our custom dashboard_api is admin-only).
echo "==> Enabling moodle_mobile_app service for NextAuth credential validation..."
docker exec -u daemon "${CONTAINER}" php -r "
define('CLI_SCRIPT', true);
require('/opt/bitnami/moodle/config.php');
global \\\$DB;
\\\$svc = \\\$DB->get_record('external_services', ['shortname' => 'moodle_mobile_app']);
if (\\\$svc && !\\\$svc->enabled) {
    \\\$svc->enabled = 1;
    \\\$DB->update_record('external_services', \\\$svc);
    echo \"    enabled moodle_mobile_app (id={\\\$svc->id})\\n\";
} else if (\\\$svc) {
    echo \"    moodle_mobile_app already enabled\\n\";
}
"

# ── 2. Create the external service + add functions + generate token ────────────
# Moodle exposes no CLI for these, so we run a PHP one-liner against its bootstrap.
echo "==> Creating external service '${SERVICE_NAME}' and adding ${#FUNCTIONS[@]} functions..."
FUNCTIONS_PHP=$(printf "'%s'," "${FUNCTIONS[@]}")
FUNCTIONS_PHP="[${FUNCTIONS_PHP%,}]"

# This PHP script:
#   - Looks up or creates the external service
#   - Adds every function (skipping ones already attached)
#   - Issues a permanent token for the admin user against this service
SETUP_OUTPUT=$(docker exec -u daemon -i "${CONTAINER}" php -d log_errors=0 <<PHP
<?php
define('CLI_SCRIPT', true);
require('/opt/bitnami/moodle/config.php');
require_once(\$CFG->dirroot . '/webservice/lib.php');

global \$DB, \$USER;

\$shortname = '${SERVICE_SHORTNAME}';
\$name      = '${SERVICE_NAME}';
\$functions = ${FUNCTIONS_PHP};

// 1. Service
\$service = \$DB->get_record('external_services', ['shortname' => \$shortname]);
if (!\$service) {
    \$service = new stdClass();
    \$service->name        = \$name;
    \$service->shortname   = \$shortname;
    \$service->enabled     = 1;
    \$service->restrictedusers = 0;
    \$service->downloadfiles   = 1;
    \$service->uploadfiles     = 1;
    \$service->timecreated     = time();
    \$service->id = \$DB->insert_record('external_services', \$service);
    echo "  created service id={\$service->id}\n";
} else {
    \$service->enabled = 1;
    \$DB->update_record('external_services', \$service);
    echo "  service id={\$service->id} already exists, ensuring enabled\n";
}

// 2. Functions
foreach (\$functions as \$fname) {
    \$exists = \$DB->record_exists('external_services_functions', [
        'externalserviceid' => \$service->id,
        'functionname'      => \$fname,
    ]);
    if (\$exists) {
        echo "    [skip] {\$fname}\n";
        continue;
    }
    \$sf = new stdClass();
    \$sf->externalserviceid = \$service->id;
    \$sf->functionname      = \$fname;
    \$DB->insert_record('external_services_functions', \$sf);
    echo "    [add ] {\$fname}\n";
}

// 3. Token for admin user
\$admin = \$DB->get_record('user', ['username' => 'admin', 'deleted' => 0], '*', MUST_EXIST);
\$existing = \$DB->get_record('external_tokens', [
    'userid'    => \$admin->id,
    'externalserviceid' => \$service->id,
    'tokentype' => EXTERNAL_TOKEN_PERMANENT,
]);
if (\$existing) {
    echo "TOKEN={\$existing->token}\n";
} else {
    \$context = context_system::instance();
    // Moodle 4.2+ moved external_generate_token() into \core_external\util.
    // The signature also changed: it now takes the service object, not just the id.
    \$token = \core_external\util::generate_token(
        EXTERNAL_TOKEN_PERMANENT,
        \$service,
        \$admin->id,
        \$context
    );
    echo "TOKEN={\$token}\n";
}
PHP
)

# Echo the captured output so the user sees the per-function add/skip lines.
echo "${SETUP_OUTPUT}"

# Extract the token line we emitted (TOKEN=<hex>)
TOKEN=$(echo "${SETUP_OUTPUT}" | grep -oE 'TOKEN=[a-f0-9]+' | head -1 | cut -d= -f2)
if [[ -z "${TOKEN}" ]]; then
  echo "ERROR: failed to capture token. Full output above." >&2
  exit 1
fi

echo
echo "==> Token generated. Writing to ${TOKEN_FILE}"
echo "${TOKEN}" > "${TOKEN_FILE}"
chmod 600 "${TOKEN_FILE}"

echo
echo "──────────────────────────────────────────────────────────────"
echo " Moodle is configured. Use these values in frontend/.env.local:"
echo
echo "   MOODLE_URL=http://localhost:8080"
echo "   NEXT_PUBLIC_MOODLE_URL=http://localhost:8080"
echo "   MOODLE_TOKEN=${TOKEN}"
echo "   MOODLE_AUTH_SERVICE=${SERVICE_SHORTNAME}"
echo
echo " Admin login:    http://localhost:8080/login/"
echo " Admin user:     ${MOODLE_ADMIN_USER:-admin}"
echo " Admin password: (whatever you set in infra/moodle/.env)"
echo
echo " Smoke test:     curl http://localhost:3000/api/moodle/ping"
echo "──────────────────────────────────────────────────────────────"
