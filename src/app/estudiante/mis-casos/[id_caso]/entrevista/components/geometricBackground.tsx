interface GeometricBackgroundProps {
  className?: string;
}

export function GeometricBackground({ className }: GeometricBackgroundProps) {
  return (
    <div className={`absolute -z-10 inset-0 pointer-events-none ${className || ''}`}>
      {/* Large background shapes with gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-blue-200/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-linear-to-tr from-blue-200/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-r from-purple-200/15 to-blue-200/15 rounded-full blur-2xl"></div>
      
      {/* Static geometric shapes */}
      <div className="absolute inset-0 opacity-15">
        {/* Large decorative shapes */}
        <div className="absolute top-16 left-16 w-32 h-32 border border-blue-300/50 rounded-full"></div>
        <div className="absolute top-20 right-20 w-28 h-28 border border-blue-300/50 rotate-45"></div>
        <div className="absolute bottom-24 left-8 w-24 h-24 border border-purple-300/50 rounded-full"></div>
        <div className="absolute bottom-20 right-8 w-20 h-20 border border-blue-400/50 rotate-12"></div>
        
        {/* Small accent shapes */}
        <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-blue-400/60 rounded-full"></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-blue-400/60 rounded-full"></div>
        <div className="absolute bottom-1/3 left-2/3 w-4 h-4 bg-blue-400/60 rounded-full"></div>
      </div>
      
      {/* Subtle connecting lines */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-px h-3/4 bg-linear-to-b from-blue-400/60 to-transparent"></div>
        <div className="absolute top-1/4 right-1/3 w-px h-1/2 bg-linear-to-b from-blue-400/60 to-transparent"></div>
        <div className="absolute top-1/3 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-400/60 to-transparent"></div>
      </div>
    </div>
  );
}