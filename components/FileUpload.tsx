
import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  isAnalyzing: boolean;
}

export function FileUpload({ onFileSelect, isAnalyzing }: FileUploadProps): React.ReactNode {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      onFileSelect(file);
    } else {
      setFileName(null);
      onFileSelect(null);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  }, []);


  return (
    <div>
      <label
        htmlFor="file-upload"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-primary bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
      >
        <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          <p className="mt-2 text-sm text-slate-600">
            <span className="font-semibold text-primary">클릭하여 업로드</span>하거나 파일을 끌어다 놓으세요.
          </p>
          <p className="text-xs text-slate-500">TXT, CSV 등 텍스트 기반 파일</p>
        </div>
        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e.target.files)} disabled={isAnalyzing} />
      </label>
      {fileName && (
        <div className="mt-4 text-center text-sm text-slate-700">
          <p>
            선택된 파일: <span className="font-medium text-primary">{fileName}</span>
          </p>
        </div>
      )}
    </div>
  );
}