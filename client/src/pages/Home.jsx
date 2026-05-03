/**
 * Home.jsx — Landing page with the URL shortening form.
 * Features: URL input, optional custom alias, result display with copy button.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Zap, BarChart2, Fingerprint, Link2, Copy, QrCode, Scissors, ChevronRight, ArrowRight } from "lucide-react";
import { shortenUrl } from "../services/api";
import QRCodeModal from "../components/QRCodeModal";

const Home = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [result, setResult] = useState(null);   // Holds the API response data
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await shortenUrl(originalUrl.trim(), customAlias.trim());
      setResult(res.data.data);
      toast.success("Short URL created!");
      setOriginalUrl("");
      setCustomAlias("");
    } catch (err) {
      const msg = err.response?.data?.error || "Something went wrong. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* ── Hero Section ── */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 animate-fade-in">
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
          Free URL Shortener
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-5 animate-slide-up leading-tight">
          Shorten. Share.{" "}
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Track.
          </span>
        </h1>

        <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto animate-fade-in">
          Transform long URLs into clean, trackable short links in seconds.
          No sign-up required.
        </p>

        {/* ── Shortener Form ── */}
        <div className="card p-6 sm:p-8 animate-slide-up max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Main URL input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Link2 className="w-5 h-5" />
              </span>
              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="Paste your long URL here — https://example.com/very/long/url"
                className="input-field pl-12 text-base"
                required
              />
            </div>

            {/* Custom alias input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium select-none">
                snap/
              </span>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value.replace(/\s/g, ""))}
                placeholder="custom-alias (optional)"
                className="input-field pl-14 text-base"
                maxLength={30}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Shortening…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Scissors className="w-4 h-4" />
                  Shorten URL
                </span>
              )}
            </button>
          </form>

          {/* ── Result Box ── */}
          {result && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-700 animate-slide-up">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                Your short link is ready!
              </p>

              {/* Short URL + action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-purple-700 dark:text-purple-300 font-semibold text-lg hover:underline break-all"
                >
                  {result.shortUrl}
                </a>

                {/* Copy */}
                <button onClick={() => handleCopy(result.shortUrl)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors">
                  <Copy className="w-4 h-4" />
                  Copy
                </button>

                {/* QR Code */}
                <button onClick={() => setShowQR(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors">
                  <QrCode className="w-4 h-4" />
                  QR
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Original: <span className="break-all">{result.originalUrl}</span>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Feature Highlights ── */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Instant */}
          <div className="card p-6 text-center hover:scale-105 transition-transform duration-200 group">
            <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-amber-200 dark:group-hover:shadow-amber-900 transition-shadow">
              <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">Instant</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Generate a short link in milliseconds with zero friction.
            </p>
          </div>

          {/* Analytics */}
          <div className="card p-6 text-center hover:scale-105 transition-transform duration-200 group">
            <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-purple-200 dark:group-hover:shadow-purple-900 transition-shadow">
              <BarChart2 className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">Analytics</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track every click with real-time visit counters.
            </p>
          </div>

          {/* Custom Alias */}
          <div className="card p-6 text-center hover:scale-105 transition-transform duration-200 group">
            <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg group-hover:shadow-pink-200 dark:group-hover:shadow-pink-900 transition-shadow">
              <Fingerprint className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">Custom Alias</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create memorable branded links with your own slug.
            </p>
          </div>
        </div>

        {/* CTA to Dashboard */}
        <div className="mt-8 text-center">
          <Link to="/dashboard"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium hover:underline group">
            View all your links in the Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {showQR && result && (
        <QRCodeModal url={result.shortUrl} onClose={() => setShowQR(false)} />
      )}
    </div>
  );
};

export default Home;
