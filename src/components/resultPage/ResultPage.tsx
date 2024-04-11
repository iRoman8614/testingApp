import React, {useEffect, useState} from 'react';
import {Question, Answer, Result} from '../../types/types'
import {mock} from "../../mock/TestContent";

export const ResultPage:React.FC = () => {
    const [savedAnswers, setSavedAnswers] = useState<Answer>({});
    const handleFinish = () => {
        localStorage.removeItem('test');
        localStorage.removeItem('answers');
    }

    useEffect(() => {
        const saved = localStorage.getItem('answers');
        if(saved) {
            setSavedAnswers(JSON.parse(saved));
        }
    }, []);

    console.log('savedAnswers', savedAnswers)
    const testId:number = Number(savedAnswers.testId);
    console.log('testId', testId)

    const compareAnswers = (mockQuestions: Question[], savedAnswers: Answer): Result[] => {
        return mockQuestions.map((question) => {
            const userAnswer = savedAnswers[question.number];
            const isCorrect = Array.isArray(question.answer) && Array.isArray(userAnswer)
                ? question.answer.sort().join(',') === userAnswer.sort().join(',')
                : question.answer === userAnswer;
            return {
                text: question.text,
                userAnswer,
                isCorrect,
            };
        });
    };

    let mockQuestions: Question[] = mock.test.find(session => session.id === Number(testId))?.questions ?? [];
    const results: Result[] = compareAnswers(mockQuestions, savedAnswers);
    const totalCorrectAnswers: number = results.reduce((sum, current) => sum + (current.isCorrect ? 1 : 0), 0);


    return(
        <>
            <h1>Тест завершен</h1>
            <div>Ваш результат: {totalCorrectAnswers}</div>
            <div>
                {results.map((result, index) => (
                    <div key={index}>
                        <p>Вопрос: {result.text}</p>
                        <p>Ваш ответ: {result.userAnswer || "Нет ответа"}</p>
                        <p>{result.isCorrect ? "Правильно" : "Неправильно"}</p>
                    </div>
                ))
                }
            </div>
            <button onClick={() => handleFinish()}>Назад</button>
        </>
    )
}