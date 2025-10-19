'use client';
interface GeometricBackgroundProps {
  className?: string;
}

export function GeometricBackground({ className }: GeometricBackgroundProps) {
  return (
    <div className={`absolute inset-0 ${className || ''}`}>
      {/* Large background shapes with gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200/40 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-200/20 to-blue-200/20 rounded-full blur-2xl"></div>
      
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      
      {/* Static geometric shapes */}
      <div className="absolute inset-0 opacity-20">
        {/* Large decorative shapes */}
        <div className="absolute top-16 left-16 w-32 h-32 border-2 border-blue-300 rounded-full"></div>
        <div className="absolute top-20 right-20 w-28 h-28 border-2 border-blue-300 rotate-45"></div>
        <div className="absolute bottom-24 left-1/4 w-24 h-24 border-2 border-purple-300 rounded-full"></div>
        <div className="absolute bottom-20 right-1/4 w-20 h-20 border-2 border-blue-400 rotate-12"></div>
        
        {/* Small accent shapes */}
        <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-blue-400 rounded-full"></div>
        <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full"></div>
        <div className="absolute bottom-1/3 left-2/3 w-5 h-5 bg-blue-400 rounded-full"></div>
      </div>
      
      {/* Subtle connecting lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-px h-3/4 bg-gradient-to-b from-blue-400 to-transparent"></div>
        <div className="absolute top-1/4 right-1/3 w-px h-1/2 bg-gradient-to-b from-blue-400 to-transparent"></div>
        <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
      </div>
    </div>
  );
}