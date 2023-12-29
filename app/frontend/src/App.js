import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Chart from "chart.js/auto";


function App() {
    const [hrData, setHrData] = React.useState([]);
    const [gpxData, setGpxData] = React.useState([]);
    const [distance, setDistance] = React.useState(0);
    const [time, setTime] = React.useState("");

    // Kun sivu avataan haetaan treenin data
    React.useEffect(() => {
        /*
        hae_treeni_data()
        .then((data) => {
            console.log(data);
            let times = data.timestamps.map((entry) => entry.timestamp);
            let hr = data.timestamps.map((entry) => entry.heart_rate);
            setHrData({times:times, hr:hr});

            let gpx = data.timestamps
                .filter((entry) => 'lat' in entry && 'lon' in entry)
                .map((entry) => [entry.lat, entry.lon]);
            setGpxData(gpx);

            setDistance((data.distance/1000));
            setTime(times[times.length-1])
        });
        */

    }, []);

    return (
        <div>
            <Map />
            <SummaryPlotter
                distance={distance}
                time={time}
            />
            <HrPlotter
                hrData={hrData}
            />
        </div>
        
    );
}

const Map = () => {
    const position = [51.505, -0.09]; // Initial map coordinates
  
    return (
      <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    );
};
  

const HrPlotter = function(props) {
    React.useEffect(() => {
        if (props.hrData.hr) {

            // Calculate average heart rate
            let avgHr = Math.round(props.hrData.hr.reduce((sum, hr) => sum + hr, 0) / props.hrData.hr.length);

            // Find min and max heart rate values
            let minHr = Math.min(...props.hrData.hr);
            let maxHr = Math.max(...props.hrData.hr);

            // Function to calculate color based on heart rate value
            const calculateColor = (value) => {
                let red = 255;
                let green = 255;
                let midHr = minHr+(maxHr-minHr)/2;

                if (value > midHr) {
                    // Calculate green based on the range between minHr and avgHr
                    const normalized = 1-(value - midHr) / (maxHr - midHr);
                    green = Math.round(255 * normalized);
                } else if (value < midHr) {
                    // Calculate red based on the range between avgHr and maxHr
                    const normalized = (value - minHr) / (midHr - minHr);
                    red = Math.round(255 * normalized);
                }
                return `rgba(${red}, ${green}, 0, 1)`;
            };

            let ctx = document.getElementById('hrChart').getContext('2d');
            new Chart(ctx, {
                type: "line",
                data: {
                labels: props.hrData.times,
                datasets: [{
                    label: 'HR',
                    fill: false,
                    showLine: false,
                    backgroundColor: props.hrData.hr.map(calculateColor),
                    borderColor: props.hrData.hr.map(calculateColor),
                    pointRadius: 2,
                    data: props.hrData.hr
                },
                {
                    label: 'Average HR',
                    fill: false,
                    tension: 0,
                    backgroundColor: calculateColor(avgHr),
                    borderColor: calculateColor(avgHr),
                    pointRadius: 1,
                    data: Array(props.hrData.hr.length).fill(avgHr)
                }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: minHr,
                            max: maxHr,
                        },
                    }
                }
            });
        }
    }, [props.hrData]);
  
    return (
        <canvas id="hrChart" ></canvas>
    );
};

const SummaryPlotter = function(props) {
    const [formattedTime, setFormattedTime] = React.useState("");
    const [speed, setSpeed] = React.useState(0);

    React.useEffect(() => {
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


let baseUrl = window.location.href;

async function hae_treeni_data(){
    let url = new URL(baseUrl+"/data/");
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response;
    return(data.json());
}

export default App;