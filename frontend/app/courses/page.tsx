import { getCatalog } from "@/lib/moodle/catalog";
import CoursesCatalogClient from "./CoursesCatalogClient";

// ISR: rebuild at most once a minute so the catalog tracks Moodle without
// coupling deploys to backend availability.
export const revalidate = 60;

export default async function CoursesPage() {
  const courses = await getCatalog();
  return <CoursesCatalogClient courses={courses} />;
}
