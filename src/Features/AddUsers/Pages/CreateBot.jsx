import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Bot, Coins } from "lucide-react";
import AddModal from "../Components/Modals/AddModal";
import EditModal from "../Components/Modals/EditModal";
import { toast, Toaster } from "sonner";
import { deleteBot, getAllBot } from "../api";
import DeleteConfirmationModal from "../../../Components/shared/DeleteModal";

export default function CreateBot() {
  const [bots, setBots] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBot, setEditingBot] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); 


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const data = await getAllBot();
        setBots(data.bots);
      } catch (error) {
        toast.error("Failed to fetch bots");
      }
    };
    fetchBots();
  }, []);

  const handleDeleteClick = (bot) => {
    setListToDelete(bot);
    setIsDeleteModalOpen(true);
  };

  const handleEditBot = (bot) => {
  setEditingBot(bot);       
  setShowEditModal(true);   
};


  const handleConfirmDelete = async () => {
    if (!listToDelete) return;

    setIsDeleting(true);
    try {
 await deleteBot(listToDelete._id); 
  setBots((prev) => prev.filter((b) => b._id !== listToDelete._id));
      toast.success("Bot deleted successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete Bot";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setListToDelete(null);
    }
  };

const handleUpdateBot = async () => {
  if (!editingBot) return;

  try {
    const updatedData = {
      name: editingBot.name,
      price: Number(editingBot.price) || 0, // ensure price is a number
    };

    const res = await updateBot(editingBot._id, updatedData);

    // Update state immediately so UI reflects changes
    setBots((prevBots) =>
      prevBots.map((b) =>
        b._id === editingBot._id ? { ...b, ...res.data } : b
      )
    );

    toast.success("Bot updated successfully");
    setShowEditModal(false);
    setEditingBot(null);
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update bot");
  }
};



  return (
    <div className="min-h-screen ">
      <div className="container  px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Bot Management
            </h1>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Add New Bot
          </button>
        </div>

        {bots.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Bot className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No bots found
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first bot
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add Your First Bot
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map((bot) => (
              <div
                key={bot._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Coins className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {bot.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ID:{bot._id.slice(-8)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditBot(bot)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit bot"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(bot)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete bot"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Price</span>
                      <span className="text-lg font-bold text-green-600">
                        ${bot.price}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Created: {formatDate(bot.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AddModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          setBots={setBots}
        />

<EditModal
  isOpen={showEditModal}
  onClose={() => setShowEditModal(false)}
  bot={editingBot}
  setBots={setBots}
/>

        <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={listToDelete?.name}
        isLoading={isDeleting}
      />
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
