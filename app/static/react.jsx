const App = () => {
    const [hrData, setHrData] = React.useState([]);
    const [gpxData, setGpxData] = React.useState([]);
    const [distance, setDistance] = React.useState(0);
    const [time, setTime] = React.useState("");

    // Kun sivu avataan haetaan treenin data
    React.useEffect(() => {
        hae_treeni_data(id)
        .then((data) => {
            console.log(data);
            let times = data.timestamps.map((entry) => entry.timestamp);
            let hr = data.timestamps.map((entry) => entry.heart_rate);
            setHrData({times:times, hr:hr});

            let gpx = data.timestamps
                .filter((entry) => 'lat' in entry && 'lon' in entry)
                .map((entry) => [entry.lat, entry.lon]);
            setGpxData(gpx);

            var map = L.map('map').setView(gpx[0], 14);
            
            L.tileLayer.mml("Peruskartta").addTo(map);
            let polyline = L.polyline(gpx, {color: 'blue', weight: 5}).addTo(map);

            setDistance((data.distance/1000));
            setTime(times[times.length-1])
        });

    }, []);

    return (
        <div>
            <SummaryPlotter
                distance={distance}
                time={time}
            />
            <HrPlotter
                hrData={hrData}
            />
        </div>
        
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


            let ctx = document.getElementById('hrChart').getContext('2d');
            new Chart(ctx, {
                type: "line",
                data: {
                labels: props.hrData.times,
                datasets: [{
                    label: 'HR',
                    fill: false,
                    lineTension: 1,
                    backgroundColor: "rgba(0,0,255,1)",
                    borderColor: "rgba(0,0,255,1)",
                    pointRadius: 1,
                    data: props.hrData.hr
                },
                {
                    label: 'Average HR',
                    fill: false,
                    lineTension: 0,
                    backgroundColor: 'rgba(255,0,0,1)',
                    borderColor: 'rgba(255,0,0,1)',
                    pointRadius: 1,
                    data: Array(props.hrData.hr.length).fill(avgHr)
                }]
                },
                options: {
                legend: {display: false},
                scales: {
                    y: {
                      beginAtZero: false,
                      min: minHr,
                      max: maxHr,
                    },
                }}
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

async function hae_treeni_data(id){
    let url = new URL(baseUrl+"/data/"+id);
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response;
    return(data.json());
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);