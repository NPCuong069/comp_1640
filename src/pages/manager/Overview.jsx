import React, { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement, } from 'chart.js';
import axios from 'axios';
import { getAllContributions, getAcademicTerms } from './apiServices';
import { Bar } from 'react-chartjs-2';
import GeneralLayout from '../../components/general/GeneralLayout';
import './Overview.css';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

function MarketingManagerOverview() {

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Number of Contributions',
                data: [],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    });
    const [trendData, setTrendData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Daily Contributions',
                data: [],
                borderColor: 'rgba(75, 192, 192, 0.7)',
                backgroundColor: 'rgba(75, 192, 192, 0.3)',
                fill: true,
                tension: 0.1
            },
        ]
    });
    const [pieData, setPieData] = useState({
        labels: [],
        datasets: [{
            label: 'Contributions by Faculty',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)'
            ],
            hoverOffset: 4
        }]
    });

    const [selectedRateData, setSelectedRateData] = useState({
        labels: [],
        datasets: [{
            label: 'Rate of Selected Contributions by Faculty (%)',
            data: [],
            backgroundColor: [
                'rgba(75, 192, 192, 0.5)',
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)'
            ]
        }]
    });

    const [nonPendingRateData, setNonPendingRateData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        const fetchData = async () => {
            const contributions = await getAllContributions();
            const terms = await getAcademicTerms();
            const allDates = [];
            // Processing for bar and pie charts
            const termMap = terms.reduce((acc, term) => {
                acc[term.academicTermId] = term.academicYear;
                return acc;
            }, {});

            const contributionCounts = contributions.reduce((acc, contribution) => {
                acc[contribution.academicTermId] = (acc[contribution.academicTermId] || 0) + 1;
                return acc;
            }, {});

            const facultyCounts = contributions.reduce((acc, contribution) => {
                acc[contribution.facultyName] = (acc[contribution.facultyName] || 0) + 1;
                return acc;
            }, {});

            const selectedCounts = contributions.reduce((acc, contribution) => {
                if (contribution.status === "Selected") {
                    acc[contribution.facultyName] = (acc[contribution.facultyName] || 0) + 1;
                }
                return acc;
            }, {});

            const nonPendingCounts = contributions.reduce((acc, contribution) => {
                if (contribution.status !== "Pending") {
                    const key = `${contribution.facultyName}-${contribution.academicTermId}`;
                    acc[key] = (acc[key] || 0) + 1;
                }
                return acc;
            }, {});
            const dateCounts = contributions.reduce((acc, contribution) => {
                const date = new Date(contribution.submissionDate).toLocaleDateString();
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {});
            const facultyContributions = contributions.reduce((acc, { facultyName, submissionDate, academicTermId }) => {
                const date = new Date(submissionDate).toLocaleDateString();
                if (!acc[facultyName]) {
                    acc[facultyName] = {};
                }
                if (!acc[facultyName][date]) {
                    acc[facultyName][date] = 0;
                }
                acc[facultyName][date]++;
                return acc;
            }, {});
            const facultyDatasets2 = Object.keys(facultyContributions).map(faculty => {
                const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`;
                const data = allDates.map(date => facultyContributions[faculty][date] || 0);
                return {
                    label: faculty,
                    data,
                    borderColor: color,
                    backgroundColor: color,
                    fill: false,
                    tension: 0.1
                };
            });

            // Extract all unique dates and sort them
            contributions.forEach(({ submissionDate }) => {
                const formattedDate = new Date(submissionDate).toLocaleDateString();
                if (allDates.indexOf(formattedDate) === -1) {
                    allDates.push(formattedDate);
                }
            });
            allDates.sort((a, b) => new Date(a) - new Date(b));


            const sortedDates = Object.keys(dateCounts).sort((a, b) => new Date(a) - new Date(b));
            const datasets = Object.entries(termMap).map(([termId, termName]) => ({
                label: termName,
                data: Object.keys(facultyCounts).map(faculty => nonPendingCounts[`${faculty}-${termId}`] || 0),
                backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
            }));

            const facultyDateCounts = contributions.reduce((acc, contribution) => {
                const date = new Date(contribution.submissionDate).toLocaleDateString();
                const faculty = contribution.facultyName;
                if (!acc[faculty]) {
                    acc[faculty] = {};
                }
                if (!acc[faculty][date]) {
                    acc[faculty][date] = 0;
                }
                acc[faculty][date]++;
                return acc;
            }, {});

            const colors = ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(153, 102, 255, 0.5)', 'rgba(255, 159, 64, 0.5)'];
            let colorIndex = 0;

            const facultyDatasets = Object.keys(facultyContributions).map(faculty => {
                const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`;
                const data = allDates.map(date => facultyContributions[faculty][date] || 0);
                return {
                    label: faculty,
                    data,
                    borderColor: color,
                    backgroundColor: color,
                    fill: false,
                    tension: 0.1
                };
            });

            setTrendData({
                labels: allDates, // This assumes all faculties have the same date range
                datasets: facultyDatasets
            });
            setChartData({
                labels: Object.keys(termMap).map(key => termMap[key]),
                datasets: [{ ...chartData.datasets[0], data: Object.keys(contributionCounts).map(key => contributionCounts[key]) }]
            });

            setPieData({
                labels: Object.keys(facultyCounts),
                datasets: [{ ...pieData.datasets[0], data: Object.values(facultyCounts) }]
            });

            setSelectedRateData({
                labels: Object.keys(facultyCounts),
                datasets: [{ ...selectedRateData.datasets[0], data: Object.keys(facultyCounts).map(faculty => (selectedCounts[faculty] || 0) / (facultyCounts[faculty] || 1) * 100) }]
            });

            setNonPendingRateData({
                labels: Object.keys(facultyCounts),
                datasets
            });

        };

        fetchData();
    }, []);


    return (
        <GeneralLayout>
            <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={8}>
                    <h2>Contributions by academic year</h2>
                    <Bar data={chartData} options={{ responsive: true }} />
                </Grid>
                <Grid xs={12} md={6} lg={4}>
                    <h2>Contributions by Faculty</h2>
                    <Pie data={pieData} options={{ responsive: true }} />
                </Grid>
                <Grid xs={12} md={6} lg={6}>
                    <h2>Rate of Selected Contributions by Faculty</h2>
                    <Bar data={selectedRateData} options={{ responsive: true, indexAxis: 'y' }} />
                </Grid>
                <Grid xs={12} md={6} lg={6}>
                    <h2>Rate of Repplied Contributions by Faculty per Term</h2>
                    <Bar data={nonPendingRateData} options={{ responsive: true, scales: { x: { stacked: true }, y: { stacked: true } } }} />
                </Grid>
                <Grid xs={12} md={12}>
                    <h2>Daily Contribution Trends</h2>
                    <Line data={trendData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
                </Grid>
            </Grid>
        </GeneralLayout>
    );
}

export default MarketingManagerOverview;
