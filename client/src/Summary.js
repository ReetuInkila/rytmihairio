import React, { useState, useEffect } from 'react';

function Summary(props) {
    const [formattedTime, setFormattedTime] = useState("");
    const [speed, setSpeed] = useState(0);

    useEffect(() => {
        const [hours, minutes, seconds] = props.time.split(':').map(Number);
        const newFormattedTime = `${hours}h ${minutes}min ${seconds}s`;
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        const newSpeed = totalSeconds / 60 / props.distance;

        setFormattedTime(newFormattedTime);
        setSpeed(newSpeed);

    }, [props.distance, props.time]);

    return (
        <table className="summary">
            <tbody>
                <tr>
                    <td>{props.distance.toFixed(2)} km</td>
                    <td>{formattedTime}</td>
                    <td>{speed.toFixed(2)} min/km</td>
                </tr>
            </tbody>
        </table>
    );
};

export default Summary;