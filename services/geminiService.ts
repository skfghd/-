
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        overallSummary: {
            type: Type.STRING,
            description: "설문 결과에 대한 간략하고 수준 높은 요약입니다."
        },
        keyStrengths: {
            type: Type.ARRAY,
            description: "상위 3-5개의 긍정적인 주제 또는 의견입니다. 참가자들이 가장 좋아했던 점입니다.",
            items: { type: Type.STRING }
        },
        areasForImprovement: {
            type: Type.ARRAY,
            description: "피드백을 기반으로 한 상위 3-5개의 개선 영역입니다. 일반적인 불만 사항 또는 낮은 평가를 받은 부분입니다.",
            items: { type: Type.STRING }
        },
        actionableSuggestions: {
            type: Type.ARRAY,
            description: "내년 계획을 위한 최소 2개의 구체적이고 실행 가능한 제안입니다.",
            items: {
                type: Type.OBJECT,
                properties: {
                    suggestion: { type: Type.STRING },
                    reasoning: { type: Type.STRING }
                },
                required: ["suggestion", "reasoning"]
            }
        },
        quantitativeAnalysis: {
            type: Type.OBJECT,
            description: "숫자 등급이 있는 경우에 대한 정량적 분석입니다. 숫자 데이터가 없으면 생략합니다.",
            properties: {
                averageScore: {
                    type: Type.NUMBER,
                    description: "평균 만족도 점수(1-5점 척도 가정)."
                },
                scoreDistribution: {
                    type: Type.ARRAY,
                    description: "점수 분포(예: 1점, 2점, 3점 등의 개수).",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "예: '1점', '2점'"},
                            value: { type: Type.NUMBER, description: "이 점수에 대한 개수"}
                        },
                        required: ["name", "value"]
                    }
                }
            },
            nullable: true
        }
    },
    required: ["overallSummary", "keyStrengths", "areasForImprovement", "actionableSuggestions"]
};


export const analyzeSurveyData = async (data: string): Promise<AnalysisResult> => {
    const prompt = `
        당신은 교육 프로그램 만족도 설문조사 전문 데이터 분석가입니다. 다음 설문 데이터를 분석해 주세요. 이 데이터에는 최근 교육 프로그램에 대한 참가자들의 응답이 포함되어 있습니다.

        당신의 임무는 연간 보고서 작성 및 내년 교육과정 기획에 사용될 종합적인 분석을 제공하는 것입니다.

        데이터를 기반으로 다음 정보를 포함하는 구조화된 JSON 출력을 생성해 주세요:
        1.  **overallSummary:** 설문 결과에 대한 간략하고 수준 높은 요약.
        2.  **keyStrengths:** 피드백에서 3~5개의 주요 긍정적 주제 또는 의견을 식별하여 나열합니다. 참가자들이 가장 좋아했던 점은 무엇이었나요?
        3.  **areasForImprovement:** 참가자 피드백을 바탕으로 프로그램이 개선될 수 있는 3~5개 주요 영역을 식별하여 나열합니다. 일반적인 불만 사항이나 가장 낮은 평가를 받은 부분은 무엇이었나요?
        4.  **actionableSuggestions:** 분석을 바탕으로 내년 계획을 위한 구체적이고 실행 가능한 제안을 2개 이상 제공합니다. 각 제안에 대한 근거를 제시해 주세요.
        5.  **quantitativeAnalysis:** 숫자 등급이 있는 경우 만족도 평균 점수(1-5점 척도 가정)를 계산하고 점수 분포를 제공합니다. 숫자 데이터가 없는 경우 이 필드는 생략하거나 null로 처리해야 합니다.

        설문 데이터는 다음과 같습니다:
        ---
        ${data}
        ---
        출력은 지정된 JSON 형식으로만 엄격하게 제공해 주세요. \`\`\`json과 같은 마크다운 서식을 포함하지 마세요.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });

        const text = response.text.trim();
        const parsedResult = JSON.parse(text);

        // Basic validation
        if (!parsedResult.overallSummary || !parsedResult.keyStrengths) {
            throw new Error("파싱된 JSON에 필수 필드가 누락되었습니다.");
        }

        return parsedResult as AnalysisResult;

    } catch (error) {
        console.error("Error calling Gemini API or parsing response:", error);
        throw new Error("설문 데이터 분석에 실패했습니다.");
    }
};