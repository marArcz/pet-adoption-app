import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card } from "react-bootstrap";

const StatisticsComponent = () => {
    const labels = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
    ];

    const data = {
        labels,
        datasets: [
            {
                label: "Number of pets in care",
                data: labels.map(() => Math.floor(Math.random() * 200 + 1)),
                backgroundColor: "rgba(101, 84, 192, 0.6)",
            },
            {
                label: "Number of successful adoption",
                data: labels.map(() => Math.floor(Math.random() * 200 + 20)),
                backgroundColor: "rgba(0, 184, 217, 0.6)",
            },
        ],
    };

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: false,
                text: "Chart.js Bar Chart",
            },
        },
    };

    return (
        <Card className="border-0 rounded-0 shadow-sm">
            <Card.Body>
                <Bar options={options} data={data} />
            </Card.Body>
        </Card>
    )
}

export default StatisticsComponent

