import React, { useState, useEffect } from 'react';
import './Summary.css';

type SummaryProps = {
    distance: number;
    time: string;
    hr: {avg:number, max:number};
    alt:Array<number>;
}; 

/**
 *  Renders Single row table whit distance, time and speed cells. 
 * @param {number, string} distance and time to show, and where to calculate speed 
 * @returns React element containing table
 */
function Summary({distance, time, hr, alt}: SummaryProps) {
    const [formattedTime, setFormattedTime] = useState("0h 0min 0s");
    const [speed, setSpeed] = useState(0);
    const [gainElevation, setGainElevation] = useState(0);
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);


    useEffect(() => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        const newFormattedTime = `${hours}h ${minutes}min ${seconds}s`;
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        const newSpeed = totalSeconds / 60 / distance;

        setFormattedTime(newFormattedTime);
        setSpeed(newSpeed);

    }, [distance, time]);

    useEffect(() => {
        let gain = 0;
        for(let i = 1; i < alt.length; i++){
            if (alt[i]>alt[i-1]){
                gain += alt[i]-alt[i-1]; 
            }

        }
        setGainElevation(gain);
    }, [alt]);

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseLeave = () => {
        setMousePosition(null);
    };

    return (
        <table className="summary">
            <tbody>
                <tr>
                    <td>{distance.toFixed(2)}<br/>km</td>
                    <td>{formattedTime}</td>
                    <td>{speed.toFixed(2)}<br/>min/km</td>
                    <td>AvgHr:<br/>{hr.avg}</td>
                    <td>MaxHr:<br/>{hr.max}</td>
                    <td className="hover-container" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                        Elev gain:<br/>{gainElevation.toFixed()} m
                        {mousePosition && (
                        <div className="hidden-text" style={{ top: mousePosition.y, left: mousePosition.x }}>
                            May contain some extra meters due to GPS data noise.
                        </div>
                        )}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default Summary;