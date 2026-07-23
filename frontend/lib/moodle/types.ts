// Shapes returned by Moodle Web Services REST API.
// Names mirror Moodle's response fields; do not rename without checking the API.

export interface MoodleException {
  exception: string
  errorcode: string
  message: string
  debuginfo?: string
}

export interface MoodleUser {
  id: number
  username: string
  firstname: string
  lastname: string
  fullname: string
  email: string
  department?: string
  firstaccess?: number
  lastaccess?: number
  auth?: string
  suspended?: boolean
  confirmed?: boolean
  profileimageurl?: string
  profileimageurlsmall?: string
  roles?: Array<{
    roleid: number
    name: string
    shortname: string
    sortorder: number
  }>
  customfields?: Array<{
    type: string // the field shortname (e.g. "emailverified")
    value: string
    name?: string
    shortname?: string
  }>
}

export interface CourseModuleContent {
  type: string // 'file' | 'url' | ...
  filename: string
  fileurl?: string
  mimetype?: string
  filesize?: number
}

export interface CourseModule {
  id: number
  name: string
  modname: string // 'resource' | 'url' | 'page' | 'label' | 'quiz' | 'assign' | 'forum' | ...
  modplural?: string
  url?: string // Moodle activity URL (for interactive modules)
  description?: string
  contents?: CourseModuleContent[]
}

export interface CourseSection {
  id: number
  name: string
  section: number
  summary?: string
  modules: CourseModule[]
}

export interface MoodleCourse {
  id: number
  shortname: string
  fullname: string
  displayname: string
  summary: string
  summaryformat: number
  startdate: number
  enddate: number
  visible: number
  categoryid: number
  categoryname?: string
  format?: string
  showgrades?: number
  lang?: string
  enablecompletion?: number
  completionhascriteria?: boolean
  completionusertracked?: boolean
  progress?: number | null
  hasprogress?: boolean
  isfavourite?: boolean
  hidden?: boolean
  showactivitydates?: boolean
  showcompletionconditions?: boolean | null
  courseimage?: string
  overviewfiles?: Array<{
    filename: string
    fileurl: string
    mimetype: string
  }>
  // Returned by core_course_get_courses_by_field — the course's teacher contacts.
  contacts?: Array<{
    id: number
    fullname: string
  }>
}

export interface CompletionStatus {
  cmid: number
  modname: string
  instance: number
  state: 0 | 1 | 2 | 3 // 0=incomplete, 1=complete, 2=complete-pass, 3=complete-fail
  timecompleted: number
  tracking: number
}

export interface ActivityCompletionResponse {
  statuses: CompletionStatus[]
  warnings?: Array<{ item: string; itemid: number; warningcode: string; message: string }>
}

export interface MoodleAssignment {
  id: number
  cmid: number
  course: number
  name: string
  duedate: number
  allowsubmissionsfromdate: number
  cutoffdate: number
  gradingduedate: number
  intro: string
  introformat: number
}

export interface AssignmentCourse {
  id: number
  fullname: string
  shortname: string
  timemodified: number
  assignments: MoodleAssignment[]
}

export interface AssignmentsResponse {
  courses: AssignmentCourse[]
  warnings?: unknown[]
}

export interface GradeItem {
  id: number
  itemname: string | null
  itemtype: string
  itemmodule: string | null
  iteminstance: number
  itemnumber: number | null
  categoryid: number | null
  outcomeid: number | null
  scaleid: number | null
  locked: boolean
  cmid: number | null
  weightraw?: number
  weightformatted?: string
  status?: string
  graderaw: number | null
  gradedatesubmitted: number | null
  gradedategraded: number | null
  gradehiddenbydate: boolean
  gradeneedsupdate: boolean
  gradeishidden: boolean
  gradeislocked: boolean
  gradeisoverridden: boolean
  gradeformatted: string
  grademin: number
  grademax: number
  feedback: string
  feedbackformat: number
}

export interface UserGradesResponse {
  usergrades: Array<{
    courseid: number
    userid: number
    userfullname: string
    maxdepth: number
    gradeitems: GradeItem[]
  }>
}

export interface CalendarEvent {
  id: number
  name: string
  description: string
  format: number
  courseid: number
  groupid: number
  userid: number
  repeatid: number
  modulename: string | null
  instance: number
  eventtype: string
  timestart: number
  timeduration: number
  visible: number
  url?: string
}

export interface CalendarEventsResponse {
  events: CalendarEvent[]
  warnings?: unknown[]
}

export interface SiteInfo {
  sitename: string
  username: string
  firstname: string
  lastname: string
  fullname: string
  lang: string
  userid: number
  siteurl: string
  userpictureurl: string
  functions: Array<{ name: string; version: string }>
  downloadfiles: number
  uploadfiles: number
  release: string
  version: string
  mobilecssurl: string
  advancedfeatures: Array<{ name: string; value: number }>
  usercanmanageownfiles: boolean
  userquota: number
  usermaxuploadfilesize: number
  userhomepage: number
  userprivateaccesskey?: string
  siteid: number
  sitecalendartype: string
  usercalendartype: string
  userissiteadmin: boolean
  theme: string
}

export interface LogEntry {
  id: number
  eventname: string
  component: string
  action: string
  target: string
  objecttable: string | null
  objectid: number | null
  crud: string
  edulevel: number
  contextid: number
  contextlevel: number
  contextinstanceid: number
  userid: number
  courseid: number
  relateduserid: number | null
  anonymous: number
  other: string
  timecreated: number
  origin: string
  ip: string
  realuserid: number | null
}

export interface LogEntriesResponse {
  logs: LogEntry[]
  warnings?: unknown[]
}

export type UserRole = 'student' | 'instructor' | 'admin'
