import React, { useEffect, useState } from "react";
import { getWithdrawal, countWithdrawal } from "../api";
import { Loader2, AlertCircle, DollarSign, User, Calendar, Edit2 } from "lucide-react";
import UpdateModal from "../Components/UpdateModal";

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [withdrawalData, statsData] = await Promise.all([
          getWithdrawal(),
          countWithdrawal(),
        ]);

        setWithdrawals(withdrawalData.withdrawals || []);
        setStats(statsData.stats || {});
      } catch (err) {
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (item) => {
    setSelectedWithdrawal(item);
    setModalOpen(true);
  };

  const handleUpdate = (newStatus) => {
    setWithdrawals((prev) =>
      prev.map((w) =>
        w._id === selectedWithdrawal._id ? { ...w, status: newStatus } : w
      )
    );
    setModalOpen(false);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600"><AlertCircle className="w-6 h-6 mr-2" /> {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Withdrawals</h1>

      {/* Stats Header */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(stats).map(([key, value]) => (
            <div
              key={key}
              className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 text-center"
            >
              <h2 className="text-sm font-medium text-gray-600 capitalize">{key}</h2>
              <p className="text-xl font-bold text-gray-900 mt-1">{value.count}</p>
            </div>
          ))}
        </div>
      )}

      {/* Withdrawals List */}
      {withdrawals.length === 0 ? (
        <p className="text-gray-600">No withdrawals found.</p>
      ) : (
        <div className="space-y-6">
          {withdrawals.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-sm rounded-xl border border-gray-200 p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* User Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="font-semibold text-gray-900">
                    {item.user?.firstName} {item.user?.lastName}
                  </h2>
                </div>
                <p className="text-sm text-gray-600">User ID: {item.userId}</p>
                <p className="text-sm text-gray-600">Email: {item.user?.email}</p>
              </div>

              {/* Withdrawal Info */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  <h2 className="font-semibold text-gray-900">Withdrawal</h2>
                </div>
                <p className="text-gray-900 font-mono text-lg">${item.amount}</p>
                <p
                  className={`text-sm font-semibold mt-2 ${
                    item.status === "approved"
                      ? "text-green-600"
                      : item.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  Status: {item.status}
                </p>
              </div>

              {/* Details + Edit */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                  <h2 className="font-semibold text-gray-900">Details</h2>
                  <Edit2
                    className={`w-4 h-4 ml-5 cursor-pointer ${
                      item.status === "approved" || item.status === "rejected"
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:text-purple-600"
                    }`}
                    onClick={() =>
                      !(item.status === "approved" || item.status === "rejected") &&
                      handleOpenModal(item)
                    }
                  />
                </div>
                <p className="text-sm text-gray-600">Created: {formatDate(item.createdAt)}</p>
                <p className="text-sm text-gray-600">Processed: {formatDate(item.processedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <UpdateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdate={handleUpdate}
        currentStatus={selectedWithdrawal?.status}
        withdrawalId={selectedWithdrawal?._id}
      />
    </div>
  );
};

export default Withdrawals;
