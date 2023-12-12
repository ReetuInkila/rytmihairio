const App = () => {

    // Kun sivu avataan luodaan kartta
    React.useEffect(() => {
        // Your Leaflet initialization and map creation here
        console.log(id);
        
        hae_gpx(id)
        .then(function(gpx) {
            var map = L.map('map').setView(gpx[0], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            let polyline = L.polyline(gpx, {color: 'red'}).addTo(map);
        })
    }, []);


    return (
        <div>
            <p>HR DATA</p>
            <HrPlotter/>
        </div>
        
    );
};

const HrPlotter = () => {
    const [fitData, setFitData] = React.useState([]);
  
    React.useEffect(() => {
        hae_hr_data(id)
        .then((data) => setFitData(data));
    }, []);
  
    React.useEffect(() => {
      if (fitData.length > 0) {

        let xValues = fitData.map((entry) => entry.timestamp);
        let yValues = fitData.map((entry) => entry.heart_rate);

        let ctx = document.getElementById('hrChart').getContext('2d');
        new Chart(ctx, {
            type: "line",
            data: {
              labels: xValues,
              datasets: [{
                label: 'hr',
                fill: false,
                lineTension: 0,
                backgroundColor: "rgba(0,0,255,1.0)",
                borderColor: "rgba(0,0,255,0.1)",
                data: yValues
              }]
            },
            options: {
              legend: {display: false},
              scales: {
                yAxes: [{ticks: {min: 6, max:16}}],
              }
            }
          });
      }
    }, [fitData]);
  
    return (
        <canvas id="hrChart" ></canvas>
    );
  };


let baseUrl = window.location.href;

async function hae_gpx(id){
    let url = new URL(baseUrl+"/gpx/"+id);
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.text();
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(data, 'text/xml');
    let trkptElements= xmlDoc.getElementsByTagName('trkpt');
    // Convert HTMLCollection to an array of arrays
    let coordinatesArray = Array.from(trkptElements).map(trkpt => {
        return [
            parseFloat(trkpt.getAttribute('lat')),
            parseFloat(trkpt.getAttribute('lon'))
        ];
    });
    return coordinatesArray;
}

async function hae_hr_data(id){
    let url = new URL(baseUrl+"/hr/"+id);
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.text();
    return(JSON.parse(data));
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);