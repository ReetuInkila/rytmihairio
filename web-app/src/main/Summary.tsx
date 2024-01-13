import React, { useState, useEffect } from 'react';

type SummaryProps = {
    distance: number;
    time: string;
    hr: {avg:number, max:number}
}; 

/**
 *  Renders Single row table whit distance, time and speed cells. 
 * @param {number, string} distance and time to show, and where to calculate speed 
 * @returns React element containing table
 */
function Summary({distance, time, hr}: SummaryProps) {
    const [formattedTime, setFormattedTime] = useState("0h 0min 0s");
    const [speed, setSpeed] = useState(0);


    useEffect(() => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        const newFormattedTime = `${hours}h ${minutes}min ${seconds}s`;
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        const newSpeed = totalSeconds / 60 / distance;

        setFormattedTime(newFormattedTime);
        setSpeed(newSpeed);

    }, [distance, time]);

    return (
        <table className="summary">
            <tbody>
                <tr>
                    <td>{distance.toFixed(2)} km</td>
                    <td>{formattedTime}</td>
                    <td>{speed.toFixed(2)} min/km</td>
                    <td>AvgHr: {hr.avg}</td>
                    <td>MaxHr: {hr.max}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default Summary;