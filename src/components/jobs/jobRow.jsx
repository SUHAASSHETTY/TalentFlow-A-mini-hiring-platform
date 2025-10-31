import { Link } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function JobRow({ job, handleStatusClickFunction }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: job.jobid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex justify-between items-center w-[85%] border border-gray-200 rounded-2xl px-6 py-4 bg-white shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-300"
    >
      {/* Job Info */}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
        <p className="text-sm text-gray-500">{job.tags.join(", ")}</p>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full mt-1 w-fit ${
            job.status === "archived" ? "bg-gray-300 text-gray-700" : "bg-green-200 text-green-700"
          }`}
        >
          {job.status === "archived" ? "Archived" : "Active"}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6 items-center">
        <Link
          to={`/editjob/${job.jobid}`}
          className="flex flex-col items-center text-blue-600 hover:text-blue-700 transition-colors"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <img src="/edit.png" alt="Edit" width={26} />
          <span className="text-xs mt-1">Edit</span>
        </Link>

        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => handleStatusClickFunction(job.jobid, job.status)}
          className="flex flex-col items-center text-gray-700 hover:text-red-500 transition-colors"
        >
          <img
            src={job.status === "archived" ? "/unarchive.png" : "/archive.png"}
            alt={job.status === "archived" ? "Unarchive" : "Archive"}
            width={32}
          />
          <span className="text-xs mt-1">
            {job.status === "archived" ? "Unarchive" : "Archive"}
          </span>
        </button>
      </div>
    </li>
  );
}
