import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ChartData,
    Filler
  } from 'chart.js';
import { Line } from 'react-chartjs-2';
import zoom from 'chartjs-plugin-zoom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    zoom
);

type hrPlotterProps = {
    hrData: {times:Array<string>, hr:Array<number>};
    alt:Array<number>;
};

function HrPlotter({ hrData, alt }: hrPlotterProps) {
    const [hr, setHr] = useState([40, 220]);
    const [data, setData] = useState<ChartData<'line', ChartData<'line'>['datasets'][0]['data'], unknown>>({
      datasets: [],
      labels: [],
    });

    function calculateColor(value:number){
        let red = 255;
        let green = 255;
        let midHr = hr[0] + (hr[1] - hr[0]) / 2;

        if (value > midHr) {
            // Calculate green based on the range between minHr and avgHr
            const normalized = 1 - (value - midHr) / (hr[1] - midHr);
            green = Math.round(255 * normalized);
        } else if (value < midHr) {
            // Calculate red based on the range between avgHr and maxHr
            const normalized = (value - hr[0]) / (midHr - hr[0]);
            red = Math.round(255 * normalized);
        }
        return `rgba(${red}, ${green}, 0, 1)`;
    };

    useEffect(() => {
        let minHr = Math.min(...hrData.hr);
        let maxHr = Math.max(...hrData.hr);
        setHr([minHr, maxHr]);

        setData({
            labels: hrData.times,
            datasets: [
              {
                label: 'HR',
                data: hrData.hr,
                backgroundColor: hrData.hr.map(calculateColor),
                borderColor: hrData.hr.map(calculateColor),
                showLine: false,
                pointRadius: 1,
                yAxisID: 'hr',
              },{
                label: 'Elevation',
                pointRadius: 0,
                fill: true,
                data: alt,
                yAxisID: 'alt',
            }]
        });
    }, [hrData, alt]);

    const options = {
        scales: {
          hr: {
            position: 'left' as const,
          },
          alt: {
            position: 'right' as const,
            grid: {
              drawOnChartArea: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'x' as const,
            }
          }
        },
    };

    


    return (
        <Line id="hrChart" data={data} options={options}/>
    );
};

export default HrPlotter;