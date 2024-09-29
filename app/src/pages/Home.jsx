import React, { useEffect, useState } from 'react';
import ProductsChart from './admin/charts/Products';
import CategoriesChart from './admin/charts/Categories';
import UsersChart from './admin/charts/Users';
import Cookies from 'js-cookie';


const BarChart = () => {
    const accessToken = Cookies.get('accessToken') ? Cookies.get('accessToken') : null;
    const jwt = Cookies.get('jwt') ? Cookies.get('jwt') : null;
    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null

    useEffect(() => {
        if (!accessToken && !jwt && !userInfo) {
            window.location.href = '/auth/login';
        }
    }, [accessToken, jwt, userInfo])


    return (
        <>
            <ProductsChart />
            <div className=" mt-5 rounded-full flex items-center text-white text-xl lg:flex-row flex-col">
                <div className='lg:w-[50%] sm:w-[600px] w-fit h-[500px]'>
                    <CategoriesChart />
                </div>
                <div className='lg:w-[50%] sm:w-[600px] w-fit h-[500px]'>
                    <UsersChart />
                </div>
            </div>
        </>
    );
};

export default BarChart;
