import type { Question } from "@/services/quizGenerator";

export function checkAnswer(question: Question, answer: string): boolean {
    return answer.trim() === question.correctAnswer;
}

export function getNextQuestionIndex(currentIndex: number, total: number): number | null {
    if (currentIndex + 1 >= total) {
        return null;
    }
    return currentIndex + 1;
}
