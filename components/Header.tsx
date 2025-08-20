
import React from 'react';

export function Header(): React.ReactNode {
  return (
    <header className="bg-card shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v5.25m0 0v2.25m0-2.25H15M12 10.5h-1.5m3.75 3.75L15 15m2.25-2.25L15 15m0 0L12.75 17.25" />
          </svg>
          <h1 className="text-2xl font-bold text-slate-800">
            만족도 설문 분석 AI
          </h1>
        </div>
      </div>
    </header>
  );
}