import { NextRequest, NextResponse } from "next/server";
import { getCourses } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const grade = searchParams.get("grade");
  const subject = searchParams.get("subject");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const sort = searchParams.get("sort") || "relevance";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "6", 10));

  let courses = getCourses();

  if (q) {
    courses = courses.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q)
    );
  }

  if (grade) {
    courses = courses.filter((c) => c.grade === parseInt(grade, 10));
  }

  if (subject) {
    courses = courses.filter((c) => c.subject === subject);
  }

  if (minPrice) {
    courses = courses.filter((c) => c.price >= parseInt(minPrice, 10));
  }

  if (maxPrice) {
    courses = courses.filter((c) => c.price <= parseInt(maxPrice, 10));
  }

  if (minRating) {
    courses = courses.filter((c) => c.rating >= parseFloat(minRating));
  }

  switch (sort) {
    case "price_asc":
      courses.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      courses.sort((a, b) => b.price - a.price);
      break;
    case "rating_desc":
      courses.sort((a, b) => b.rating - a.rating);
      break;
    case "grade_asc":
      courses.sort((a, b) => a.grade - b.grade);
      break;
    default:
      break;
  }

  const total = courses.length;
  const start = (page - 1) * limit;
  const paginated = courses.slice(start, start + limit);
  const hasMore = start + limit < total;

  // Distinct subjects/grades for building filter dropdowns on the client
  const allCourses = getCourses();
  const subjects = Array.from(new Set(allCourses.map((c) => c.subject))).sort();
  const grades = Array.from(new Set(allCourses.map((c) => c.grade))).sort(
    (a, b) => a - b
  );

  return NextResponse.json({
    results: paginated,
    total,
    page,
    limit,
    hasMore,
    facets: { subjects, grades },
  });
}
