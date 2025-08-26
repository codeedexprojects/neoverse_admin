import React, { useState, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  ChevronDown,
  ChevronRight,
  Grid3x3,
  CreditCard,
  TrendingUp,
  TreePalm,
} from "lucide-react";
import { ROUTES } from "../../lib/constants";
const Sidebar = () => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);

  useEffect(() => {
    setUserRole("admin");
    setUserPermissions(["dashboard", "products", "coupons"]);
  }, []);

  const hasPermission = (permissionKey) => {
    if (userRole === "admin" || userRole === undefined) return true;
    return userPermissions.includes(permissionKey);
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: ROUTES.DASHBOARD,
      permission: "dashboard",
    },
    {
      name: "Bot",
      icon: <Grid3x3 size={20} />,
      path: ROUTES.BOT,
      permission: "botlist",
    },
    {
      name: "Admin Tree",
      icon: <TreePalm size={20} />,
      path: ROUTES.LOGIN,
      permission: "tree",
    },
  ];

  const footerItems = [
    {
      name: "Logout",
      icon: <LogOut size={20} />,
      path: "/",
      action: () => {
        console.log("Logout clicked");
      },
      permission: "logout",
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => item.permission === "logout" || hasPermission(item.permission)
  );

  const filteredFooterItems = footerItems.filter(
    (item) => item.permission === "logout" || hasPermission(item.permission)
  );

  const isActive = (path) => location.pathname === path;

  const isDropdownSectionActive = (subItems) => {
    return subItems && subItems.some((subItem) => isActive(subItem.path));
  };

  const toggleDropdown = (itemName) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  return (
    <div
      className={`bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 shadow-xl h-full ${
        isHovered ? "w-64" : "w-20"
      } flex flex-col transition-all duration-300 ease-in-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center px-6 py-6 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
            <TrendingUp className="text-white" size={24} />
          </div>
          {isHovered && (
            <span className="text-xl font-bold text-white">Neoverse</span>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {filteredMenuItems.map((item, index) => (
            <div key={index}>
              {item.isDropdown ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`w-full flex items-center ${
                      isHovered ? "space-x-3 px-4" : "justify-center px-2"
                    } py-3 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                        isDropdownSectionActive(item.subItems)
                          ? "bg-gradient-to-r from-blue-500/20 to-green-500/20 text-white border border-blue-500/30"
                          : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                      }`}
                  >
                    {item.icon}
                    {isHovered && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>
                        {openDropdowns[item.name] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </>
                    )}
                  </button>
                  {isHovered && openDropdowns[item.name] && (
                    <div className="mt-1 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <RouterLink
                          key={subIndex}
                          to={subItem.path}
                          className={`flex items-center space-x-3 px-8 py-2 rounded-lg text-sm transition-all duration-200
                            ${
                              isActive(subItem.path)
                                ? "bg-gradient-to-r from-blue-500/30 to-green-500/30 text-white border-r-2 border-blue-400"
                                : "text-slate-300 hover:bg-slate-700/30 hover:text-white"
                            }`}
                        >
                          {subItem.icon}
                          <span>{subItem.name}</span>
                        </RouterLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <RouterLink
                  to={item.path}
                  className={`flex items-center ${
                    isHovered ? "space-x-3 px-4" : "justify-center px-2"
                  } py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-blue-500/20 to-green-500/20 text-white border border-blue-500/30 shadow-lg"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    }`}
                >
                  {item.icon}
                  {isHovered && <span>{item.name}</span>}
                </RouterLink>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="border-t border-slate-700 px-2 py-4">
        {filteredFooterItems.map((item, index) => (
          <RouterLink
            key={index}
            to={item.path}
            onClick={item.action}
            className={`flex items-center ${
              isHovered ? "space-x-3 px-4" : "justify-center px-2"
            } py-3 text-slate-300 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all duration-200`}
          >
            {item.icon}
            {isHovered && <span>{item.name}</span>}
          </RouterLink>
        ))}
      </div>
    </div>
  );
};
export default Sidebar;
