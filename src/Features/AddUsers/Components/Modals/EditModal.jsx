import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { updateBot } from "../../api";


export default function EditModal({ isOpen, onClose, bot, setBots }) {
  const [formData, setFormData] = useState({ name: "", price: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bot) {
      setFormData({
        name: bot.name || "",
        price: bot.price || "",
      });
    }
  }, [bot]);

  if (!isOpen) return null;

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      toast.error("Bot name is required");
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        name: formData.name,
        price: Number(formData.price) || 0,
      };

      const res = await updateBot(bot._id, updatedData);
      setBots((prevBots) =>
        prevBots.map((b) => (b._id === bot._id ? { ...b, ...res.data } : b))
      );

      toast.success("Bot updated successfully");
      onClose(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update bot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Edit Bot</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bot Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter bot name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter price"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Bot"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
