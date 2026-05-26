#!/usr/bin/env bash
# Seeds the full 13-course Ezay Tech catalog into Moodle, organized into
# 3 tier-categories (Beginner / Intermediate / Advanced).
#
# Each course gets:
#   - shortname (URL-safe slug used by /courses/[slug])
#   - idnumber  (machine-readable tier marker: tier-beginner / tier-intermediate / tier-advanced)
#   - summary   (marketing description + session count)
#   - category  (the matching tier category)
#
# Pricing is intentionally NOT stored in Moodle for the demo — it's encoded in
# frontend/lib/course-metadata.ts as a tier-keyed lookup. Move to Moodle custom
# fields post-demo (see CLAUDE.md scope_deltas).
#
# Idempotent: existing courses/categories are left alone.

set -euo pipefail

CONTAINER="${MOODLE_CONTAINER:-ezay-moodle-app}"

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
  echo "ERROR: container '${CONTAINER}' is not running."
  exit 1
fi

echo "==> Seeding full 13-course Ezay Tech catalog..."

docker exec -u daemon -i "${CONTAINER}" php <<'PHP'
<?php
define('CLI_SCRIPT', true);
require('/opt/bitnami/moodle/config.php');
require_once($CFG->dirroot . '/course/lib.php');

global $DB;

// ── Categories ────────────────────────────────────────────────────────────────
$categories = [
    'beginner'     => ['name' => 'Beginner',     'idnumber' => 'tier-beginner'],
    'intermediate' => ['name' => 'Intermediate', 'idnumber' => 'tier-intermediate'],
    'advanced'     => ['name' => 'Advanced',     'idnumber' => 'tier-advanced'],
];

$category_ids = [];
foreach ($categories as $key => $cat) {
    $existing = $DB->get_record('course_categories', ['idnumber' => $cat['idnumber']]);
    if ($existing) {
        $category_ids[$key] = $existing->id;
        echo "  category '{$cat['name']}' exists (id={$existing->id})\n";
        continue;
    }
    $new = core_course_category::create([
        'name'        => $cat['name'],
        'idnumber'    => $cat['idnumber'],
        'description' => "{$cat['name']}-tier courses in the Ezay Tech catalog.",
    ]);
    $category_ids[$key] = $new->id;
    echo "  created category '{$cat['name']}' (id={$new->id})\n";
}

// ── Courses (13 total per CLIENT_REQUIREMENTS.md) ─────────────────────────────
// Each row: [tier_key, shortname, fullname, sessions, marketing_summary_html]
$courses = [
    // Beginner — 3 courses, 49 sessions total
    ['beginner', 'intro-web-development',
        'Introduction to Web Development',
        20,
        '<p>Master the building blocks of the modern web: HTML, CSS, and JavaScript. Build your first responsive site by session 12 and deploy a portfolio-ready project by session 20.</p>'],
    ['beginner', 'intro-computers',
        'Introduction to Computers',
        14,
        '<p>Demystify how computers work — from bits and bytes to operating systems, file systems, and the command line. Required foundation if you have no prior tech background.</p>'],
    ['beginner', 'intro-graphics',
        'Introduction to Graphics',
        15,
        '<p>Hands-on training in visual design fundamentals. Learn Figma, color theory, typography, and how to design interfaces users actually love.</p>'],

    // Intermediate — 5 courses, 126 sessions total
    ['intermediate', 'intro-apis',
        'Introduction to Working with APIs',
        36,
        '<p>Consume and build REST APIs. Authentication, rate limiting, error handling, OpenAPI specs, and integrating third-party services like Stripe, Twilio, and OAuth providers.</p>'],
    ['intermediate', 'intro-software-development',
        'Introduction to Software Development',
        20,
        '<p>The discipline behind the code: version control with git, code review, debugging strategies, software architecture patterns, and how to ship code that does not break.</p>'],
    ['intermediate', 'intro-linux-servers',
        'Introduction to Servers and Linux Programming',
        22,
        '<p>Live in the terminal. Bash scripting, file permissions, process management, ssh, systemd, nginx — the skills that turn you into someone ops trusts with production.</p>'],
    ['intermediate', 'intro-databases',
        'Introduction to Databases',
        11,
        '<p>SQL fundamentals through to query optimization. Schema design, indexes, joins, transactions, and when to reach for PostgreSQL vs MongoDB vs Redis.</p>'],
    ['intermediate', 'intro-python',
        'Introduction to Python Programming',
        37,
        '<p>The most in-demand language in Kenya 2026. Syntax through to building real applications — data scripts, web scrapers, APIs with FastAPI, and your first ML notebook.</p>'],

    // Advanced — 5 courses, 179 sessions total
    ['advanced', 'intro-project-management',
        'Introduction to Project Management',
        25,
        '<p>Agile, Scrum, Kanban — when each works and when it doesnt. Stakeholder management, sprint planning, retrospectives, and getting promoted into a tech lead role.</p>'],
    ['advanced', 'intro-aws',
        'Introduction to AWS Cloud Computing',
        35,
        '<p>The cloud platform that runs half the internet. EC2, S3, RDS, Lambda, IAM, CloudFront — earn the AWS Solutions Architect Associate as you go.</p>'],
    ['advanced', 'intro-testing',
        'Introduction to Testing',
        50,
        '<p>Unit, integration, end-to-end, performance, security. Test-driven development, mocking strategies, CI pipelines, and how senior engineers ship without breaking production.</p>'],
    ['advanced', 'intro-cybersecurity',
        'Introduction to Cyber Security',
        24,
        '<p>Defensive and offensive fundamentals. OWASP Top 10, network reconnaissance, common attack vectors, incident response, and the path to CompTIA Security+ certification.</p>'],
    ['advanced', 'intro-genai-ml',
        'Introduction to Generative AI & Machine Learning',
        45,
        '<p>The most valuable skill of 2026. From linear regression through to fine-tuning open-weight LLMs. Build agents, RAG systems, and ship AI features into production.</p>'],
];

// Moodle requires course `idnumber` to be globally unique, so we don't reuse
// the tier marker there. The tier is determined by the course's category
// (whose own idnumber is tier-beginner/intermediate/advanced).

$created = 0;
$skipped = 0;
foreach ($courses as [$tier, $shortname, $fullname, $sessions, $summary]) {
    $existing = $DB->get_record('course', ['shortname' => $shortname]);
    if ($existing) {
        echo "  [skip] {$shortname} (id={$existing->id})\n";
        $skipped++;
        continue;
    }

    $course = create_course((object)[
        'category'         => $category_ids[$tier],
        'fullname'         => $fullname,
        'shortname'        => $shortname,
        'summary'          => $summary . "<p><strong>{$sessions} live sessions</strong> · 1–1.5 hr each · 4–5 per week · recordings provided.</p>",
        'summaryformat'    => FORMAT_HTML,
        'format'           => 'topics',
        'visible'          => 1,
        'startdate'        => time(),
        'enablecompletion' => 1,
    ]);
    echo "  [add ] {$shortname} (id={$course->id}, tier={$tier})\n";
    $created++;
}

echo "\n  Created: {$created} · Skipped: {$skipped} · Total in catalog: " . count($courses) . "\n";
PHP
