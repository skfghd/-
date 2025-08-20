
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AnalysisResult as AnalysisResultType } from '../types';
import { ResultCard } from './ResultCard';

interface AnalysisResultProps {
  result: AnalysisResultType;
}

const CheckIcon = () => (
    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ExclamationIcon = () => (
    <svg className="h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

const LightbulbIcon = () => (
    <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-11.25a6.01 6.01 0 00-1.5 11.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 18H12m0 0H14.25m-4.5 0v2.25c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V18m-4.5 0h4.5" />
    </svg>
);


export function AnalysisResult({ result }: AnalysisResultProps): React.ReactNode {
  return (
    <div className="space-y-6">
        <ResultCard title="전체 요약">
            <p className="text-text-secondary">{result.overallSummary}</p>
        </ResultCard>

        <div className="grid md:grid-cols-2 gap-6">
            <ResultCard title="핵심 강점" icon={<CheckIcon/>}>
                <ul className="space-y-2 list-disc list-inside text-text-secondary">
                    {result.keyStrengths.map((strength, index) => <li key={index}>{strength}</li>)}
                </ul>
            </ResultCard>
            <ResultCard title="개선 필요 영역" icon={<ExclamationIcon/>}>
                <ul className="space-y-2 list-disc list-inside text-text-secondary">
                    {result.areasForImprovement.map((area, index) => <li key={index}>{area}</li>)}
                </ul>
            </ResultCard>
        </div>

        <ResultCard title="실행 가능한 제안" icon={<LightbulbIcon/>}>
            <div className="space-y-4">
                {result.actionableSuggestions.map((item, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-md border border-slate-200">
                        <p className="font-semibold text-primary">{item.suggestion}</p>
                        <p className="text-sm text-text-secondary mt-1">{item.reasoning}</p>
                    </div>
                ))}
            </div>
        </ResultCard>
        
        {result.quantitativeAnalysis && (
            <ResultCard title="정량 분석">
                <p className="text-text-secondary mb-4">
                    평균 점수: <span className="font-bold text-primary text-xl">{result.quantitativeAnalysis.averageScore.toFixed(2)}</span> / 5
                </p>
                <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={result.quantitativeAnalysis.scoreDistribution}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false}/>
                        <Tooltip contentStyle={{backgroundColor: '#fff', border: '1px solid #ccc'}}/>
                        <Legend />
                        <Bar dataKey="value" fill="#1d4ed8" name="응답 수" />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </ResultCard>
        )}
    </div>
  );
}