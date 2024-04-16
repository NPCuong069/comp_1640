import React, { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import axios from 'axios';
import GeneralLayout from '../../components/general/GeneralLayout';
import './Overview.css';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

function MarketingCoordinatorOverview() {
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
    const [studentRateData, setStudentRateData] = useState({
        labels: ['Students Contributing', 'Students Not Contributing'],
        datasets: [{
            label: 'Student Contribution Rate',
            data: [],
            backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 99, 132, 0.6)'
            ],
            hoverOffset: 4
        }]
    });

    const facultyName = localStorage.getItem('facultyName');

    useEffect(() => {
        const fetchData = async () => {
            const contributionsResponse = await axios.get(`https://localhost:7002/api/Contributions/faculty/${facultyName}`);
            const facultyResponse = await axios.get(`https://localhost:7002/api/Faculties/${facultyName}`);

            processContributionData(contributionsResponse.data);
            processFacultyData(facultyResponse.data, contributionsResponse.data);
        };
        fetchData();
    }, [facultyName]);

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

    const processFacultyData = (facultyData, contributions) => {
        const studentUsernames = facultyData.users.filter(user => user.roleName === 'Student').map(user => user.userName);
        const contributingUsernames = new Set(contributions.map(contribution => contribution.userName));
        const contributingStudents = studentUsernames.filter(username => contributingUsernames.has(username)).length;

        setStudentRateData({
            ...studentRateData,
            datasets: [{
                ...studentRateData.datasets[0],
                data: [contributingStudents, studentUsernames.length - contributingStudents]
            }]
        });
    };


    return (
        <GeneralLayout>
            <div className="container mx-auto p-4">
                <h2 className="text-lg font-bold mb-4">Marketing Coordinator Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="chart-container">
                        <h3 className="text-center font-semibold">Contribution Status</h3>
                        <Pie data={statusData} />
                    </div >
                    <div className="chart-container">
                        <h3 className="text-center font-semibold">Student Contribution Rate</h3>
                        <Pie data={studentRateData} />
                    </div>
                    <div className="chart-container2 py-6">
                        <h3 className="text-center font-semibold">Daily Contributions</h3>
                        <Line data={trendData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
                    </div>

                </div>
            </div>
        </GeneralLayout>
    );
}

export default MarketingCoordinatorOverview;
