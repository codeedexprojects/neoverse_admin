import React, { useState } from "react";
import { createBot } from "../../api";
import { toast, Toaster } from "sonner";



export default function AddModal({ isOpen, onClose,  }) {
const [bot, setBot] = useState({ name: "", price: "" });
  const [bots, setBots] = useState([]);
    if (!isOpen) return null;

  
const handleCreateBot = async () => {
    if (bot.name && bot.price) {
      try {
        const response = await createBot(bot);
        const createdBot = response.bot; // single bot from API

        // Add new bot to the existing list
        setBots((prev) => [...prev, createdBot]);

        // Reset form fields
        setBot({ name: "", price: "" });

        onClose();
        toast.success(response.message || "Bot created successfully");
      } catch (error) {
        console.error("Error creating bot:", error);
        toast.error("Failed to create bot. Please try again.");
      }
    } else {
      toast.warning("Please enter both name and price");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add New Bot</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bot Name</label>
            <input
              type="text"
              value={bot.name}
              onChange={(e) => setBot({ ...bot, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter bot name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              value={bot.price}
              onChange={(e) => setBot({ ...bot, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter price"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateBot}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Bot
            </button>
          </div>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
