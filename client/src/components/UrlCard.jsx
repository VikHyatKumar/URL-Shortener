/**
 * UrlCard.jsx — Reusable card component rendered in the Dashboard table.
 * Handles copy, QR, edit, and delete actions inline.
 */
import { useState } from "react";
import toast from "react-hot-toast";
import { Copy, QrCode, Pencil, Trash2, Eye } from "lucide-react";
import QRCodeModal from "./QRCodeModal";

const UrlCard = ({ url, onDelete, onEdit }) => {
  const [showQR, setShowQR] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(url.originalUrl);
  const [saving, setSaving] = useState(false);

  // Copy short URL to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(url.shortUrl);
    toast.success("Copied to clipboard!");
  };

  // Confirm and submit the edited URL
  const handleEditSave = async () => {
    if (!editValue.trim() || editValue === url.originalUrl) {
      setEditing(false);
      return;
    }
    setSaving(true);
    await onEdit(url._id, editValue.trim());
    setSaving(false);
    setEditing(false);
  };

  // Format date for display
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-purple-50/40 dark:hover:bg-purple-900/10 transition-colors group">
        {/* Original URL cell — editable inline */}
        <td className="py-4 px-4 max-w-xs">
          {editing ? (
            <div className="flex gap-2">
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="input-field text-sm py-1.5 px-3"
                autoFocus
              />
              <button onClick={handleEditSave} disabled={saving}
                className="btn-primary text-xs py-1.5 px-3">
                {saving ? "…" : "Save"}
              </button>
              <button onClick={() => { setEditing(false); setEditValue(url.originalUrl); }}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
            </div>
          ) : (
            <a href={url.originalUrl} target="_blank" rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm truncate block max-w-xs"
              title={url.originalUrl}>
              {url.originalUrl.length > 50
                ? url.originalUrl.slice(0, 50) + "…"
                : url.originalUrl}
            </a>
          )}
        </td>

        {/* Short URL cell */}
        <td className="py-4 px-4">
          <div className="flex items-center gap-2">
            <a href={url.shortUrl} target="_blank" rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium text-sm">
              {url.shortUrl.replace(/^https?:\/\//, "")}
            </a>
            <button onClick={handleCopy} title="Copy"
              className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-purple-600 transition-all">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </td>

        {/* Clicks badge */}
        <td className="py-4 px-4 text-center">
          <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full">
            <Eye className="w-3 h-3" />
            {url.clickCount}
          </span>
        </td>

        {/* Created date */}
        <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
          {formatDate(url.createdAt)}
        </td>

        {/* Action buttons */}
        <td className="py-4 px-4">
          <div className="flex items-center gap-2">
            {/* QR Code */}
            <button onClick={() => setShowQR(true)} title="QR Code"
              className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all">
              <QrCode className="w-4 h-4" />
            </button>

            {/* Edit */}
            <button onClick={() => setEditing(true)} title="Edit"
              className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all">
              <Pencil className="w-4 h-4" />
            </button>

            {/* Delete */}
            <button onClick={() => onDelete(url._id)} title="Delete"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* QR Modal */}
      {showQR && <QRCodeModal url={url.shortUrl} onClose={() => setShowQR(false)} />}
    </>
  );
};

export default UrlCard;
