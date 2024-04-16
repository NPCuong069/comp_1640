import React, { useState, useEffect } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import axios from 'axios';
import GeneralLayout from '../../components/general/GeneralLayout';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

function Overview() {
    const [statusData, setStatusData] = useState({
        labels: ['Pending', 'Selected', 'Refer'],
        datasets: [{
            label: 'Contribution Status',
            data: [],
            backgroundColor: [
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)'
            ],
            hoverOffset: 4
        }]
    });
    const [trendData, setTrendData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Daily Contributions',
                data: [],
                borderColor: 'rgba(53, 162, 235, 0.7)',
                backgroundColor: 'rgba(53, 162, 235, 0.3)',
                fill: true,
                tension: 0.1
            }
        ]
    });

    useEffect(() => {
        const username = localStorage.getItem('username');
        const fetchContributions = async () => {
            try {
                const response = await axios.get(`https://localhost:7002/api/Contributions/user/${username}`);
                processContributionData(response.data);
            } catch (error) {
                console.error('Failed to fetch contributions:', error);
            }
        };
        fetchContributions();
    }, []);

    const processContributionData = (contributions) => {
        const statusCounts = { Pending: 0, Selected: 0, Refer: 0 };
        const dateCounts = {};

        contributions.forEach(({ status, submissionDate }) => {
            statusCounts[status]++;
            const date = new Date(submissionDate).toLocaleDateString();
            if (!dateCounts[date]) {
                dateCounts[date] = 0;
            }
            dateCounts[date]++;
        });

        const sortedDates = Object.keys(dateCounts).sort((a, b) => new Date(a) - new Date(b));

        setStatusData({
            ...statusData,
            datasets: [{
                ...statusData.datasets[0],
                data: [statusCounts['Pending'], statusCounts['Selected'], statusCounts['Refer']]
            }]
        });

        setTrendData({
            labels: sortedDates,
            datasets: [{
                ...trendData.datasets[0],
                data: sortedDates.map(date => dateCounts[date])
            }]
        });
    };

    return (
        <GeneralLayout>
            <div className="container mx-auto p-4">
                <h2 className="text-lg font-bold mb-4">Contribution Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-center font-semibold">Contribution Status</h3>
                        <Pie data={statusData} />
                    </div>
                    <div>
                        <h3 className="text-center font-semibold">Daily Contributions</h3>
                        <Line data={trendData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
                    </div>
                </div>
            </div>
        </GeneralLayout>
    );
}

export default Overview;
