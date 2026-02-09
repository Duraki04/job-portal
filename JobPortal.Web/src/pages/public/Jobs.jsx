import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../api/http";
import { Briefcase, MapPin, ArrowRight, RefreshCw } from "lucide-react";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadJobs() {
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/api/Job"); // ✅ FIXED
      setJobs(res);
    } catch (err) {
      setError(err.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-white text-lg">
        Loading jobs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass p-10 text-center text-rose-200">
        <p className="font-bold">Could not load jobs</p>
        <p className="text-sm mt-2">{error}</p>
        <button onClick={loadJobs} className="btn-primary mt-5">
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="text-center py-20 text-white">
        No jobs available.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {jobs.map((job) => (
        <div key={job.id} className="glass p-6">
          <div className="flex items-center gap-3">
            <Briefcase />
            <h3 className="text-xl font-bold">{job.title}</h3>
          </div>

          <div className="mt-3 text-sm text-slate-300">
            {job.description?.substring(0, 120)}...
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <MapPin size={16} />
            {job.city}
          </div>

          <Link
            to={`/jobs/${job.id}`}
            className="btn-primary mt-5 inline-flex"
          >
            View Details
            <ArrowRight size={16} />
          </Link>
        </div>
      ))}
    </div>
  );
}
