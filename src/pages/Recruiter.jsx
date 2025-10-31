import { Link } from "react-router-dom";

export function Recruiter() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      {/* Title */}
      <h1 className="text-5xl font-extrabold text-gray-800 mb-12 drop-shadow-md">
        Recruiter Dashboard
      </h1>

      {/* Options Section */}
      <div className="flex flex-wrap gap-8 justify-center">
        {/* Job Board Card */}
        <Link
          to="/jobs"
          state={{ role: "recruiter" }}
          className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl p-6 w-[320px] flex flex-col items-center border border-gray-200 hover:border-blue-500"
        >
          <img
            src="/jobs.jpg"
            alt="Job Board"
            className="rounded-xl w-60 h-52 object-cover mb-4 group-hover:scale-105 transition-transform duration-300"
          />
          <p className="font-semibold text-2xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">
            Job Board
          </p>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Create, edit, and manage job openings with ease.
          </p>
        </Link>

        {/* Candidates List Card */}
        <Link
          to="/candidates"
          className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl p-6 w-[320px] flex flex-col items-center border border-gray-200 hover:border-purple-500"
        >
          <img
            src="/candidates.webp"
            alt="Candidates List"
            className="rounded-xl w-60 h-52 object-cover mb-4 group-hover:scale-105 transition-transform duration-300"
          />
          <p className="font-semibold text-2xl text-gray-800 group-hover:text-purple-600 transition-colors duration-300 text-center">
            Candidates
          </p>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Review and track applicants efficiently.
          </p>
        </Link>
      </div>

      {/* Footer */}
      <p className="mt-12 text-gray-500 text-sm">
        © {new Date().getFullYear()} Talent Flow — Empowering recruiters & careers.
      </p>
    </div>
  );
}
