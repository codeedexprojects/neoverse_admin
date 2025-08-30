import React, { useState, useEffect } from 'react';
import { User, Wallet, CreditCard, Users } from 'lucide-react';
import { dashboard } from '../api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboard();
        setDashboardData(data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );
  }

  if (!dashboardData?.adminStats) return null;

  const { adminStats } = dashboardData;

  const cards = [
    {
      title: "Active Wallet",
      value: `$${adminStats.activeWallet}`,
      icon: <Wallet className="h-8 w-8" />,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Available Wallet",
      value: `$${adminStats.availableWallet}`,
      icon: <CreditCard className="h-8 w-8" />,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Referral Usage",
      value: adminStats.referralUsage,
      icon: <Users className="h-8 w-8" />,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Total Users",
      value: adminStats.totalUsers,
      icon: <Users className="h-8 w-8" />,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Bots",
      value: adminStats.totalBots,
      icon: <User className="h-8 w-8" />,
      color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {cards.map((card, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bgColor} p-3 rounded-xl`}>
                  <div className={card.textColor}>
                    {card.icon}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-slate-600 text-sm font-medium mb-2">{card.title}</h3>
                <p className="text-3xl font-bold text-slate-900">{card.value}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className={`w-full h-2 rounded-full ${card.color} opacity-20`}></div>
                <div className={`w-3/4 h-2 rounded-full ${card.color} -mt-2`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
