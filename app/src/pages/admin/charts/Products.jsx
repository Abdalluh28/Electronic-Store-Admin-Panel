import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useGetProductsChartQuery } from '../../../redux/features/charts/chartsApiSlice';
import { Spinner } from 'react-bootstrap';
import { useGetTotalOrdersQuery, useGetTotalSalesByDateQuery, useGetTotalSalesQuery } from '../../../redux/features/orders/OrdersApiSlice';

// Register the components that you want to use
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProductsChart = () => {

    const { data: topProducts, isLoading } = useGetProductsChartQuery();
    const {data: totalOrders, isLoading: isLoadingTotal} = useGetTotalOrdersQuery();
    const {data: totalSales, isLoading: isLoadingSales} = useGetTotalSalesQuery();
    const {data: totalSalesByDate} = useGetTotalSalesByDateQuery();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (topProducts) {
            setProducts(topProducts);
        }
    }, [topProducts]);

    useEffect(() => {
        if (totalSalesByDate) {
            console.log(totalSalesByDate)
        }
    },[totalSalesByDate])

    // Chart data
    const data = {
        labels: products?.map((product) => product.name),
        datasets: [
            {
                label: 'Sold',
                data: products?.map((product) => product.sold),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
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
                text: 'Top Products',
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
        <div className='w-full flex flex-col lg:flex-row lg:items-center'>
            <div className='flex flex-col gap-2 lg:w-[50%] w-full text-xl lg:mb-0 mb-4'>
                <div className='flex gap-1 items-center '>
                    <h1 className='2xl:w-1/3 lg:w-1/2 sm:w-[40%] w-1/2 text-2xl'>Total Orders: </h1>
                    <p className='btn btn-danger cursor-auto text-lg'>{totalOrders}</p>
                </div>
                <div className='flex gap-1 items-center '>
                    <h1 className='2xl:w-1/3 lg:w-1/2 sm:w-[40%] w-1/2 text-2xl'>Total Sales: </h1>
                    <p className='btn btn-danger cursor-auto text-lg'>${totalSales}</p>
                </div>
                <div className='flex gap-1 items-center '>
                    <h1 className='2xl:w-1/3 lg:w-1/2 sm:w-[40%] w-1/2 text-2xl'>Total Sales By Date: </h1>
                    <p className='btn btn-danger cursor-auto text-lg'>${totalSalesByDate}</p>
                </div>
            </div>
            <div
                className='lg:w-[50%] sm:w-[600px] w-fit h-[500px]' > {/* Adjust width and height */}
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default ProductsChart;
