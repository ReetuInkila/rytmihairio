import React, { useState, useEffect } from 'react';
import './Main.css';
import Summary from './Summary'
import HrPlotter from './HrPlotter'
import Map from './Map'


function Main() {
    const [hrData, setHrData] = useState<{ times: string[], hr: number[] }>({ times: [], hr: [] });
    const [gpxData, setGpxData] = useState([]);
    const [distance, setDistance] = useState(0);
    const [time, setTime] = useState("00:00:00");

    // Define an interface for the structure of the objects in data.timestamps
    interface TimestampEntry {
        timestamp: string;
        heart_rate: number;
        lat: number;
        lon: number;
    }
  

    const url = 'https://syke-backend-w6xkb6ulza-lz.a.run.app/data';
  
    // Kun sivu avataan haetaan treenin data
    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');

        fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then((res) =>
            res.json().then((data) => {
                console.log(data);
                let times = data.timestamps.map((entry:TimestampEntry) => entry.timestamp);
                let hr = data.timestamps.map((entry:TimestampEntry) => entry.heart_rate);
                setHrData({times, hr});

                let gpx = data.timestamps
                    .filter((entry:TimestampEntry) => 'lat' in entry && 'lon' in entry)
                    .map((entry:TimestampEntry) => [entry.lat, entry.lon]);
                setGpxData(gpx);

                setDistance((data.distance/1000));
                setTime(times[times.length-1])
            })
        );
    }, []);

    return (
        <div>
            <div id='map'><Map gpx={gpxData} /></div>
            <div id='data'>
                <Summary
                distance={distance}
                time={time}
                />
                <HrPlotter
                    hrData={hrData}
                />
            </div>
        </div>
        
    );
}

export default Main;