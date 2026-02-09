import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/http"; // ✅ axios instance
import { Briefcase, MapPin, RefreshCw } from "lucide-react";

export default function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    setJob(null);

    try {
      // ✅ Swagger: GET /api/Job/{id}
      const res = await api.get(`/api/Job/${id}`);
      setJob(res.data ?? null);
    } catch (err) {
      setError(err?.message || "Failed to load job.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-white">Loading...</div>;
  }

  if (error) {
    return (
      <div className="glass p-10 text-center text-rose-200">
        <div className="font-bold">Could not load job</div>
        <div className="mt-2 text-sm whitespace-pre-line">{error}</div>

        <button onClick={load} className="btn-primary mt-5">
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  if (!job) return null;

  const salaryMin = job.salaryMin ?? null;
  const salaryMax = job.salaryMax ?? null;

  return (
    <div className="glass p-10">
      <div className="flex items-center gap-3">
        <Briefcase className="text-white" />
        <h1 className="text-3xl font-bold text-white">{job.title}</h1>
      </div>

      <div className="mt-4 text-slate-300 whitespace-pre-wrap">
        {job.description || "No description provided."}
      </div>

      <div className="mt-6 flex items-center gap-2 text-slate-400">
        <MapPin size={18} />
        {job.city || "—"}
      </div>

      <div className="mt-6 text-lg font-semibold text-indigo-300">
        Salary:{" "}
        {salaryMin === null && salaryMax === null
          ? "Not specified"
          : `${salaryMin ?? "—"} - ${salaryMax ?? "—"} €`}
      </div>
    </div>
  );
}
