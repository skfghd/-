
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { AnalysisResult } from './components/AnalysisResult';
import { LoadingSpinner } from './components/LoadingSpinner';
import type { AnalysisResult as AnalysisResultType } from './types';
import { analyzeSurveyData } from './services/geminiService';

export default function App(): React.ReactNode {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!selectedFile) {
      setError("먼저 파일을 선택해주세요.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileContent = event.target?.result as string;
      if (!fileContent) {
        setError("파일 내용을 읽을 수 없습니다.");
        setIsAnalyzing(false);
        return;
      }

      try {
        const result = await analyzeSurveyData(fileContent);
        setAnalysisResult(result);
      } catch (e) {
        console.error(e);
        setError("분석 중 오류가 발생했습니다. 자세한 내용은 콘솔을 확인하거나 다른 파일을 시도해 보세요.");
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.onerror = () => {
        setError("파일을 읽는데 실패했습니다.");
        setIsAnalyzing(false);
    }
    reader.readAsText(selectedFile);
  }, [selectedFile]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-text">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <section id="upload" className="mb-8 p-6 bg-card rounded-xl shadow-md transition-shadow hover:shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-primary">1. 설문 데이터 업로드</h2>
            <p className="text-text-secondary mb-6">
              설문 데이터 파일(.txt, .csv 등)을 업로드하세요. AI가 내용을 분석하여 인사이트를 생성합니다.
            </p>
            <FileUpload onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
            <div className="mt-6 text-center">
              <button
                onClick={handleAnalyzeClick}
                disabled={!selectedFile || isAnalyzing}
                className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                {isAnalyzing ? '분석 중...' : '데이터 분석'}
              </button>
            </div>
          </section>

          {isAnalyzing && (
             <div className="flex flex-col items-center justify-center p-8 bg-card rounded-xl shadow-md">
                <LoadingSpinner />
                <p className="mt-4 text-lg font-semibold text-primary">AI가 데이터를 분석하고 있습니다...</p>
                <p className="text-text-secondary">잠시만 기다려 주세요.</p>
            </div>
          )}

          {error && (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100 border border-red-400" role="alert">
              <span className="font-medium">오류:</span> {error}
            </div>
          )}
          
          {analysisResult && (
            <section id="results">
                 <h2 className="text-2xl font-bold mb-4 text-primary">2. 분석 리포트</h2>
                <AnalysisResult result={analysisResult} />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}