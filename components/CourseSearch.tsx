"use client";

import { useEffect, useMemo, useState } from "react";
import { Course } from "@/lib/types";

const LIMIT = 6;

type Facets = { subjects: string[]; grades: number[] };

const RATING_OPTIONS = [
  { label: "Any rating", value: "" },
  { label: "4.5 & up", value: "4.5" },
  { label: "4.0 & up", value: "4.0" },
  { label: "3.5 & up", value: "3.5" },
];

const SORT_OPTIONS = [
  { label: "Most relevant", value: "relevance" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Rating: High to Low", value: "rating_desc" },
  { label: "Grade: Low to High", value: "grade_asc" },
];

export default function CourseSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sort, setSort] = useState("relevance");

  const [page, setPage] = useState(1);
  const [results, setResults] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [facets, setFacets] = useState<Facets>({ subjects: [], grades: [] });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Debounce free-text search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  // Reset to page 1 whenever a filter/search/sort changes
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, grade, subject, minPrice, maxPrice, minRating, sort]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (grade) params.set("grade", grade);
    if (subject) params.set("subject", subject);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minRating) params.set("minRating", minRating);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", String(LIMIT));
    return params.toString();
  }, [debouncedQuery, grade, subject, minPrice, maxPrice, minRating, sort, page]);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchCourses() {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      setErrorMsg("");
      try {
        const res = await fetch(`/api/courses?${queryString}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setResults((prev) => (page === 1 ? data.results : [...prev, ...data.results]));
        setTotal(data.total);
        setHasMore(data.hasMore);
        setFacets(data.facets);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setErrorMsg("Couldn't load courses. Please try again.");
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    }
    fetchCourses();
    return () => controller.abort();
  }, [queryString, page]);

  function clearFilters() {
    setQuery("");
    setGrade("");
    setSubject("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSort("relevance");
  }

  const hasActiveFilters =
    query || grade || subject || minPrice || maxPrice || minRating;

  return (
    <section>
      {/* Search bar */}
      <div className="relative mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by course name or subject (e.g. Algebra, Science)"
          className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Grade
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All grades</option>
              {facets.grades.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All subjects</option>
              {facets.subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Min price (₹)
            </label>
            <input
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Max price (₹)
            </label>
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="5000"
              className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Teacher rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {RATING_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Sort by
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters ? (
          <button
            onClick={clearFilters}
            className="mt-3 text-xs font-medium text-indigo-600 hover:underline"
          >
            Clear all filters
          </button>
        ) : null}
      </div>

      {/* Result count */}
      {!loading && !errorMsg && (
        <p className="text-sm text-slate-500 mb-3">
          {total} {total === 1 ? "course" : "courses"} found
        </p>
      )}

      {errorMsg && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-4">
          {errorMsg}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-xl border border-slate-200 bg-white animate-pulse"
            />
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && !errorMsg && results.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-600 font-medium">No courses match your search</p>
          <p className="text-slate-400 text-sm mt-1">
            Try adjusting your filters or searching a different keyword.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm font-medium text-indigo-600 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results grid */}
      {!loading && results.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={loadingMore}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-60"
              >
                {loadingMore ? "Loading..." : "Load more courses"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-indigo-200 transition-all flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <span className="inline-block text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full px-2.5 py-1">
          {course.subject}
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
          <svg className="h-3.5 w-3.5 fill-amber-500" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
          {course.rating.toFixed(1)}
        </span>
      </div>

      <h3 className="font-semibold text-slate-900 mt-3">{course.name}</h3>
      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{course.description}</p>

      <div className="mt-3 text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
        <span>Grade {course.grade}</span>
        <span>·</span>
        <span>{course.durationWeeks} weeks</span>
        <span>·</span>
        <span>{course.teacher}</span>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="font-semibold text-slate-900">
          ₹{course.price.toLocaleString("en-IN")}
        </span>
        <button className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg px-3.5 py-1.5 transition-colors">
          Book now
        </button>
      </div>
    </div>
  );
}
