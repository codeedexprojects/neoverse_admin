import React, { useState, useEffect } from 'react';
import { User, DollarSign, Calendar, TrendingUp, Plus, Mail, Award, UserPlus, Trash2, Loader } from 'lucide-react';
import { adminTree } from '../api';

const MoneyTree = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set(['root']));
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  // Load data on component mount
  useEffect(() => {
    const loadTreeData = async () => {
      try {
        setLoading(true);
        const apiResponse = await adminTree();
        if (apiResponse && apiResponse.tree) {
          setTreeData(apiResponse.tree);
          setExpandedNodes(new Set([apiResponse.tree.userId])); // Expand root node
        } else {
          setError('Invalid API response structure');
        }
      } catch (err) {
        setError('Failed to load tree data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTreeData();
  }, []);

  const handleNodeClick = (nodeId) => {
    setSelectedNode(nodeId);
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
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
    const isActive = nodeData.status === 'approved' || nodeData.status === 'active';
    
    return (
      <g>
        <circle
          cx={x}
          cy={y}
          r={isSelected ? "28" : isHovered ? "26" : "24"}
          className="cursor-pointer transition-all duration-300"
          fill={isActive ? "#F59E0B" : "#FB923C"}
          stroke={isSelected ? "#FBBF24" : "none"}
          strokeWidth={isSelected ? "3" : "0"}
          onClick={() => handleNodeClick(nodeData.userId)}
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
          fill="#F59E0B"
          className="cursor-pointer"
          onClick={() => handleNodeClick(nodeData.userId)}
        />
        <text
          x={x}
          y={y + 48}
          textAnchor="middle"
          className="text-xs font-semibold text-white cursor-pointer select-none"
          onClick={() => handleNodeClick(nodeData.userId)}
        >
          {nodeData.userId}
        </text>
        
        {/* Hover tooltip */}
        {isHovered && (
          <foreignObject
            x={x + 40}
            y={y - 80}
            width="280"
            height="200"
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
                    <span>{nodeData.botPlan.name} (${nodeData.botPlan.price})</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-3 h-3 text-orange-600" />
                  <span className={`font-semibold ${isActive ? 'text-green-600' : 'text-orange-600'}`}>
                    {nodeData.status?.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center border-t pt-2">
                  Left: {nodeData.leftCount || 0} | Right: {nodeData.rightCount || 0}
                </div>
                {nodeData.type && (
                  <div className="text-xs text-center">
                    <span className={`px-2 py-1 rounded ${nodeData.type === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {nodeData.type.toUpperCase()}
                    </span>
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
        <line x1={x1} y1={parentBottom} x2={x1} y2={midY} stroke="#F59E0B" strokeWidth="2" />
        <line x1={x1} y1={midY} x2={x2} y2={midY} stroke="#F59E0B" strokeWidth="2" />
        <line x1={x2} y1={midY} x2={x2} y2={childTop} stroke="#F59E0B" strokeWidth="2" />
      </g>
    );
  };

  const AddButton = ({ x, y, parentData, position }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <g>
        <circle
          cx={x}
          cy={y}
          r="20"
          className="cursor-pointer transition-all duration-200"
          fill="#10B981"
          stroke="#059669"
          strokeWidth="2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => alert(`Add new user to ${position} of ${parentData.firstName} ${parentData.lastName}`)}
        />
        
        <foreignObject
          x={x - 8}
          y={y - 8}
          width="16"
          height="16"
          className="cursor-pointer pointer-events-none"
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
          className="cursor-pointer"
        />
        <text
          x={x}
          y={y + 42}
          textAnchor="middle"
          className="text-xs font-medium text-white"
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

  const renderTreeNode = (nodeData, x, y, level = 0) => {
    if (!nodeData) return [];
    
    const isExpanded = expandedNodes.has(nodeData.userId);
    const elements = [];
    
    elements.push(
      <NodeCircle 
        key={nodeData.userId} 
        nodeData={nodeData} 
        x={x} 
        y={y} 
        level={level} 
      />
    );
    
    if (isExpanded && level < 4) { 
      const childY = y + 120;
      const spacing = Math.max(100, 250 / (level + 1));
      const leftX = x - spacing;
      const rightX = x + spacing;
      
      // Render left child
      if (nodeData.left && nodeData.left.length > 0) {
        elements.push(
          <ConnectionLine key={`conn-left-${nodeData.userId}`} x1={x} y1={y} x2={leftX} y2={childY} />
        );
        elements.push(...renderTreeNode(nodeData.left[0], leftX, childY, level + 1));
      } else if (level < 3) {
        elements.push(
          <ConnectionLine key={`conn-add-left-${nodeData.userId}`} x1={x} y1={y} x2={leftX} y2={childY} />
        );
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
      
      // Render right child
      if (nodeData.right && nodeData.right.length > 0) {
        elements.push(
          <ConnectionLine key={`conn-right-${nodeData.userId}`} x1={x} y1={y} x2={rightX} y2={childY} />
        );
        elements.push(...renderTreeNode(nodeData.right[0], rightX, childY, level + 1));
      } else if (level < 3) {
        elements.push(
          <ConnectionLine key={`conn-add-right-${nodeData.userId}`} x1={x} y1={y} x2={rightX} y2={childY} />
        );
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
    
    return elements;
  };

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Error Loading Tree</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!treeData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">No tree data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen ">
      <div className="p-4">
        <div className=" rounded-lg shadow-lg">
          
          <div className="p-4">
            <svg 
              width="100%" 
              height="800" 
              viewBox="0 0 1400 800" 
             
            >
              <rect width="100%" height="100%" fill="#F9FAFB" />
              {renderTreeNode(treeData, 700, 80)}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoneyTree;