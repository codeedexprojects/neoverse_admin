import React, { useState, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit2,
} from "lucide-react";
import { getInvestment } from "../api";
import StatusModal from "../Components/StatusModal";

const InvestmentList = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null); // Fixed: Added missing state
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getInvestment();
      setInvestments(response.investments || []);
      setTotalPages(response.totalPages || 1);
      setTotal(response.total || 0);
    } catch (err) {
      setError("Failed to load investments. Please try again.");
      console.error("Error fetching investments:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: {
        icon: CheckCircle,
        classes: "bg-green-100 text-green-800 border-green-200",
        text: "Approved",
      },
      pending: {
        icon: Clock,
        classes: "bg-yellow-100 text-yellow-800 border-yellow-200",
        text: "Pending",
      },
      rejected: {
        icon: XCircle,
        classes: "bg-red-100 text-red-800 border-red-200",
        text: "Rejected",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.classes}`}
      >
        <IconComponent size={12} />
        {config.text}
      </span>
    );
  };

  // Fixed: Corrected function name and variable names
  const handleOpenModal = (investment) => {
    setSelectedInvestment(investment);
    setModalOpen(true);
  };

  // Fixed: Updated to handle investments instead of withdrawals
  const handleUpdate = (newStatus) => {
    setInvestments((prev) =>
      prev.map((investment) =>
        investment._id === selectedInvestment._id 
          ? { ...investment, status: newStatus } 
          : investment
      )
    );
    setModalOpen(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading investments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <div className="flex-1">
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={fetchInvestments}
              className="text-red-600 hover:text-red-800 font-medium text-sm"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment</h1>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Investments
                </p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
              <DollarSign className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    investments.filter((inv) => inv.status === "approved")
                      .length
                  }
                </p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {investments.filter((inv) => inv.status === "pending").length}
                </p>
              </div>
              <Clock className="text-yellow-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    investments.reduce((sum, inv) => sum + inv.amount, 0)
                  )}
                </p>
              </div>
              <DollarSign className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        {/* Investment Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">
                    Investor
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">
                    Created
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">
                    Notes
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {investments.map((investment) => (
                  <tr key={investment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {investment.user.firstName}{" "}
                            {investment.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {investment.user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {investment.userId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-lg text-gray-900">
                        {formatCurrency(investment.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(investment.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        {formatDate(investment.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {investment.adminNote ? (
                          <p
                            className="text-sm text-gray-600 truncate"
                            title={investment.adminNote}
                          >
                            {investment.adminNote}
                          </p>
                        ) : (
                          <span className="text-gray-400">No notes</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <Edit2
                          className={`w-5 h-5 cursor-pointer ${
                            investment.status === "approved" ||
                            investment.status === "rejected"
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-600 hover:text-blue-600 transition-colors"
                          }`}
                          onClick={() =>
                            !(
                              investment.status === "approved" ||
                              investment.status === "rejected"
                            ) && handleOpenModal(investment)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {investments.length === 0 && !loading && (
            <div className="text-center py-16">
              <DollarSign className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No investments found
              </h3>
              <p className="text-gray-600">No investment requests have been made yet.</p>
            </div>
          )}
        </div>
        <StatusModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onUpdate={handleUpdate}
          currentStatus={selectedInvestment?.status}
          investmentId={selectedInvestment?._id}
        />
      </div>
    </div>
  );
};

export default InvestmentList;