/**
 * QRCodeModal.jsx — Modal overlay that displays a QR code for a short URL.
 * Uses the qrcode.react library; user can close by clicking the backdrop.
 */
import { QRCodeSVG } from "qrcode.react";

const QRCodeModal = ({ url, onClose }) => {
  if (!url) return null;

  const handleBackdropClick = (e) => {
    // Close only when the backdrop itself is clicked, not the modal content
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="card p-8 flex flex-col items-center gap-5 max-w-sm w-full mx-4 animate-slide-up">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">QR Code</h3>

        {/* QR code rendered as an SVG for crisp scaling */}
        <div className="p-4 bg-white rounded-xl shadow-inner">
          <QRCodeSVG
            value={url}
            size={200}
            bgColor="#ffffff"
            fgColor="#4f46e5"
            level="H"
            includeMargin
          />
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center break-all">
          {url}
        </p>

        {/* Download as PNG via canvas trick */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
