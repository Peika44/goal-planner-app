import React from 'react';

// Skeleton for stat cards
export const SkeletonStatCard = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow animate-pulse">
      <div className="flex items-center mb-2">
        <div className="h-8 w-8 bg-gray-200 rounded-full mr-2"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
      <div className="h-8 w-16 bg-gray-200 rounded mt-2"></div>
    </div>
  );
};

// Skeleton for goal cards
export const SkeletonGoalCard = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow animate-pulse mb-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-1/4 bg-gray-200 rounded mb-3"></div>
          <div className="h-3 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
        </div>
        <div className="ml-2 w-12">
          <div className="h-12 w-12 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="mt-3">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden"></div>
      </div>
    </div>
  );
};

// Skeleton for task items
export const SkeletonTaskItem = () => {
  return (
    <div className="flex items-center py-3 animate-pulse">
      <div className="h-4 w-4 bg-gray-200 rounded mr-3"></div>
      <div className="flex-1">
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
      </div>
      <div className="h-6 w-16 bg-gray-200 rounded"></div>
    </div>
  );
};

// Skeleton for the stats grid
export const SkeletonStatsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
    </div>
  );
};

// Skeleton for goal list
export const SkeletonGoalList = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-4">
        <SkeletonGoalCard />
        <SkeletonGoalCard />
        <SkeletonGoalCard />
      </div>
    </div>
  );
};

// Skeleton for task list
export const SkeletonTaskList = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
      </div>
      <div className="divide-y divide-gray-200">
        <SkeletonTaskItem />
        <SkeletonTaskItem />
        <SkeletonTaskItem />
        <SkeletonTaskItem />
      </div>
    </div>
  );
};


// Add this new component for recommendations
export const SkeletonRecommendations = () => {
  return (
    <div className="skeleton-recommendations">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="skeleton-recommendation-card">
          <div className="skeleton-recommendation-title"></div>
          <div className="skeleton-recommendation-description"></div>
          <div className="skeleton-recommendation-description-2"></div>
          <div className="skeleton-recommendation-description-3"></div>
          <div className="skeleton-recommendation-meta">
            <div className="skeleton-badge"></div>
            <div className="skeleton-badge skeleton-badge-small"></div>
            <div className="skeleton-badge"></div>
          </div>
          <div className="skeleton-recommendation-button"></div>
        </div>
      ))}
    </div>
  );
};

// If you prefer adding it without altering your existing file, you can do:
// export { SkeletonRecommendations } from './SkeletonRecommendations';
// And create a separate SkeletonRecommendations.js file