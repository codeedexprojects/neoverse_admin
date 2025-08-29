import React, { useState, useEffect } from "react";
import { updateInvestment } from "../api";
import { toast, Toaster } from "sonner";

function StatusModal({ isOpen, onClose, onUpdate, currentStatus, investmentId }) {
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    if (currentStatus) {
      setStatus(currentStatus);
    }
  }, [currentStatus]);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    try {
      const requestBody = {
        action: status,
        adminNote: adminNote || ""
      };
      
      const response = await updateInvestment(investmentId, requestBody);
      setMessage(response.message || "Updated successfully!");
      if (onUpdate) onUpdate(status);
      toast.success("Investment status updated successfully!");
      setTimeout(() => {
        onClose();
        setAdminNote("");
        setMessage("");
      }, 1000);
    } catch (error) {
      console.error("Update error:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      setMessage(errorMessage);
      toast.error("Update failed: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setAdminNote("");
      setMessage("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative mx-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          disabled={loading}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Update Investment Status
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="pending">Pending</option>
            <option value="approve">Approved</option>
            <option value="reject">Rejected</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Note (Optional)
          </label>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            disabled={loading}
            placeholder="Add any notes about this decision..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 resize-none"
          />
        </div>

        {message && (
          <div className={`text-sm mb-3 p-2 rounded ${
            message.includes('success') || message.includes('Updated') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default StatusModal;