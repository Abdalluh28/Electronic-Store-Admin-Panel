import React, { useEffect, useState } from 'react';
import { useDeleteUserMutation, useGetUsersQuery } from '../../../redux/features/users/usersApiSlice';
import Cookie from 'js-cookie';
import { Pagination, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import EditUserList from './EditUserList';
import Swal from 'sweetalert2';

export default function UserList() {
    const accessToken = Cookie.get('accessToken') || '';
    const [pageCounter, setPageCounter] = useState(1);
    const { data, isLoading, isSuccess, refetch } = useGetUsersQuery({ accessToken, page: pageCounter });
    const [deleteUser] = useDeleteUserMutation();
    const [loadingId, setLoadingId] = useState(null);
    const [maxPageNumber, setMaxPageNumber] = useState(1);
    const [users, setUsers] = useState([]);


    useEffect(() => {
        if (data) {
            console.log(data)
            setUsers(data.users);
            setMaxPageNumber(data.pages);
        }
    },[data])



    const confirmDelete = (id) => {

        const user = users.find((user) => user._id === id);


        Swal.fire({
            title: "Are you sure?",
            text: `You will delete ${user?.firstName} ${user?.lastName} from the list`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(id);
            }
        })
    }

    const handleDelete = async (id) => {
        setLoadingId(id);

        try {
            const response = await deleteUser({ accessToken, id });

            if (response.data) {
                toast.success('User deleted successfully', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });

                // Optionally refetch the users to ensure data consistency
                refetch();
            } else {
                toast.error('Failed to delete user', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        } catch (error) {
            toast.error('An error occurred while deleting the user', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } finally {
            setLoadingId(null);
        }
    };



    // pagination

    


    const handlePagination = (event) => {
        event.preventDefault();
        setPageCounter(parseInt(event.target.textContent))
    }


    let items = [];
    for (let number = 1; number <= maxPageNumber; number++) {
        items.push(
            <Pagination.Item key={number} active={number === pageCounter} onClick={handlePagination}>
                {number}
            </Pagination.Item>
        );
    }



    return (
        <>
            <h1 className='text-3xl '>User List</h1>
            {isLoading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : ''}

            {isSuccess && (
                <>
                    <div className='flex flex-col'>
                        <div className='flex my-3 text-xl'>
                            <div className='w-[25%] hidden 2xl:flex'>ID</div>
                            <div className='2xl:w-[20%]  lg:w-[40%] lg:flex hidden'>First Name</div>
                            <div className='2xl:w-[25%] lg:w-[40%] lg:flex hidden'>Email</div>
                            <div className='lg:hidden w-[80%]'></div>
                            <div className='2xl:w-[15%]  lg:w-[15%] sm:flex hidden'>Is Admin</div>
                        </div>
                        {users.map((user) => (
                            <div key={user._id} className={`flex mb-7 ${user._id === loadingId ? 'opacity-50' : ''}`}>
                                <div className='w-[25%] hidden 2xl:flex'>{user._id}</div>
                                <EditUserList user={user} refetch={refetch} />
                                <div className='2xl:w-[15%] w-[15%] sm:flex hidden self-center'>{user.isAdmin ? (
                                    <FontAwesomeIcon icon={faCheck} className='text-2xl text-green-500' />
                                ) : (
                                    <FontAwesomeIcon icon={faXmark} className='text-2xl text-red-500' />
                                )}</div>
                                {!user.isAdmin && (
                                    <div className='2xl:w-[15%] w-[5%] sm:flex hidden self-center'>
                                        {loadingId === user._id ? (
                                            <Spinner animation="border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faTrashCan}
                                                className='bg-red-500 w-fit py-2 px-3 rounded-lg cursor-pointer'
                                                onClick={() => confirmDelete(user._id)}
                                            />
                                        )}
                                    </div>
                                )}
                                <div className='sm:hidden flex w-[5%]'>
                                    {user.isAdmin &&
                                        <div className='self-center '>
                                            <div className='bg-green-500 px-3 py-2 rounded-lg '>Admin</div>
                                        </div>}
                                    {!user.isAdmin && <FontAwesomeIcon
                                        icon={faTrashCan}
                                        className='bg-red-500 w-fit py-2 px-3 rounded-lg cursor-pointer self-center'
                                        onClick={() => confirmDelete(user._id)}
                                    />}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='flex justify-center mt-5' >
                        <Pagination>
                            <Pagination.Prev onClick={() => setPageCounter((prev) => Math.max(prev - 1, 1))} />
                            {items}

                            {/* if next reached the last page then disable  */}
                            <Pagination.Next onClick={() => {
                                if (pageCounter < maxPageNumber) {
                                    setPageCounter((prev) => prev + 1)
                                }
                            }} />
                        </Pagination>

                    </div>
                </>
            )}
        </>
    );
}
