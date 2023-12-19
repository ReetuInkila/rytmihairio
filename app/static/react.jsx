const App = () => {
    const [hrData, setHrData] = React.useState([]);
    const [gpxData, setGpxData] = React.useState([]);

    // Kun sivu avataan haetaan treenin data
    React.useEffect(() => {
        hae_treeni_data(id)
        .then((data) => {
            let times = data.map((entry) => entry.timestamp);
            let hr = data.map((entry) => entry.heart_rate);
            setHrData({times:times, hr:hr});

            let gpx = data
                .filter((entry) => 'lat' in entry && 'lon' in entry)
                .map((entry) => [entry.lat, entry.lon]);

            var map = L.map('map').setView(gpx[0], 14);
            
            L.tileLayer.mml("Peruskartta").addTo(map);
            let polyline = L.polyline(gpx, {color: 'blue', weight: 5}).addTo(map);
        });

    }, []);


    return (
        <div>
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

/**
  * Laskee kahden pisteen välisen etäisyyden
  */
function etaisyys(coord1, coord2){
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(coord2[0]-coord1[0]);  // deg2rad below
    let dLon = deg2rad(coord2[1]-coord1[1]);
    let a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(coord1[0])) * Math.cos(deg2rad(coord2[0])) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c; // Distance in km
    return d*1000;
}
/**
   Muuntaa asteet radiaaneiksi
  */
function deg2rad(deg) {
  return deg * (Math.PI/180);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);