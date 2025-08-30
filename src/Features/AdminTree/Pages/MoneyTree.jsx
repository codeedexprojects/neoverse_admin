import React, { useState, useEffect } from "react";
import {
  User,
  DollarSign,
  Mail,
  Award,
  UserPlus,
  Loader,
  ArrowLeft,
} from "lucide-react";
import { adminTree, adminUserTree } from "../api";
import { useNavigate } from "react-router-dom";

const MoneyTree = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state for handling user-specific tree
  const [userTreeData, setUserTreeData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showUserTree, setShowUserTree] = useState(false);
  const [userTreeLoading, setUserTreeLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadTreeData = async () => {
      try {
        setLoading(true);
        const apiResponse = await adminTree();
        if (apiResponse && apiResponse.tree) {
          setTreeData(apiResponse.tree);

          const nodesToExpand = new Set();
          const expandToLevel = (node, level = 0) => {
            if (level <= 4 && node && node.userId) {
              nodesToExpand.add(node.userId);
              if (node.left && node.left.length > 0) {
                expandToLevel(node.left[0], level + 1);
              }
              if (node.right && node.right.length > 0) {
                expandToLevel(node.right[0], level + 1);
              }
            }
          };

          expandToLevel(apiResponse.tree);
          setExpandedNodes(nodesToExpand);
        } else {
          setError("Invalid API response structure");
        }
      } catch (err) {
        setError("Failed to load tree data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTreeData();
  }, []);

  // Function to check if a node is at the last depth (level 4)
  const isLastDepthNode = (level) => {
    return level >= 3; // Since we start from level 0, level 3 is the 4th level
  };

  // Function to load user-specific tree
  const loadUserTree = async (userId) => {
    try {
      setUserTreeLoading(true);
      const apiResponse = await adminUserTree(userId);
      console.log(apiResponse);
      
      if (apiResponse && apiResponse.tree) {
        setUserTreeData(apiResponse.tree);
        setCurrentUserId(userId);
        setShowUserTree(true);
      } else {
        setError("Invalid user tree response structure");
      }
    } catch (err) {
      setError("Failed to load user tree data");
      console.error(err);
    } finally {
      setUserTreeLoading(false);
    }
  };

  const handleNodeClick = (nodeId, level = 0) => {
    // Check if this is a last depth node
    if (isLastDepthNode(level)) {
      // Load user-specific tree instead of expanding
      loadUserTree(nodeId);
      return;
    }

    // Normal expansion behavior for non-last depth nodes
    setSelectedNode(nodeId);
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleBackToMainTree = () => {
    setShowUserTree(false);
    setUserTreeData(null);
    setCurrentUserId(null);
    setExpandedNodes(new Set());
  };

  const handleNodeHover = (nodeId) => {
    setHoveredNode(nodeId);
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
  };

  const NodeCircle = ({ nodeData, x, y, level = 0 }) => {
    const isSelected = selectedNode === nodeData.userId;
    const isHovered = hoveredNode === nodeData.userId;
    const isActive =
      nodeData.status === "approved" || nodeData.status === "active";
    const isLastDepth = isLastDepthNode(level);

    return (
      <g>
        <circle
          cx={x}
          cy={y}
          r={isSelected ? "28" : isHovered ? "26" : "24"}
          className="cursor-pointer transition-all duration-300"
          fill={isActive ? "#F59E0B" : "#FB923C"}
          stroke={isSelected ? "#FBBF24" : isLastDepth ? "#EF4444" : "none"}
          strokeWidth={isSelected ? "3" : isLastDepth ? "2" : "0"}
          onClick={() => handleNodeClick(nodeData.userId, level)}
          onMouseEnter={() => handleNodeHover(nodeData.userId)}
          onMouseLeave={handleNodeLeave}
        />
        <foreignObject
          x={x - 10}
          y={y - 10}
          width="20"
          height="20"
          className="cursor-pointer pointer-events-none"
        >
          <User className="w-5 h-5 text-white" />
        </foreignObject>
        <rect
          x={x - 40}
          y={y + 35}
          width="80"
          height="20"
          rx="10"
          fill={isLastDepth ? "#EF4444" : "#F59E0B"}
          className="cursor-pointer"
          onClick={() => handleNodeClick(nodeData.userId, level)}
        />
        <text
          x={x}
          y={y + 48}
          textAnchor="middle"
          className="text-xs font-semibold text-white cursor-pointer select-none"
          onClick={() => handleNodeClick(nodeData.userId, level)}
        >
          {nodeData.userId}
        </text>
        {isHovered && (
          <foreignObject
            x={x + 40}
            y={y - 80}
            width="280"
            height="250"
            className="pointer-events-none z-10"
          >
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-xl p-4 text-sm">
              <div className="font-bold text-gray-900 mb-3 text-center">
                {nodeData.firstName} {nodeData.lastName}
              </div>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center space-x-2">
                  <User className="w-3 h-3 text-blue-600" />
                  <span>ID: {nodeData.userId}</span>
                </div>
                {nodeData.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3 h-3 text-green-600" />
                    <span className="text-xs">{nodeData.email}</span>
                  </div>
                )}
                {nodeData.referralId && (
                  <div className="flex items-center space-x-2">
                    <Award className="w-3 h-3 text-purple-600" />
                    <span>Ref: {nodeData.referralId}</span>
                  </div>
                )}
                {nodeData.botPlan && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-3 h-3 text-green-600" />
                    <span>
                      {nodeData.botPlan.name} (${nodeData.botPlan.price})
                    </span>
                  </div>
                )}
                {isLastDepth && (
                  <div className="text-xs text-red-600 font-medium mt-2">
                    Click to view user's tree
                  </div>
                )}
              </div>
            </div>
          </foreignObject>
        )}
      </g>
    );
  };

  const ConnectionLine = ({ x1, y1, x2, y2 }) => {
    const parentBottom = y1 + 30;
    const childTop = y2 - 30;
    const midY = parentBottom + (childTop - parentBottom) / 2;

    return (
      <g>
        <line
          x1={x1}
          y1={parentBottom}
          x2={x1}
          y2={midY}
          stroke="#F59E0B"
          strokeWidth="2"
        />
        <line
          x1={x1}
          y1={midY}
          x2={x2}
          y2={midY}
          stroke="#F59E0B"
          strokeWidth="2"
        />
        <line
          x1={x2}
          y1={midY}
          x2={x2}
          y2={childTop}
          stroke="#F59E0B"
          strokeWidth="2"
        />
      </g>
    );
  };

  const AddButton = ({ x, y, parentData, position }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleAddUser = (e) => {
      e.stopPropagation();

      try {
        console.log(
          `Navigating to create user for ${parentData.userId} - ${position}`
        );
        navigate(
          `/create-user?placementId=${parentData.userId}&position=${position}`
        );
      } catch (error) {
        console.error("Navigation error:", error);
        window.location.href = `/create-user?placementId=${parentData.userId}&position=${position}`;
      }
    };

    return (
      <g>
        <rect
          x={x - 25}
          y={y - 25}
          width="50"
          height="80"
          fill="transparent"
          className="cursor-pointer"
          onClick={handleAddUser}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />

        <circle
          cx={x}
          cy={y}
          r="20"
          className="cursor-pointer transition-all duration-200 pointer-events-none"
          fill="#10B981"
          stroke="#059669"
          strokeWidth="2"
        />

        <foreignObject
          x={x - 8}
          y={y - 8}
          width="16"
          height="16"
          className="pointer-events-none"
        >
          <UserPlus className="w-4 h-4 text-white" />
        </foreignObject>

        <rect
          x={x - 30}
          y={y + 30}
          width="60"
          height="18"
          rx="9"
          fill="#6B7280"
          className="pointer-events-none"
        />
        <text
          x={x}
          y={y + 42}
          textAnchor="middle"
          className="text-xs font-medium text-white pointer-events-none"
        >
          Empty
        </text>

        {isHovered && (
          <foreignObject
            x={x + 30}
            y={y - 20}
            width="120"
            height="30"
            className="pointer-events-none"
          >
            <div className="bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg">
              Add {position} member
            </div>
          </foreignObject>
        )}
      </g>
    );
  };

  const calculateNodePositions = (
    nodeData,
    x,
    y,
    level = 0,
    positions = []
  ) => {
    if (!nodeData) return positions;

    positions.push({ nodeData, x, y, level });

    const isExpanded = expandedNodes.has(nodeData.userId);
    if (isExpanded && level < 4) {
      const childY = y + 120;
      const spacing = Math.max(100, 350 / (level + 1));
      const leftX = x - spacing;
      const rightX = x + spacing;

      if (nodeData.left && nodeData.left.length > 0) {
        calculateNodePositions(
          nodeData.left[0],
          leftX,
          childY,
          level + 1,
          positions
        );
      }
      if (nodeData.right && nodeData.right.length > 0) {
        calculateNodePositions(
          nodeData.right[0],
          rightX,
          childY,
          level + 1,
          positions
        );
      }
    }

    return positions;
  };

  const renderTree = (currentTreeData = treeData, rootUserId = null) => {
    if (!currentTreeData) return null;

    // Reset expanded nodes for user tree
    const currentExpandedNodes = showUserTree ? new Set([rootUserId]) : expandedNodes;
    
    const positions = calculateNodePositions(currentTreeData, 700, 80);
    const elements = [];

    // First render connections to ensure they are behind nodes
    positions.forEach(({ nodeData, x, y, level }) => {
      const isExpanded = currentExpandedNodes.has(nodeData.userId);
      if (isExpanded && level < 4) {
        const childY = y + 120;
        const spacing = Math.max(100, 350 / (level + 1));
        const leftX = x - spacing;
        const rightX = x + spacing;

        if (nodeData.left && nodeData.left.length > 0) {
          elements.push(
            <ConnectionLine
              key={`conn-left-${nodeData.userId}`}
              x1={x}
              y1={y}
              x2={leftX}
              y2={childY}
            />
          );
        } else if (level < 3) {
          elements.push(
            <ConnectionLine
              key={`conn-add-left-${nodeData.userId}`}
              x1={x}
              y1={y}
              x2={leftX}
              y2={childY}
            />
          );
        }

        if (nodeData.right && nodeData.right.length > 0) {
          elements.push(
            <ConnectionLine
              key={`conn-right-${nodeData.userId}`}
              x1={x}
              y1={y}
              x2={rightX}
              y2={childY}
            />
          );
        } else if (level < 3) {
          elements.push(
            <ConnectionLine
              key={`conn-add-right-${nodeData.userId}`}
              x1={x}
              y1={y}
              x2={rightX}
              y2={childY}
            />
          );
        }
      }
    });

    // Then render nodes and add buttons
    positions.forEach(({ nodeData, x, y, level }) => {
      elements.push(
        <NodeCircle
          key={nodeData.userId}
          nodeData={nodeData}
          x={x}
          y={y}
          level={level}
        />
      );

      const isExpanded = currentExpandedNodes.has(nodeData.userId);
      if (isExpanded && level < 4) {
        const childY = y + 120;
        const spacing = Math.max(100, 350 / (level + 1));
        const leftX = x - spacing;
        const rightX = x + spacing;

        if (!nodeData.left || nodeData.left.length === 0) {
          if (level < 3) {
            elements.push(
              <AddButton
                key={`add-left-${nodeData.userId}`}
                x={leftX}
                y={childY}
                parentData={nodeData}
                position="left"
              />
            );
          }
        }

        if (!nodeData.right || nodeData.right.length === 0) {
          if (level < 3) {
            elements.push(
              <AddButton
                key={`add-right-${nodeData.userId}`}
                x={rightX}
                y={childY}
                parentData={nodeData}
                position="right"
              />
            );
          }
        }
      }
    });

    return elements;
  };

  // User Tree Component
  const UserTreeView = () => {
    if (userTreeLoading) {
      return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Loading user tree...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBackToMainTree}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Main Tree</span>
              </button>
              <h1 className="text-xl font-bold text-gray-800">
                User Tree - {currentUserId}
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-auto">
            <svg width="100%" height="800" viewBox="0 0 1400 800">
              <rect width="100%" height="100%" fill="#F9FAFB" />
              {userTreeData && renderTree(userTreeData, currentUserId)}
            </svg>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading admin tree...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-red-600">Error: {error}</p>
          {showUserTree && (
            <button
              onClick={handleBackToMainTree}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Main Tree
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!treeData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">No tree data available</p>
        </div>
      </div>
    );
  }

  // Show user tree if in user tree mode
  if (showUserTree) {
    return <UserTreeView />;
  }

  // Show main tree
  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <h1 className="text-xl font-bold text-gray-800">Money Tree</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-auto">
          <svg width="100%" height="800" viewBox="0 0 1400 800">
            <rect width="100%" height="100%" fill="#F9FAFB" />
            {renderTree()}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MoneyTree;