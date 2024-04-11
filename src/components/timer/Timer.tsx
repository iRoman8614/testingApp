import React from 'react';
import {useEffect, useState} from "react";

interface Props {
    time: number;
}
export const Timer:React.FC<Props> = ({time}) => {
    const [minutes, setMinutes] = useState(time);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            } else if (minutes > 0) {
                setMinutes(minutes - 1);
                setSeconds(59);
            } else {
                localStorage.setItem('test', 'finished');
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [minutes, seconds]);

    return (
        <div>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
    );
};