import React, { useState, useEffect } from "react";
import { updatewithdrawal } from "../api";
import { toast, Toaster } from "sonner";

function UpdateModal({ isOpen, onClose, onUpdate, currentStatus, withdrawalId }) {
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Update status whenever currentStatus changes
  useEffect(() => {
    if (currentStatus) {
      setStatus(currentStatus);
    }
  }, [currentStatus]);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await updatewithdrawal(withdrawalId, status);
      setMessage(response.message);
      if (onUpdate) onUpdate(status);
      toast.success("Updated successfully!");
    } catch (error) {
      setMessage("Something went wrong!");
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Update Withdrawal Status</h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="approved">Approve</option>
          <option value="rejected">Reject</option>
          <option value="pending">Pending</option>
        </select>

        {message && <p className="text-sm mb-3 text-blue-600 font-medium">{message}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default UpdateModal;
