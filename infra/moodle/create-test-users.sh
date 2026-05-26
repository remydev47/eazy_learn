#!/usr/bin/env bash
# Creates demo users for testing role-based dashboard routing:
#   - student@ezaytech.local  / Student123! (student)
#   - teacher@ezaytech.local  / Teacher123! (editingteacher)
# Both are enrolled in the seeded "Introduction to Web Development" course.
#
# Idempotent.

set -euo pipefail

CONTAINER="${MOODLE_CONTAINER:-ezay-moodle-app}"

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
  echo "ERROR: container '${CONTAINER}' is not running."
  exit 1
fi

echo "==> Creating demo users..."

docker exec -u daemon -i "${CONTAINER}" php <<'PHP'
<?php
define('CLI_SCRIPT', true);
require('/opt/bitnami/moodle/config.php');
require_once($CFG->dirroot . '/user/lib.php');
require_once($CFG->dirroot . '/lib/enrollib.php');

global $DB, $CFG;

function ensure_user(string $username, string $firstname, string $lastname, string $email, string $password): stdClass {
    global $DB, $CFG;
    $existing = $DB->get_record('user', ['username' => $username, 'deleted' => 0]);
    if ($existing) {
        echo "  user '{$username}' already exists (id={$existing->id})\n";
        return $existing;
    }
    $user = (object)[
        'auth' => 'manual',
        'confirmed' => 1,
        'mnethostid' => $CFG->mnet_localhost_id,
        'username' => $username,
        'password' => $password, // hashed by user_create_user
        'firstname' => $firstname,
        'lastname' => $lastname,
        'email' => $email,
        'lang' => 'en',
    ];
    $id = user_create_user($user, true, false);
    echo "  created user '{$username}' (id={$id})\n";
    return $DB->get_record('user', ['id' => $id], '*', MUST_EXIST);
}

function enrol_in_course(stdClass $user, int $courseid, string $roleshortname): void {
    global $DB;
    $course = $DB->get_record('course', ['id' => $courseid], '*', MUST_EXIST);
    $role   = $DB->get_record('role', ['shortname' => $roleshortname], '*', MUST_EXIST);
    $enrolinstance = $DB->get_record('enrol', ['courseid' => $course->id, 'enrol' => 'manual'], '*', MUST_EXIST);

    $existing = $DB->get_record('user_enrolments', [
        'enrolid' => $enrolinstance->id,
        'userid' => $user->id,
    ]);
    if ($existing) {
        echo "    already enrolled in course {$course->id}\n";
        return;
    }
    $plugin = enrol_get_plugin('manual');
    $plugin->enrol_user($enrolinstance, $user->id, $role->id);
    echo "    enrolled in course {$course->id} as {$roleshortname}\n";
}

$course = $DB->get_record('course', ['shortname' => 'intro-web-dev'], '*', MUST_EXIST);

// Student
$student = ensure_user('student', 'Sarah', 'Student', 'student@ezaytech.local', 'Student123!');
enrol_in_course($student, $course->id, 'student');

// Instructor
$teacher = ensure_user('teacher', 'Tom', 'Teacher', 'teacher@ezaytech.local', 'Teacher123!');
enrol_in_course($teacher, $course->id, 'editingteacher');

echo "\nDone. Credentials:\n";
echo "  Student:    username=student  password=Student123!\n";
echo "  Instructor: username=teacher  password=Teacher123!\n";
echo "  Admin:      username=admin    password=(from infra/moodle/.env)\n";
PHP
