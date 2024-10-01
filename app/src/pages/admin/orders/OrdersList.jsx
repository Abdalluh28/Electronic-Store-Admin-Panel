import React, { useEffect, useState } from 'react';
import { useGetAllOrdersQuery } from '../../../redux/features/orders/OrdersApiSlice';
import { Pagination, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useGetUsersQuery } from '../../../redux/features/users/usersApiSlice';
import Cookie from 'js-cookie';
import { useSelector } from 'react-redux';

export default function OrdersList() {
    const accessToken = Cookie.get('accessToken') ? Cookie.get('accessToken') : null;
    const [page, setPage] = useState(1);
    const { data, refetch: refetchOrders, isLoading: isOrdersLoading } = useGetAllOrdersQuery({ page });
    const { data: users, refetch: refetchUsers, isLoading: isUsersLoading } = useGetUsersQuery({ accessToken, page:1 });
    const [usersList, setUsersList] = useState([]);
    const navigate = useNavigate();
    const [maxPageNumber, setMaxPageNumber] = useState(1);
    const flag = useSelector(state => state.orders.flag);

    useEffect(() => {
        if (data) {
            const newUsersList = [];
            data.orders.forEach(order => {
                const user = users?.allUsers?.find(user => user._id === order.user);
                if (user) newUsersList.push(user);
            });
            setUsersList(newUsersList);
            setMaxPageNumber(data.pages);
        }
    }, [data, users]);


    const goToOrder = (id) => {
        // if lg or more make it disabled
        if (window.innerWidth < 1024) return
        navigate(`/admin/orderList/${id}`);
    };

    // Pagination handler
    const handlePagination = (event) => {
        event.preventDefault();
        setPage(parseInt(event.target.textContent));
    };

    let items = [];
    for (let number = 1; number <= maxPageNumber; number++) {
        items.push(
            <Pagination.Item key={number} active={number === page} onClick={handlePagination}>
                {number}
            </Pagination.Item>
        );
    }



    useEffect(() => {
        refetchOrders();
        refetchUsers();
    }, [flag])

    return (
        <>
            <h1 className='text-3xl mb-3'>Orders List</h1>

            {(isOrdersLoading || isUsersLoading || usersList.length === 0) && (
                <Spinner animation="border" role="status" />
            )}

            {!isOrdersLoading && !isUsersLoading && usersList.length > 0 && (
                <>
                    <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
                        <div className='text-lg col-span-1'>Items</div>
                        <div className='text-lg col-span-1'>User</div>
                        <div className='text-lg col-span-1 lg:block hidden'>Date</div>
                        <div className='text-lg col-span-1 lg:block hidden'>Price</div>
                        <div className='text-lg col-span-1 md:block hidden'>Status</div>
                    </div>

                    {data?.orders?.map(order => (
                        <div key={order._id} className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mb-3 border-b border-gray-700 border-opacity-60 pb-3'>
                            <div className='text-lg col-span-1 flex items-center'>
                                <img onClick={() => goToOrder(order._id)}
                                    src={ order?.orderItems[0]?.image.includes('cloudinary') ? order?.orderItems[0]?.image : process.env.REACT_APP_API_URL + order?.orderItems[0]?.image}
                                    alt={order?.orderItems[0]?.name}
                                    className='w-16 h-16 object-cover rounded-lg lg:cursor-pointer' />
                            </div>
                            <div className='text-lg col-span-1 flex items-center'>
                                {usersList?.find(user => user?._id === order?.user)?.firstName}
                            </div>
                            <div className='text-lg col-span-1 lg:flex items-center hidden'>{order?.createdAt.slice(0, 10)}</div>
                            <div className='text-lg col-span-1 lg:flex items-center hidden'>${order?.totalPrice}</div>
                            <div className='text-lg col-span-1 md:flex hidden'>
                                <div className='flex flex-col gap-1'>
                                    <div className={`btn ${order.isPaid ? 'btn-primary' : 'btn-warning'} h-fit cursor-default`}>{order.isPaid ? 'Paid' : 'Not Paid'}</div>
                                    <div className={`btn ${order.isDelivered ? 'btn-primary' : 'btn-danger'} h-fit cursor-default`}>{order.isDelivered ? 'Delivered' : 'Not Delivered'}</div>
                                </div>
                            </div>
                            <div className='flex items-center lg:hidden'>
                                <Link to={`/admin/orderList/${order._id}`} className='text-lg col-span-1 btn btn-primary'>
                                    View
                                </Link>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    <div className='flex justify-center mt-5'>
                        <Pagination>
                            <Pagination.Prev onClick={() => setPage((prev) => Math.max(prev - 1, 1))} />
                            {items}
                            <Pagination.Next onClick={() => {
                                if (page < maxPageNumber) {
                                    setPage((prev) => prev + 1);
                                }
                            }} />
                        </Pagination>
                    </div>
                </>
            )}
        </>
    );
}
