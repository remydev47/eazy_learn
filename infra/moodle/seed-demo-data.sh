#!/usr/bin/env bash
# Seeds Moodle with demo data so the Next.js dashboards have something to show
# before real instructors and students exist:
#   - Creates a course category "Web Development" (if missing)
#   - Creates a course "Introduction to Web Development" (if missing)
#   - Enrolls the admin user as a Student in that course
#   - Creates a fake completion to give the course non-zero progress
#
# Idempotent: re-runs are safe.
#
# Usage:  ./infra/moodle/seed-demo-data.sh

set -euo pipefail

CONTAINER="${MOODLE_CONTAINER:-ezay-moodle-app}"

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
  echo "ERROR: container '${CONTAINER}' is not running."
  exit 1
fi

echo "==> Seeding demo course + enrollment..."

docker exec -u daemon -i "${CONTAINER}" php <<'PHP'
<?php
define('CLI_SCRIPT', true);
require('/opt/bitnami/moodle/config.php');
require_once($CFG->dirroot . '/course/lib.php');
require_once($CFG->dirroot . '/lib/enrollib.php');

global $DB;

// 1. Category
$category = $DB->get_record('course_categories', ['name' => 'Web Development']);
if (!$category) {
    $category = core_course_category::create([
        'name' => 'Web Development',
        'description' => 'Front-end, back-end, and full-stack web development courses.',
        'idnumber' => 'cat_webdev',
    ]);
    echo "  created category id={$category->id}\n";
} else {
    echo "  category id={$category->id} already exists\n";
}

// 2. Course
$course = $DB->get_record('course', ['shortname' => 'intro-web-dev']);
if (!$course) {
    $course = create_course((object)[
        'category'     => $category->id,
        'fullname'     => 'Introduction to Web Development',
        'shortname'    => 'intro-web-dev',
        'idnumber'     => 'course_intro_webdev',
        'summary'      => 'Learn HTML, CSS, and JavaScript from the ground up. 20 live sessions, 1–1.5 hours each.',
        'summaryformat' => FORMAT_HTML,
        'format'       => 'topics',
        'visible'      => 1,
        'startdate'    => time(),
        'enablecompletion' => 1,
    ]);
    echo "  created course id={$course->id}\n";
} else {
    echo "  course id={$course->id} already exists\n";
}

// 3. Enrol admin as student (so admin's "enrolled courses" returns this course)
$admin = $DB->get_record('user', ['username' => 'admin', 'deleted' => 0], '*', MUST_EXIST);
$studentrole = $DB->get_record('role', ['shortname' => 'student'], '*', MUST_EXIST);

$enrolinstance = $DB->get_record('enrol', [
    'courseid' => $course->id,
    'enrol' => 'manual',
]);
if (!$enrolinstance) {
    // Auto-added at course creation; if missing, add one.
    $manualplugin = enrol_get_plugin('manual');
    $instanceid = $manualplugin->add_default_instance($course);
    $enrolinstance = $DB->get_record('enrol', ['id' => $instanceid]);
    echo "  created manual enrol instance id={$enrolinstance->id}\n";
}

$manualplugin = enrol_get_plugin('manual');
$existing = $DB->get_record('user_enrolments', [
    'enrolid' => $enrolinstance->id,
    'userid' => $admin->id,
]);
if (!$existing) {
    $manualplugin->enrol_user($enrolinstance, $admin->id, $studentrole->id);
    echo "  enrolled admin (userid={$admin->id}) as student in course {$course->id}\n";
} else {
    echo "  admin already enrolled in course {$course->id}\n";
}

// 4. Add a "Welcome" page activity so the course has something inside
//    (gives the completion API something to count).
$mod = $DB->get_record_sql("
    SELECT cm.* FROM {course_modules} cm
    JOIN {modules} m ON m.id = cm.module AND m.name = 'page'
    WHERE cm.course = ?
    LIMIT 1
", [$course->id]);

if (!$mod) {
    require_once($CFG->dirroot . '/mod/page/lib.php');
    $pagedata = (object)[
        'course' => $course->id,
        'name' => 'Welcome — Read this first',
        'intro' => '<p>Welcome to Introduction to Web Development. Read the materials and join the first live session.</p>',
        'introformat' => FORMAT_HTML,
        'content' => '<h2>What you will learn</h2><ul><li>HTML structure</li><li>CSS styling</li><li>JavaScript basics</li></ul>',
        'contentformat' => FORMAT_HTML,
        'display' => 5,
        'completion' => 2,
        'completionview' => 1,
        'modulename' => 'page',
        'visible' => 1,
        'section' => 1,
    ];

    // Use the standard add_moduleinfo() helper.
    require_once($CFG->dirroot . '/course/modlib.php');
    $module = $DB->get_record('modules', ['name' => 'page'], '*', MUST_EXIST);
    $pagedata->module = $module->id;
    $pagedata->modulename = 'page';
    $pagedata->course = $course->id;
    $pagedata->section = 1;
    $pagedata->visible = 1;
    $pagedata->visibleoncoursepage = 1;

    // Get or create section 1
    $section = $DB->get_record('course_sections', ['course' => $course->id, 'section' => 1]);
    if (!$section) {
        course_create_sections_if_missing($course->id, [1]);
    }

    try {
        add_moduleinfo($pagedata, get_course($course->id));
        echo "  added Welcome page activity\n";
    } catch (Exception $e) {
        echo "  could not add page activity (non-fatal): " . $e->getMessage() . "\n";
    }
} else {
    echo "  course already has a page activity (id={$mod->id})\n";
}

echo "\nDone. Hit http://localhost:3000/api/moodle/ping to verify, then load /dashboard/student\n";
echo "Admin's enrolled courses can be checked with:\n";
echo "  curl 'http://localhost:8080/webservice/rest/server.php?wstoken=<TOKEN>&wsfunction=core_enrol_get_users_courses&moodlewsrestformat=json&userid={$admin->id}'\n";
PHP
