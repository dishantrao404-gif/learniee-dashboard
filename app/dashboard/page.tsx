import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { findUserById } from "@/lib/db";
import Navbar from "@/components/Navbar";
import CourseSearch from "@/components/CourseSearch";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? verifySession(token) : null;

  if (!session) {
    redirect("/login");
  }

  const user = findUserById(session.userId);
  if (!user) {
    redirect("/login");
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userName={user.name} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile / welcome section */}
        <section className="bg-gradient-to-r from-indigo-600 to-sky-600 rounded-2xl p-6 sm:p-8 text-white shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Welcome back,</p>
              <h1 className="text-2xl sm:text-3xl font-semibold mt-0.5">{user.name}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-indigo-100">
                <span>{user.email}</span>
                {user.childName && <span>Child: {user.childName}</span>}
                <span>Member since {joinedDate}</span>
              </div>
            </div>
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-white/15 flex items-center justify-center text-2xl font-semibold backdrop-blur-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </section>

        {/* Lead-in to course search */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Find the right course for {user.childName || "your child"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Search by name or subject, then narrow down using grade, price, and
            teacher rating filters.
          </p>
        </section>

        <CourseSearch />
      </main>
    </div>
  );
}
