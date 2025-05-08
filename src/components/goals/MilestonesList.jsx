// components/goals/MilestonesList.jsx
import React from 'react';

const MilestonesList = ({ milestones }) => {
  if (!milestones || milestones.length === 0) {
    return <p className="text-gray-500">No milestones available</p>;
  }

  return (
    <div className="space-y-6">
      {milestones.map((milestone, index) => (
        <div key={index} className="relative pl-8 pb-6">
          {/* Milestone timeline connector */}
          {index < milestones.length - 1 && (
            <div className="absolute top-6 bottom-0 left-3.5 w-0.5 bg-gray-200"></div>
          )}
          
          {/* Milestone bullet */}
          <div className="absolute top-1 left-0 h-7 w-7 rounded-full bg-blue-100 border-2 border-blue-600 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-800">{index + 1}</span>
          </div>
          
          {/* Milestone content */}
          <div>
            <h3 className="text-lg font-medium text-gray-800">{milestone.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MilestonesList;