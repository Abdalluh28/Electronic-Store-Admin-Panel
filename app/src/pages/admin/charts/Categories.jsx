import React, { useEffect, useState } from 'react';
import { useGetCategoriesChartQuery } from '../../../redux/features/charts/chartsApiSlice';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoriesChart = () => {
    const { data: topCategories, isLoading } = useGetCategoriesChartQuery();
    const [categories, setCategories] = useState([]);
    const [names, setNames] = useState([]);

    useEffect(() => {
        if (topCategories) {
            setCategories(topCategories.categories); // Assuming categories is an array of { id, count }
            setNames(topCategories.names); // Assuming names is an array of category names
        }
    }, [topCategories]);

    const data = {
        labels: names, // Use the names for the labels
        datasets: [
            {
                label: '# of Votes',
                data: categories?.map((category) => category.count), // Extract counts from categories
                backgroundColor: [
                    '#f05252',
                    '#3f83f8',
                    '#c27803',
                    '#0e9f6e',
                    '#9061f9',
                ],
                borderColor: [
                    '#c81e1e',
                    '#1a56db',
                    '#8e4b10',
                    '#046c4e',
                    '#6c2bd9',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Disable the legend
            },
            title: {
                display: true,
                text: 'Top Categories',
                font: {
                    size: 20,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const count = categories[tooltipItem.dataIndex]?.count; // Get count using the same index
                        return `${count} ${count === 1 ? 'Product' : 'Products'}`; // Return formatted tooltip
                    },
                },
                bodyFont: {
                    size: 14, // Tooltip text size
                },
                titleFont: {
                    size: 16, // Tooltip title text size
                },
            },
        },
    };

    return (
        <div style={{ width: 'fit-content', height: '400px' }}>
            {isLoading ? <p>Loading...</p> : <Doughnut data={data} options={options} />}
        </div>
    );
};

export default CategoriesChart;
