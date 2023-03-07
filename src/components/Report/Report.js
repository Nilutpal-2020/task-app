import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function Report(props) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
            position: 'top',
            },
            title: {
            display: true,
            text: 'Stats',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                steps: 1,
                max: Math.max(Object.values(props.dates)) > 10 ? Math.max(Object.values(props.dates)) : 10
            }
        }
    };

    const labels = Object.keys(props.dates);

    const data = {
        labels,
        datasets: [
            {
                label: 'No. of Tasks',
                data: Object.values(props.dates),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };

    return <Line options={options} data={data} />;
}