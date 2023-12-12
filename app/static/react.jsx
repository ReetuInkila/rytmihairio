const App = () => {

    // Kun sivu avataan luodaan kartta
    React.useEffect(() => {
        // Your Leaflet initialization and map creation here
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

    let start = coordinatesArray[0];
    let stop = coordinatesArray[coordinatesArray.length-1];

    for(let i= 0; i<coordinatesArray.length; i++){
        if(etaisyys(start, coordinatesArray[i])<500){
            coordinatesArray.splice(i, 1);
            i--;
        }else {
            break;
        }

    }
    for(let i = coordinatesArray.length-1; i>-1; i--){
        if(etaisyys(stop, coordinatesArray[i])<500){
            coordinatesArray.splice(i, 1);
        }else {
            break;
        }
    }

    return coordinatesArray;
}

async function hae_hr_data(id){
    let url = new URL(baseUrl+"/hr/"+id);
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