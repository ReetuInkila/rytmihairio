const App = () => {
    const [pageLoaded, setPageLoaded] = React.useState(false);

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
        <p>Viimeisimmän treenin data</p>
    );
};
let baseUrl = "https://reetuinkila-401304.ew.r.appspot.com"



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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);