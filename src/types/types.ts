export type QuestionType = 'multipleChoice' | 'singleChoice' | 'shortAnswer' | 'longAnswer';

export interface Question {
    type: QuestionType;
    number: number;
    text: string;
    options?: string[];
    answer: string | string[];
}

export interface Session {
    id: number
    name: string;
    timer?: number;
    questions: Question[];
}

export interface Mock {
    test: Session[];
}

export interface Answer {
    testId?: string | number;
    [questionNumber: number]: string | string[];
}
export interface Result {
    text: string;
    userAnswer: string | string[] | undefined;
    isCorrect: boolean;
}