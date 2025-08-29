import React, { useState, useEffect } from 'react';
import { User, Mail, Loader2, AlertCircle } from 'lucide-react';
import { getAllProfiles } from '../api';


const ListProfiles = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllProfiles();
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData || !profileData.profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No profile data found.</p>
        </div>
      </div>
    );
  }

  const { profile } = profileData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className=" px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Profile
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div className="flex justify-center"> {/* Center the card */}
    <div className="w-full max-w-3xl"> {/* Wider card, but with max width */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Profile Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> {/* 2-column layout inside */}
          <div>
            <label className="text-sm font-medium text-gray-600">User ID</label>
            <p className="text-gray-900 font-mono">{profile.userId}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">First Name</label>
            <p className="text-gray-900 font-mono">{profile.firstName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Last Name</label>
            <p className="text-gray-900 font-mono">{profile.lastName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Referral ID</label>
            <p className="text-gray-900 font-mono">{profile.referralId}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Referral Wallet</label>
            <p className="text-gray-900 font-mono">${profile.wallet}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Investment Wallets</label>
            <p className="text-gray-900 font-mono">${profile.investmentWallet}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Total Investments</label>
            <p className="text-gray-900 font-mono">${profile.totalInvestments}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Referral Earnings</label>
            <p className="text-gray-900 font-mono">${profile.totalEarnings}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-gray-900">{profile.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Created</label>
            <p className="text-gray-900 text-sm">{formatDate(profile.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default ListProfiles;