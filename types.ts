
export interface ActionableSuggestion {
  suggestion: string;
  reasoning: string;
}

export interface QuantitativeAnalysis {
  averageScore: number;
  scoreDistribution: {
    name: string;
    value: number;
  }[];
}

export interface AnalysisResult {
  overallSummary: string;
  keyStrengths: string[];
  areasForImprovement: string[];
  actionableSuggestions: ActionableSuggestion[];
  quantitativeAnalysis?: QuantitativeAnalysis;
}
   