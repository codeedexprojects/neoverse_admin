import React, { useState } from 'react';
import { User, DollarSign, Calendar, TrendingUp, Plus, Mail, Award, UserPlus, Trash2 } from 'lucide-react';

const MoneyTree = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set(['root']));

  const treeData = {
    "type": "admin",
    "_id": "68a8585f018157f227751b4c",
    "userId": "UK040B926523",
    "referralId": "ADMYQ96Q",
    "firstName": "Admin",
    "lastName": "Test",
    "email": "adminneoverse@gmail.com",
    "leftCount": 1,
    "rightCount": 0,
    "status": "active",
    "left": [
      {
        "type": "user",
        "_id": "68a85a6c018157f227751b60",
        "userId": "UK050B532923",
        "referralId": "CADWL5I7",
        "firstName": "jubair",
        "lastName": "jubi",
        "email": "jubair@gmail.com",
        "position": "left",
        "botPlan": {
          "_id": "68a8587c018157f227751b52",
          "name": "testBot",
          "price": "520"
        },
        "status": "active",
        "leftCount": 1,
        "rightCount": 1,
        "left": [
          {
            "type": "user",
            "_id": "68a9692ff7e036fbf098bf44",
            "userId": "UK172395923",
            "referralId": "USRDM7VC",
            "firstName": "kaja",
            "lastName": "hussain",
            "email": "kaja@gmail.com",
            "position": "left",
            "botPlan": {
              "_id": "68a8587c018157f227751b52",
              "name": "testBot",
              "price": "520"
            },
            "status": "pending",
            "leftCount": 2,
            "rightCount": 0,
            "left": [
              {
                "userId": "UK191208923",
                "firstName": "Alice",
                "lastName": "Smith",
                "email": "alice@gmail.com",
                "status": "pending",
                "leftCount": 0,
                "rightCount": 1,
                "left": [],
                "right": [
                  {
                    "userId": "UK290370574",
                    "firstName": "Bob",
                    "lastName": "Johnson",
                    "status": "active",
                    "leftCount": 0,
                    "rightCount": 0,
                    "left": [],
                    "right": []
                  }
                ]
              },
              {
                "userId": "UK220327214",
                "firstName": "Carol",
                "lastName": "Wilson",
                "status": "active",
                "leftCount": 0,
                "rightCount": 1,
                "left": [],
                "right": [
                  {
                    "userId": "UK100300004",
                    "firstName": "David",
                    "lastName": "Brown",
                    "status": "active",
                    "leftCount": 0,
                    "rightCount": 0,
                    "left": [],
                    "right": []
                  }
                ]
              }
            ],
            "right": []
          }
        ],
        "right": [
          {
            "type": "user",
            "userId": "UK280B597023",
            "firstName": "shafeeq",
            "lastName": "nc",
            "email": "shafeeq@gmail.com",
            "position": "right",
            "status": "active",
            "leftCount": 2,
            "rightCount": 2,
            "left": [
              {
                "userId": "UK150137723",
                "firstName": "Emma",
                "lastName": "Davis",
                "status": "pending",
                "leftCount": 1,
                "rightCount": 1,
                "left": [
                  {
                    "userId": "UK201503523",
                    "firstName": "Frank",
                    "lastName": "Miller",
                    "status": "active",
                    "leftCount": 0,
                    "rightCount": 0,
                    "left": [],
                    "right": []
                  }
                ],
                "right": []
              }
            ],
            "right": [
              {
                "userId": "UK310372523",
                "firstName": "Grace",
                "lastName": "Taylor",
                "status": "pending",
                "leftCount": 1,
                "rightCount": 1,
                "left": [
                  {
                    "userId": "UK170674044",
                    "firstName": "Henry",
                    "lastName": "Anderson",
                    "status": "active",
                    "leftCount": 0,
                    "rightCount": 0,
                    "left": [],
                    "right": []
                  }
                ],
                "right": [
                  {
                    "userId": "UK300921423",
                    "firstName": "Ivy",
                    "lastName": "Thomas",
                    "status": "pending",
                    "leftCount": 0,
                    "rightCount": 0,
                    "left": [],
                    "right": []
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "right": []
  };

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
    const isActive = nodeData.status === 'active';
    
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
        
        {/* User icon */}
        <foreignObject
          x={x - 10}
          y={y - 10}
          width="20"
          height="20"
          className="cursor-pointer pointer-events-none"
        >
          <User className="w-5 h-5 text-white" />
        </foreignObject>
        
        {/* User ID label below circle */}
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
            height="180"
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
                    <span>{nodeData.email}</span>
                  </div>
                )}
                {nodeData.referralId && (
                  <div className="flex items-center space-x-2">
                    <Award className="w-3 h-3 text-purple-600" />
                    <span>Referral: {nodeData.referralId}</span>
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
        {/* Add button circle */}
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
        
        {/* Plus icon */}
        <foreignObject
          x={x - 8}
          y={y - 8}
          width="16"
          height="16"
          className="cursor-pointer pointer-events-none"
        >
          <UserPlus className="w-4 h-4 text-white" />
        </foreignObject>
        
        {/* Empty slot label */}
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
        
        {/* Hover tooltip */}
        {isHovered && (
          <foreignObject
            x={x + 30}
            y={y - 20}
            width="120"
            height="40"
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

  // Recursive function to render tree nodes
  const renderTreeNode = (nodeData, x, y, level = 0) => {
    const isExpanded = expandedNodes.has(nodeData.userId);
    const elements = [];
    
    // Add the current node
    elements.push(
      <NodeCircle 
        key={nodeData.userId} 
        nodeData={nodeData} 
        x={x} 
        y={y} 
        level={level} 
      />
    );
    
    if (isExpanded && level < 4) { // Limit depth for display
      const childY = y + 100;
      const spacing = Math.max(80, 200 / (level + 1));
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

  return (
    <div className="w-full min-h-screen p-8">
      <div >

        
        <div >
          <svg width="100%" height="700" viewBox="0 0 1200 700" className="rounded-lg">
            {/* Background gradient */}
            <defs>
              <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4B5563" />
                <stop offset="100%" stopColor="#374151" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#bgGradient)" />

            {/* Render the tree starting from root */}
            {renderTreeNode(treeData, 600, 80)}
          </svg>
        </div>
      
        
       
      </div>
    </div>
  );
};

export default MoneyTree;



