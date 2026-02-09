import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../../api/http";
import { Briefcase, MapPin } from "lucide-react";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch(`/api/Job/${id}`); // ✅ FIXED
        setJob(res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  if (error)
    return (
      <div className="text-center py-20 text-rose-200">
        {error}
      </div>
    );

  if (!job) return null;

  return (
    <div className="glass p-10">
      <div className="flex items-center gap-3">
        <Briefcase />
        <h1 className="text-3xl font-bold">{job.title}</h1>
      </div>

      <div className="mt-4 text-slate-300">{job.description}</div>

      <div className="mt-6 flex items-center gap-2 text-slate-400">
        <MapPin size={18} />
        {job.city}
      </div>

      <div className="mt-6 text-lg font-semibold text-indigo-400">
        Salary: {job.salaryMin} - {job.salaryMax}
      </div>
    </div>
  );
}
