import React, { useEffect } from 'react';
import Chart from "chart.js/auto";

function HrPlotter(props) {
    useEffect(() => {
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

export default HrPlotter;