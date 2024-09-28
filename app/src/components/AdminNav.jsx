import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '../redux/features/auth/authApiSlice'
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export default function AdminNav() {

    const [logout] = useLogoutMutation();
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
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


    return (
        <>
            <ul
                className=' '
            >
                <li>
                    <Link to="/admin/profile" className="block px-4 py-2 hover:bg-gray-800 ">
                        Profile
                    </Link>
                </li>
                <li>
                    <button
                        className="block w-full px-4 py-2 text-left hover:bg-gray-800 "
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </>
    )
}
