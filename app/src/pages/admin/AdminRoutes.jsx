import React from 'react'
import Cookies from 'js-cookie'
import { Navigate, Outlet } from 'react-router';
export default function AdminRoutes() {

    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null ;


    return (
        userInfo && userInfo.isAdmin && userInfo.isVerified ? <Outlet /> : <Navigate to='/auth/login' replace />
    )
}
