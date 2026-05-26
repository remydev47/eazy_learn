import { getCatalog } from "@/lib/moodle/catalog";
import CoursesCatalogClient from "./CoursesCatalogClient";

export default async function CoursesPage() {
  const courses = await getCatalog();
  return <CoursesCatalogClient courses={courses} />;
}
