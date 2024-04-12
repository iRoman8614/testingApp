import React, {useEffect, useState} from 'react';
import {mock} from '../../mock/TestContent'
import {Timer} from '../timer/Timer';

import styles from './TestPage.module.css'

interface Props {
    testId: string;
}

type Answer = string | string[];
interface Answers {
    [questionNumber: number]: Answer;
}

export const TestPage:React.FC<Props> = ({testId}) => {
    const test:number = Number(testId)
    const[slice, setSlice] = useState(0)
    const[answers, setAnswers] = useState<Answers>({});

    useEffect(() => {
        const savedAnswers = localStorage.getItem('answers');
        if (savedAnswers) {
            setAnswers(JSON.parse(savedAnswers));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('answers', JSON.stringify(answers));
    }, [answers]);

    const handleAnswerChange = (questionNumber: number, newValue: Answer) => {
        const testId = localStorage.getItem('test');
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionNumber]: newValue,
            testId: testId,
        }));
    };
    const handleNext = (number: number) => {
        if(slice + number + 1 > mock.test[0].questions.length) {
            return false
        } else{
            setSlice((prevSlice) => prevSlice + number);
        }
        console.log(answers)
    };
    const handlePrev = (number: number) => {
        if(slice == 0) {
            return false
        } else{
            setSlice((prevSlice) => prevSlice - number);
        }
        console.log(answers)
    };

    return(
        <div className={styles.root}>
            <div className={styles.testName}>{mock.test[test].name}</div>
            {mock.test[test].timer && <Timer time={Number(mock.test[test].timer)} />}
            <div className={styles.title}>question {mock.test[test].questions[slice].number} of {mock.test[test].questions.length}: {mock.test[test].questions[slice].text}</div>
            <form>
                {mock.test[test].questions[slice].type === 'singleChoice' && (
                    <>
                        <h4 className={styles.tip}>Выберите 1 вариант ответа</h4>
                        {mock.test[0].questions[slice].options?.map((answer, id) => {
                            const groupName = `question_${mock.test[test].questions[slice].number}`;
                            return(
                                <div key={id} className={styles.answer}>
                                    <input
                                        type='radio'
                                        name={groupName}
                                        id={`answer_${id}`}
                                        checked={answers[mock.test[test].questions[slice].number] === answer}
                                        onChange={() => handleAnswerChange(mock.test[test].questions[slice].number, answer)}
                                    />
                                    <label htmlFor={`answer_${id}`}>{answer}</label>
                                </div>
                            )
                        })}
                    </>
                )}
                {mock.test[test].questions[slice].type === 'multipleChoice' && (
                    <>
                        <h4 className={styles.tip}>Выберите несколько вариантов ответа</h4>
                        {mock.test[test].questions[slice].options?.map((answer, id) => {
                            const checkboxId = `multipleChoice_${mock.test[test].questions[slice].number}_${id}`;
                            return(
                                <div key={id} className={styles.answer}>
                                    <input
                                        type='checkbox'
                                        id={checkboxId}
                                        name={`answer_${mock.test[test].questions[slice].number}`}
                                        onChange={(e) => {
                                            const questionNumber = mock.test[test].questions[slice].number;
                                            let currentAnswers = answers[questionNumber];
                                            let updatedAnswers: Answer;
                                            if (!Array.isArray(currentAnswers)) {
                                                currentAnswers = currentAnswers ? [currentAnswers] : [];
                                            }
                                            if (e.target.checked) {
                                                updatedAnswers = [...currentAnswers, answer]; // Теперь безопасно используем spread, т.к. currentAnswers - массив.
                                            } else {
                                                updatedAnswers = currentAnswers.filter(a => a !== answer);
                                            }
                                            handleAnswerChange(questionNumber, updatedAnswers.length > 1 ? updatedAnswers : updatedAnswers[0] || '');
                                        }}
                                        checked={answers[mock.test[test].questions[slice].number]?.includes(answer)}
                                    />
                                    <label htmlFor={checkboxId}>{answer}</label>
                                </div>
                            )
                        })}
                    </>
                )}
                {mock.test[test].questions[slice].type === 'shortAnswer' && (
                    <>
                        <h4 className={styles.tip}>Напишите ответ в одно слово</h4>
                        <div className={styles.answer}>
                            <input
                                type='text'
                                value={answers[mock.test[test].questions[slice].number] || ''}
                                onChange={(e) => handleAnswerChange(mock.test[test].questions[slice].number, e.target.value)}
                            />
                        </div>
                    </>
                )}
                {mock.test[test].questions[slice].type === 'longAnswer' && (
                    <>
                        <h4 className={styles.tip}>Напишите развернутый ответ</h4>
                        <div className={styles.answer}>
                            <textarea
                                value={answers[mock.test[test].questions[slice].number] || ''}
                                onChange={(e) => handleAnswerChange(mock.test[test].questions[slice].number, e.target.value)}
                            />
                        </div>
                    </>
                )}

                <div className={styles.buttonset}>
                    <button type="button" onClick={() => handlePrev(1)}>Предыдущий</button>
                    <button type="button" onClick={() => handleNext(1)}>Следующий</button>
                </div>
            </form>
        </div>
    )
}