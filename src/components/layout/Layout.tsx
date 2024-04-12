import React, {useEffect, useState} from 'react';
import {TestPage} from "../testPage/TestPage";
import {ResultPage} from "../resultPage/ResultPage";
import {mock} from '../../mock/TestContent'

import styles from './Layout.module.css'

export const Layout:React.FC = () => {
    const [currentTest, setCurrentTest] = useState<string | null>(localStorage.getItem('test'));

    const handleTestChoice = (id: number) => {
        localStorage.setItem('test', id.toString());
        setCurrentTest(localStorage.getItem('test'));
    }
    const handleFinish = () => {
        localStorage.setItem('test', 'finished');
        setCurrentTest(localStorage.getItem('test'));
    }
    useEffect(() => {
        if (currentTest !== null) {
            const intervalId = setInterval(() => {
                const newData = localStorage.getItem('test');
                if (newData !== currentTest) {
                    setCurrentTest(newData);
                }
            }, 2000);
            return () => {
                clearInterval(intervalId);
            };
        }
    }, [currentTest]);

    return (
        <div className={styles.root}>
            {currentTest == null && mock.test.map((test)=> {
                return(
                    <div className={styles.testTitle} key={test.id} onClick={()=>{handleTestChoice(test.id)}}>{test.name}</div>
                )
            })}
            {currentTest == 'finished' && (<ResultPage />)}
            {currentTest !== null && currentTest !== 'finished' && (
                <>
                    <TestPage testId={currentTest} />
                    <button className={styles.endButton} onClick={()=>handleFinish()}>Завершить</button>
                </>
            )}
        </div>
    )
}