/**
 * Dashboard.jsx — Shows all shortened URLs in a searchable, sortable table.
 * Features: search/filter, delete, edit, QR, click analytics, responsive layout.
 */
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Link2, Eye, TrendingUp, CheckCircle2, Search, X } from "lucide-react";
import { getAllUrls, deleteUrl, editUrl } from "../services/api";
import UrlCard from "../components/UrlCard";

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [stats, setStats] = useState({ total: 0, totalClicks: 0 });

  // Debounce search input by 400ms to avoid hammering the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllUrls(debouncedSearch);
      const data = res.data.data;
      setUrls(data);
      setStats({
        total: data.length,
        totalClicks: data.reduce((sum, u) => sum + u.clickCount, 0),
      });
    } catch {
      toast.error("Failed to load URLs.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this URL? This cannot be undone.")) return;
    try {
      await deleteUrl(id);
      toast.success("URL deleted.");
      setUrls((prev) => prev.filter((u) => u._id !== id));
      setStats((prev) => ({ ...prev, total: prev.total - 1 }));
    } catch {
      toast.error("Delete failed. Try again.");
    }
  };

  const handleEdit = async (id, newUrl) => {
    try {
      const res = await editUrl(id, newUrl);
      toast.success("URL updated.");
      setUrls((prev) =>
        prev.map((u) => (u._id === id ? { ...u, ...res.data.data } : u))
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed.");
      throw err; // Let UrlCard know the save failed so it can reset state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* ── Header ── */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
            My Links
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage, track, and analyse all your shortened URLs.
          </p>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-fade-in">
          {[
            {
              label: "Total Links",
              value: stats.total,
              Icon: Link2,
              color: "from-purple-500 to-indigo-500",
            },
            {
              label: "Total Clicks",
              value: stats.totalClicks,
              Icon: Eye,
              color: "from-pink-500 to-rose-500",
            },
            {
              label: "Avg Clicks",
              value: stats.total ? (stats.totalClicks / stats.total).toFixed(1) : 0,
              Icon: TrendingUp,
              color: "from-amber-500 to-orange-500",
            },
            {
              label: "Active",
              value: urls.filter((u) => u.clickCount > 0).length,
              Icon: CheckCircle2,
              color: "from-emerald-500 to-teal-500",
            },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="card p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow`}>
                <Icon className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search Bar ── */}
        <div className="card p-4 mb-6 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by URL or short code…"
              className="input-field pl-12"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="card overflow-hidden animate-slide-up">
          {loading ? (
            /* Skeleton loader */
            <div className="p-8 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : urls.length === 0 ? (
            /* Empty state */
            <div className="py-20 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                {search ? "No URLs match your search." : "No URLs yet. Go shorten something!"}
              </p>
            </div>
          ) : (
            /* Scrollable table */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/60 border-b border-gray-100 dark:border-gray-700">
                    {["Original URL", "Short URL", "Clicks", "Created", "Actions"].map((h) => (
                      <th key={h}
                        className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {urls.map((url) => (
                    <UrlCard
                      key={url._id}
                      url={url}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Row count footer */}
        {!loading && urls.length > 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-3 text-right">
            Showing {urls.length} {urls.length === 1 ? "link" : "links"}
            {search && ` matching "${search}"`}
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
