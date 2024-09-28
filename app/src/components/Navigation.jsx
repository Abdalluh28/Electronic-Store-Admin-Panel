
"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faBagShopping, faHouse, faList, faRightToBracket, faTruckFast, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'

import gsap from 'gsap';
import { Link, useNavigate } from "react-router-dom";

import Cookies from 'js-cookie';
import { useLogoutMutation } from '../redux/features/auth/authApiSlice';
import { toast } from 'react-toastify';
import AdminNav from './AdminNav';
import { useState } from 'react';
export default function Navigation() {


    const isJWT = Cookies.get('jwt') ? true : false;
    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;


    const [isAnimating, setIsAnimating] = useState(false);


    const [logout] = useLogoutMutation();
    const navigate = useNavigate();


    const openSidebar = () => {
        document.querySelectorAll(".sidebarText").forEach((el) => {
            el.style.display = "block";
        })
        gsap.to(".sidebar", { duration: 0.5, width: "100%" });
    }

    const closeSidebar = () => {
        document.querySelectorAll(".sidebarText").forEach((el) => {
            el.style.display = "none";
        })
        gsap.to(".sidebar", { duration: 0.5, width: "30%" });
        const adminNav = document.querySelector('.adminNav');
        if (adminNav && !adminNav.classList.contains('hidden')) {
            gsap.to('.adminNav', {
                duration: 0.5,
                x: 100,
                opacity: 0,
                ease: "power2.out",
                onComplete: () => adminNav.classList.add('hidden')
            });
        }
    }

    const moveLink = (e) => {
        gsap.to(`.${e}`, { duration: 0.5, x: 10 });
    }

    const returnLink = (e) => {
        gsap.to(`.${e}`, { duration: 0.5, x: 0 });
    }


    const handleLogout = (e) => {
        e.preventDefault();
        logout({
            id: userInfo.id,
        });
        Cookies.remove('accessToken');
        Cookies.remove('userInfo');
        Cookies.remove('jwt');
        toast.success('Successfully logged out', {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            onOpen: () => navigate('/auth/Login'),
        });
    }

    const showAdminNav = () => {
        const adminNav = document.querySelector('.adminNav');
        if (adminNav.classList.contains('hidden')) {
            gsap.to('.adminNav', {
                duration: 0.5,
                x: 0,
                opacity: 1,
                ease: "power2.out",
                onStart: () => adminNav.classList.remove('hidden')
            });
        } else {
            gsap.to('.adminNav', {
                duration: 0.5,
                x: 100,
                opacity: 0,
                ease: "power2.out",
                onComplete: () => adminNav.classList.add('hidden')
            });
        }
    }


    return (
        <>
            <div className="nav w-32 h-screen fixed shadow-md z-50">
                <div className="sidebar h-full  bg-black w-15 overflow-hidden flex flex-col "
                    onMouseEnter={openSidebar} onMouseLeave={closeSidebar}>
                    <Link to="/" className="one h-10 py-4 flex items-center m-2 mt-5 "
                        onMouseOver={() => moveLink('one')} onMouseOut={() => returnLink('one')}>
                        <FontAwesomeIcon className='text-2xl mr-2' icon={faHouse} />
                        <span className="text-xl sidebarText hidden">Home</span>
                    </Link>

                    <Link to="/admin/productsList" className="two h-10 py-4 flex items-center m-2"
                        onMouseOver={() => moveLink('two')} onMouseOut={() => returnLink('two')}>
                        <FontAwesomeIcon className='text-2xl ms-1 mr-2' icon={faBagShopping} />
                        <span className="text-xl sidebarText hidden">Products</span>
                    </Link>

                    <Link to="/admin/categoryList" className="three h-10 py-4 flex items-center m-2"
                        onMouseOver={() => moveLink('three')} onMouseOut={() => returnLink('three')}>
                        <FontAwesomeIcon className='text-2xl ms-1 mr-2' icon={faList} />
                        <span className="text-xl sidebarText hidden">Category</span>
                    </Link>

                    <Link to="/admin/orderList" className="four h-10 py-4 flex items-center m-2"
                        onMouseOver={() => moveLink('four')} onMouseOut={() => returnLink('four')}>
                        <FontAwesomeIcon className='text-2xl ms-1 mr-2' icon={faTruckFast} />
                        <span className="text-xl sidebarText hidden">Orders</span>
                    </Link>

                    <Link to="/admin/userList" className="five h-10 py-4 flex items-center m-2"
                        onMouseOver={() => moveLink('five')} onMouseOut={() => returnLink('five')}>
                        <FontAwesomeIcon className='text-2xl ms-1 mr-2' icon={faUsers} />
                        <span className="text-xl sidebarText hidden">Users</span>
                    </Link>


                    {(!isJWT || (isJWT && !userInfo.isVerified)) && <div className='mt-auto'>
                        <Link to="/auth/Login" className="six h-10 py-4 flex items-center m-2"
                            onMouseOver={() => moveLink('six')} onMouseOut={() => returnLink('six')}>
                            <FontAwesomeIcon className='text-2xl mr-2' icon={faRightToBracket} />
                            <span className="text-xl sidebarText hidden">Login</span>
                        </Link>
                        <Link to="/auth/Register" className="seven h-10 py-4 flex items-center m-2"
                            onMouseOver={() => moveLink('seven')} onMouseOut={() => returnLink('seven')}>
                            <FontAwesomeIcon className='text-2xl mr-2' icon={faUser} />
                            <span className="text-xl sidebarText hidden">Register</span>
                        </Link>

                    </div>}
                    {isJWT && userInfo.isVerified && (
                        <div className='mt-auto'>
                            <span className='adminNav hidden '><AdminNav /></span>
                            <div className="six h-10 py-4 flex gap-1 m-2 cursor-pointer text-lg"
                                onMouseOver={() => moveLink('six')} onMouseOut={() => returnLink('six')}
                                onClick={showAdminNav}>
                                <span className='navigationUserName'>{userInfo.firstName}</span>
                                <FontAwesomeIcon icon={faArrowUp} className='mt-1' />
                            </div>
                            <div className='h-7'></div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
