import React, { useState } from 'react';
import './Main.css';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Chart from "chart.js/auto";


function Main() {
    const [hrData, setHrData] = useState([]);
    const [gpxData, setGpxData] = useState([]);
    const [distance, setDistance] = useState(0);
    const [time, setTime] = useState("");

    const url = 'http://localhost:8080/data';
  
    // Kun sivu avataan haetaan treenin data
    React.useEffect(() => {
        fetch(url).then((res) =>
            res.json().then((data) => {
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
            })
        );
    }, []);

    return (
        <div>
            <div id='map'><Map gpx={gpxData} /></div>
            <div id='data'>
                <SummaryPlotter
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

const Map = (props) => (
    props.gpx.length > 0 && (
      <MapContainer center={props.gpx[0]} zoom={14} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Polyline positions={props.gpx} color="blue" weight={5} />
      </MapContainer>
    )
);
  

const HrPlotter = function (props) {
    React.useEffect(() => {
        let chartInstance;

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
                let midHr = minHr + (maxHr - minHr) / 2;

                if (value > midHr) {
                    // Calculate green based on the range between minHr and avgHr
                    const normalized = 1 - (value - midHr) / (maxHr - midHr);
                    green = Math.round(255 * normalized);
                } else if (value < midHr) {
                    // Calculate red based on the range between avgHr and maxHr
                    const normalized = (value - minHr) / (midHr - minHr);
                    red = Math.round(255 * normalized);
                }
                return `rgba(${red}, ${green}, 0, 1)`;
            };

            // Destroy existing chart if it exists
            let existingCanvas = document.getElementById('hrChart');
            if (existingCanvas) {
                Chart.getChart(existingCanvas)?.destroy();
            }

            // Create a new chart
            let ctx = existingCanvas.getContext('2d');
            chartInstance = new Chart(ctx, {
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

        // Cleanup function to destroy the chart on component unmount or when props.hrData changes
        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [props.hrData]);

    return (
        <canvas id="hrChart"></canvas>
    );
};

const SummaryPlotter = function(props) {
    const [formattedTime, setFormattedTime] = useState("");
    const [speed, setSpeed] = useState(0);

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

export default Main;