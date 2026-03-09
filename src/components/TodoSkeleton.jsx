function TodoSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-3 animate-pulse">
      <div className="flex items-start gap-3">
        {/* Checkbox skeleton */}
        <div className="w-5 h-5 bg-gray-200 rounded mt-1"></div>
        
        <div className="flex-1">
          {/* Title skeleton */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          {/* Description skeleton */}
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Action buttons skeleton */}
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default TodoSkeleton;