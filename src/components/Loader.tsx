import React from 'react';

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex justify-center items-center">
        <div className="absolute animate-ping w-8 h-8 rounded-full bg-[#376497]/50 opacity-75"></div>
        <div className="relative w-8 h-8 rounded-full bg-[#376497] animate-pulse"></div>
      </div>
      {text && <p className="text-slate-500 font-medium text-sm animate-pulse">{text}</p>}
    </div>
  );
};

export default Loader;