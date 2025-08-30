import React, { useEffect, useState } from "react";
import {
  User, Mail, Phone, MapPin, Lock, Settings, Users
} from "lucide-react";
import { getAllBot } from "../../AddUsers/api";
import { useSearchParams } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { createUser } from "../api";


const Usercreate = () => {
  const [searchParams] = useSearchParams();
  const placementIdFromTree = searchParams.get("placementId") || "";
  const positionFromTree = searchParams.get("position") || "";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    mobile: "",
    password: "",
    position: positionFromTree,
    referredId: "",
    botPlanId: "",
    placementId: placementIdFromTree,
  });

  const [bots, setBots] = useState([]);
  const [selectedBot, setSelectedBot] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const data = await getAllBot();
        setBots(data.bots || []);
      } catch (error) {
        console.error("Failed to fetch bots:", error);
      }
    };
    fetchBots();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobile || !formData.password ||!formData.position ||!formData.referredId) {
      toast.warning("Please fill all required fields!");
      return;
    }

    try {
      setLoading(true);
      const reqBody = {
        ...formData,
        botPlanId: selectedBot,  
      };
      const res = await createUser(reqBody); 
      if (res?.message) {
        toast.success(res.message);
        console.log("Created User:", res.user);
      }
    } catch (err) {
      toast.error("Failed to create user!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8 px-4">
      <div>
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-xl">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Create New User
          </h1>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white/50">
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <input name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleInputChange} className="border rounded-xl px-4 py-3 w-full" />
                <input name="lastName" placeholder="Last Name *" value={formData.lastName} onChange={handleInputChange} className="border rounded-xl px-4 py-3 w-full" />
              </div>
              <input name="email" type="email" placeholder="Email *" value={formData.email} onChange={handleInputChange} className="border rounded-xl px-4 py-3 w-full mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input name="mobile" placeholder="Mobile *" value={formData.mobile} onChange={handleInputChange} className="border rounded-xl px-4 py-3 w-full" />
                <input name="password" type="password" placeholder="Password *" value={formData.password} onChange={handleInputChange} className="border rounded-xl px-4 py-3 w-full" />
                <select name="country" value={formData.country} onChange={handleInputChange} className="border rounded-xl px-4 py-3 w-full">
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                </select>
                <select name="position" value={formData.position} onChange={handleInputChange} className="border rounded-xl px-4 py-3 w-full">
                  <option value="">Select Position</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                System Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input name="referredId" placeholder="Referred ID" value={formData.referredId} onChange={handleInputChange} className="border rounded-xl px-4 py-3 w-full" />
                <select value={selectedBot} onChange={(e) => setSelectedBot(e.target.value)} className="border rounded-xl px-4 py-3 w-full">
                  <option value="">-- Select Bot --</option>
                  {bots.map(bot => <option key={bot._id} value={bot._id}>{bot.name} (Price: {bot.price})</option>)}
                </select>
                <input name="placementId" placeholder="Placement ID" value={formData.placementId} onChange={handleInputChange} className="border rounded-xl px-4 py-3 w-full" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg py-4 px-8 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
              >
                {loading ? "Creating..." : "Create User Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Usercreate;
