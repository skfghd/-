
import React from 'react';

interface ResultCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function ResultCard({ title, icon, children }: ResultCardProps): React.ReactNode {
  return (
    <div className="bg-card p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg">
      <div className="flex items-center mb-4">
        {icon && <div className="mr-3">{icon}</div>}
        <h3 className="text-xl font-bold text-slate-700">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}
   