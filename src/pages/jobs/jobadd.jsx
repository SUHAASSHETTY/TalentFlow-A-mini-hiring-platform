import axios from "axios";
import { useState, useEffect } from "react";

export function JobAdd() {
  const [name, setName] = useState("");
  const [tags, setTags] = useState([]);
  const [slug, setSlug] = useState("");
  const [slugError, setSlugError] = useState(false);
  const [status, setStatus] = useState("active");

  // All possible tags
  const allTags = [
    "React", "JavaScript", "UI", "CSS", "Node.js", "API", "Databases", "Go", "SQL", "Python",
    "Visualization", "Excel", "TensorFlow", "AI", "Data", "MongoDB", "AWS", "Kubernetes",
    "DevOps", "Networking", "Docker", "CI/CD", "Linux", "HTML", "Teamwork", "Testing",
    "Automation", "Selenium", "Agile", "Roadmap", "Leadership", "Communication", "ETL",
    "Pipelines", "Figma", "Prototyping", "Accessibility", "React Native", "Android", "iOS",
    "Security", "Monitoring", "Network", "Threat Detection", "TypeScript", "Performance",
    "PostgreSQL", "Microservices", "Architecture", "Scalability", "Deep Learning", "Research",
    "Routers", "TCP/IP", "Terraform", "MySQL", "Backup", "Documentation", "Writing", "Editing",
    "Unity", "C#", "3D", "Graphics", "Customer Support", "Troubleshooting", "ML", "Statistics",
    "Planning", "Solidity", "Ethereum", "Smart Contracts", "Web3", "C++", "IoT", "Microcontrollers",
    "Hardware", "Cloud", "Pandas", "Support"
  ];

  // Auto-generate slug whenever name changes
  useEffect(() => {
    if (name.trim()) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") // replace spaces/symbols with dashes
        .replace(/(^-|-$)+/g, ""); // trim leading/trailing dashes
      setSlug(generatedSlug);
      setSlugError(false); // reset slug error if name changes
    } else {
      setSlug("");
    }
  }, [name]);

  function handleTagClick(tag) {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags(Array.from(new Set([...tags, tag])));
    }
  }

  function handleTagCancel(selectedTag) {
    setTags(tags.filter((tag) => tag !== selectedTag));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a job title before submitting.");
      return;
    }

    try {
      const res = await axios.post("/api/jobadd", { title: name, tags, status, slug });
      console.log("Job added successfully:", res.data);
      alert("Job added successfully!");
      setName("");
      setTags([]);
      setSlug("");
      setSlugError(false);
      setStatus("active");
    } catch (err) {
      if (err.response?.data?.error === "slug already exists for another job.change the slug") {
        setSlugError(true);
      }
      console.error("Error when adding job:", err);
    }
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 space-y-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">Add New Job</h2>

        {/* Job Title */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">Job Title</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
            placeholder="Enter job title"
            required
          />
        </div>

        {/* Slug (auto-generated) */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">Slug (auto-generated)</label>
          <input
            type="text"
            value={slug}
            readOnly
            className={`border rounded-xl px-3 py-2 text-gray-700 bg-gray-100 ${
              slugError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {slugError && (
            <p className="text-red-600 text-sm font-medium">
              Slug already exists for another job. Please change the job title.
            </p>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Tags Section */}
        <div className="flex flex-col gap-3">
          <label className="text-gray-700 font-semibold">Tags</label>

          {/* Selected Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.length === 0 ? (
              <p className="text-gray-500 text-sm">No tags selected</p>
            ) : (
              tags.map((selectedTag) => (
                <div
                  key={selectedTag}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm shadow-sm"
                >
                  <span>{selectedTag}</span>
                  <button
                    type="button"
                    onClick={() => handleTagCancel(selectedTag)}
                    className="hover:bg-blue-600 rounded-full p-1 transition"
                  >
                    <img src="/close.png" alt="Remove" width={30} height={30} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Tag Selector */}
          <select
            onChange={(e) => handleTagClick(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">-- Select Tag --</option>
            {allTags
              .filter((tag) => !tags.includes(tag))
              .map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl shadow transition"
          >
            Add Job
          </button>
        </div>
      </form>
    </div>
  );
}
