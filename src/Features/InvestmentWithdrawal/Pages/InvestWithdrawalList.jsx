import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, User, Clock, CheckCircle, XCircle, AlertCircle, Edit2, TrendingDown, Edit } from 'lucide-react';
import { getinvestwithdrawal } from '../api';
import UpdateModal from '../Components/UpdateModal';

const InvestWithdrawalList = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvestmentwithdraw, setSelectedInvestmentwithdraw] = useState(null);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getinvestwithdrawal();
      setWithdrawals(response.investmentwithdrawals || []);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(response.currentPage || 1);
      setTotal(response.total || 0);
    } catch (err) {
      setError('Failed to load investment withdrawals. Please try again.');
      console.error('Error fetching withdrawals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (withdrawal) => {
    setSelectedInvestmentwithdraw(withdrawal);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedInvestmentwithdraw(null);
  };

  const handleUpdate = (newStatus) => {
    if (selectedInvestmentwithdraw) {
      setWithdrawals(prev => 
        prev.map(withdrawal => 
          withdrawal._id === selectedInvestmentwithdraw._id 
            ? { ...withdrawal, status: newStatus }
            : withdrawal
        )
      );
      fetchWithdrawals();
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: {
        icon: CheckCircle,
        classes: 'bg-green-100 text-green-800 border-green-200',
        text: 'Approved'
      },
      pending: {
        icon: Clock,
        classes: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        text: 'Pending'
      },
      rejected: {
        icon: XCircle,
        classes: 'bg-red-100 text-red-800 border-red-200',
        text: 'Rejected'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.classes}`}>
        <IconComponent size={12} />
        {config.text}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading investment withdrawals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Investment Withdrawals</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Withdrawals</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{total}</p>
              </div>
              <TrendingDown className="text-red-600" size={28} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {withdrawals.filter(w => w.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={28} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {withdrawals.filter(w => w.status === 'pending').length}
                </p>
              </div>
              <Clock className="text-yellow-600" size={28} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {formatCurrency(withdrawals.reduce((sum, w) => sum + w.amount, 0))}
                </p>
              </div>
              <DollarSign className="text-blue-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="block lg:hidden">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal._id} className="p-4 border-b border-gray-200 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="text-blue-600" size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {withdrawal.user.firstName} {withdrawal.user.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{withdrawal.user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(withdrawal.status)}
                    <Edit2
                      className={`w-4 h-4 cursor-pointer ${
                        withdrawal.status === "approved" ||
                        withdrawal.status === "rejected"
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-600 hover:text-blue-600 transition-colors"
                      }`}
                      onClick={() =>
                        !(
                          withdrawal.status === "approved" ||
                          withdrawal.status === "rejected"
                        ) && handleOpenModal(withdrawal)
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Amount:</span>
                    <div className="font-semibold text-lg text-gray-900">
                      {formatCurrency(withdrawal.amount)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">User ID:</span>
                    <div className="font-medium">{withdrawal.userId}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <div>{formatDate(withdrawal.createdAt)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Processed:</span>
                    <div>
                      {withdrawal.processedBy ? (
                        <div className="text-xs">
                          <div>{withdrawal.processedBy.firstName} {withdrawal.processedBy.lastName}</div>
                          <div className="text-gray-500">{formatDate(withdrawal.processedAt)}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not processed</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {withdrawal.adminNote && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-gray-500 text-xs">Note:</span>
                    <p className="text-sm text-gray-600 mt-1">{withdrawal.adminNote}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">User</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Created</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Processed By</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Notes</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {withdrawal.user.firstName} {withdrawal.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{withdrawal.user.email}</div>
                          <div className="text-sm text-gray-500">ID: {withdrawal.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-lg text-gray-900">
                        {formatCurrency(withdrawal.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(withdrawal.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        {formatDate(withdrawal.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {withdrawal.processedBy ? (
                        <div>
                          <div className="font-medium text-gray-900">
                            {withdrawal.processedBy.firstName} {withdrawal.processedBy.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(withdrawal.processedAt)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not processed</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {withdrawal.adminNote ? (
                          <p className="text-sm text-gray-600 truncate" title={withdrawal.adminNote}>
                            {withdrawal.adminNote}
                          </p>
                        ) : (
                          <span className="text-gray-400">No notes</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Edit2
                        className={`w-5 h-5 cursor-pointer ${
                          withdrawal.status === "approved" ||
                          withdrawal.status === "rejected"
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-600 hover:text-blue-600 transition-colors"
                        }`}
                        onClick={() =>
                          !(
                            withdrawal.status === "approved" ||
                            withdrawal.status === "rejected"
                          ) && handleOpenModal(withdrawal)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {withdrawals.length === 0 && !loading && (
            <div className="text-center py-16">
              <TrendingDown className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No withdrawals found</h3>
            </div>
          )}
        </div>
      </div>
      <UpdateModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdate}
        currentStatus={selectedInvestmentwithdraw?.status}
        investmentId={selectedInvestmentwithdraw?._id}
      />
    </div>
  );
};

export default InvestWithdrawalList;