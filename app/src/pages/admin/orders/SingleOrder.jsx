import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { useGetSingleOrderQuery, useUpdateOrderToDeliveredMutation } from '../../../redux/features/orders/OrdersApiSlice';
import Cookie from 'js-cookie';
import { Spinner } from 'react-bootstrap';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setFlag } from '../../../redux/slices/ordersSlice';


export default function SingleOrder() {

    const { id } = useParams();
    const accessToken = Cookie.get('accessToken') ? Cookie.get('accessToken') : null;
    const { data, refetch: refetchSingleOrder, isLoading } = useGetSingleOrderQuery({ id, accessToken });
    const [updateOrderToDelivered, { isLoading: isDelivering }] = useUpdateOrderToDeliveredMutation();
    const [isDelivered, setIsDelivered] = useState(false);
    const flag = useSelector(state => state.orders.flag);
    const dispatch = useDispatch();

    useEffect(() => {
        if (data) {
            setIsDelivered(data.order.isDelivered);
        }
    }, [data])


    const handleLinkEnterHover = (id) => {
        const target = document.getElementById(`btn-${id}`);

        gsap.fromTo(target, {
            borderBottom: '2px solid rgba(255, 255, 255, 0)',
            paddingBottom: '2px'
        },
            {
                borderBottom: '2px solid rgba(255, 255, 255, 1)',
                duration: 0.5,
                ease: "power1.inOut"
            });
    }

    const handleLinkLeaveHover = (id) => {
        const target = document.getElementById(`btn-${id}`);

        gsap.fromTo(target, {
            borderBottom: '2px solid rgba(255, 255, 255, 1)',
            paddingBottom: '2px'
        }, {
            borderBottom: '2px solid rgba(255, 255, 255, 0)',
            duration: 0.5,
            ease: "power1.inOut"
        })
    }


    const handleMakeDelivered = async () => {
        Swal.fire({
            title: 'Are you sure you delivered this ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delivered it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await updateOrderToDelivered({ id, accessToken });

                if (data) {
                    refetchSingleOrder();
                    setIsDelivered(true);
                    dispatch(setFlag(!flag));
                    toast.success('Delivered successfully', {
                        tion: "top-right",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                }
            }
        })
    }


    return (
        <>
            {isLoading && (
                <Spinner animation="border" role="status" />
            )}

            {!isLoading && (
                <>
                    <h1 className='text-2xl mb-3'>Order for {data.userName} </h1>

                    <div className='grid grid-cols-3 md:grid-cols-4 gap-2 mb-3'>
                        <div className='col-span-1 md:block hidden' >Imgae</div>
                        <div className='col-span-1' >Product</div>
                        <div className='col-span-1' >Quantity</div>
                        <div className='col-span-1' >Total Price</div>
                    </div>

                    {data.order.orderItems.map(item => (
                        <>
                            <div className='grid grid-cols-3 md:grid-cols-4 gap-2 mb-3 border-b border-gray-700 border-opacity-60 pb-3'>
                                <div className='col-span-1 items-center md:flex hidden'>
                                    <img src={process.env.REACT_APP_API_URL + item?.image}
                                        alt={item?.name}
                                        className='w-24 h-24 object-cover rounded-lg lg:cursor-pointer' />
                                </div>

                                <div className='col-span-1 flex items-center text-lg'>
                                    <Link to={`/admin/PorductsEdit/${item.product}`} onMouseEnter={() => handleLinkEnterHover(item._id)}
                                        onMouseLeave={() => handleLinkLeaveHover(item._id)}
                                        id={`btn-${item._id}`} className='w-fit cursor-pointer'>

                                        {item.name}
                                    </Link>
                                </div>

                                <div className='col-span-1 flex items-center text-lg pl-2'>
                                    {item.qty}
                                </div>

                                <div className='col-span-1 flex items-center text-lg pl-2'>
                                    ${item.qty * item.price}
                                </div>
                            </div>

                        </>
                    ))}


                    <div className='flex lg:flex-row flex-col text-lg gap-2'>
                        <div className='flex flex-col lg:w-[50%] w-full'>
                            <h3 className='text-xl font-medium'>Shipping</h3>
                            <div className='flex my-2'>
                                <p className='text-gray-400'>Address: </p>
                                <p> &nbsp; {data.order.shippingAddress.address}, {data.order.shippingAddress.city}, {data.order.shippingAddress.country}</p>
                            </div>

                            <div className='flex my-2'>
                                <p className='text-gray-400'>postalCode: </p>
                                <p> &nbsp; {data.order.shippingAddress.postalCode}</p>
                            </div>

                            <div className='flex my-2'>
                                <p className='text-gray-400'>Payment Method: </p>
                                <p> &nbsp; {data.order.paymentMethod}</p>
                            </div>
                        </div>

                        <div className='felx flex-col lg:w-[50%] w-full'>
                            <h3 className='text-xl font-medium'>Order Details</h3>
                            <div className='flex my-2'>
                                <p className='text-gray-400'>Price: </p>
                                <p> &nbsp; ${data.order.itemsPrice}</p>
                            </div>

                            <div className='flex my-2'>
                                <p className='text-gray-400'>Tax price: </p>
                                <p> &nbsp; ${data.order.taxPrice}</p>
                            </div>

                            <div className='flex my-2'>
                                <p className='text-gray-400'>Shipping price: </p>
                                <p> &nbsp; ${data.order.shippingPrice}</p>
                            </div>

                            <div className='flex my-2'>
                                <p className='text-gray-400'>Total price: </p>
                                <p> &nbsp; ${data.order.totalPrice}</p>
                            </div>
                        </div>
                    </div>


                    <div className='flex gap-2 my-2'>
                        <button disabled className='bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out text-lg text-white px-4 py-2 rounded-lg my-1' > {data.order.isPaid ? 'Paid' : 'Not Paid'} </button>
                        <button {...(isDelivered && { disabled: true })}
                            className='bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out text-lg text-white px-4 py-2 rounded-lg my-1'
                            onClick={handleMakeDelivered} >
                            {isDelivering ? <Spinner animation="border" role="status" /> :
                                isDelivered ? 'Delivered' : 'Mark as Delivered'}
                        </button>
                    </div>
                </>
            )}
        </>
    )
}
