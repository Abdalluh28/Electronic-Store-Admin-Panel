import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useGetUsersChartQuery } from '../../../redux/features/charts/chartsApiSlice';
import { Spinner } from 'react-bootstrap';
import { useGetTotalOrdersQuery, useGetTotalSalesByDateQuery, useGetTotalSalesQuery } from '../../../redux/features/orders/OrdersApiSlice';

// Register the components that you want to use
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UsersChart = () => {

    const { data: topUsers, isLoading } = useGetUsersChartQuery();
    const [users, setUsers] = useState([]);
    const [names, setNames] = useState([]);

    useEffect(() => {
        if (topUsers) {
            setUsers(topUsers.users);
            setNames(topUsers.names);
            console.log(topUsers)
        }
    }, [topUsers]);


    // Chart data
    const data = {
        labels: names,
        datasets: [
            {
                label: 'Orders Count',
                data: users?.map((user) => user.count),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false, // Ensure chart size is controlled manually
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 16, // Change legend text size
                    },
                },
            },
            title: {
                display: true,
                text: 'Top Users',
                font: {
                    size: 20, // Change title text size
                },
            },
            tooltip: {
                bodyFont: {
                    size: 14, // Tooltip text size
                },
                titleFont: {
                    size: 16, // Tooltip title text size
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 14, // Change X-axis label text size
                    },
                },
            },
            y: {
                ticks: {
                    font: {
                        size: 14, // Change Y-axis label text size
                    },
                },
            },
        },
    };

    // Show spinner while data is loading
    if (isLoading) {
        return (
            <div className="text-center">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Bar data={data} options={options} />
    );
};

export default UsersChart;
