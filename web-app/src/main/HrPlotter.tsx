import React, { useEffect } from 'react';
import Chart from "chart.js/auto";

type hrPlotterProps = {
    hrData: {times:Array<string>, hr:Array<number>}
};

function HrPlotter({hrData}:hrPlotterProps) {
    useEffect(() => {
        let chartInstance:Chart;

        if (hrData.hr) {
            // Find min and max heart rate values
            let minHr = Math.min(...hrData.hr);
            let maxHr = Math.max(...hrData.hr);

            // Function to calculate color based on heart rate value
            const calculateColor = (value:number) => {
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
            let existingCanvas = document.getElementById('hrChart') as HTMLCanvasElement | null;
            if (existingCanvas) {
                Chart.getChart(existingCanvas)?.destroy();
                
                // Create a new chart
                let ctx = existingCanvas.getContext('2d');
                if(ctx){
                    chartInstance = new Chart(ctx, {
                        type: "line",
                        data: {
                            labels: hrData.times,
                            datasets: [{
                                label: 'HR',
                                fill: false,
                                showLine: false,
                                backgroundColor: hrData.hr.map(calculateColor),
                                borderColor: hrData.hr.map(calculateColor),
                                pointRadius: 2,
                                data: hrData.hr
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
                
            }
        }

        // Cleanup function to destroy the chart on component unmount or when props.hrData changes
        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [hrData]);

    return (
        <canvas id="hrChart"></canvas>
    );
};

export default HrPlotter;