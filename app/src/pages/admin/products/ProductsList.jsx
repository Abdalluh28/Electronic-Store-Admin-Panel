import React, { useEffect, useState } from 'react'
import { useDeleteProductMutation, useGetAllProductsQuery, useGetProductsQuery } from '../../../redux/features/products/productsApiSlice'
import { useGetCategoriesQuery } from '../../../redux/features/categories/categoriesApiSlice';
import { Pagination, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { faEllipsis, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import Swal from 'sweetalert2';
import Cookie from 'js-cookie';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

export default function ProductsList() {

    const [pageCounter, setPageCounter] = useState(1);
    const [keyword, setKeyword] = useState('');
    const { data, isLoading, isSuccess, refetch: refetchProducts } = useGetProductsQuery({ page: pageCounter, keyword });
    const { data: allProducts } = useGetAllProductsQuery();
    const { data: categories } = useGetCategoriesQuery();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
    const accessToken = Cookie.get('accessToken') || '';
    const [maxPageNumber, setMaxPageNumber] = useState(1);

    const [deleteingElement, setDeleteingElement] = useState(null);

    const [openMenuId, setOpenMenuId] = useState(null);

    const navigate = useNavigate();

    const productFlag = useSelector(state => state.product.productFlag)
    useEffect(() => {
        refetchProducts();
    }, [productFlag])

    const handleMenuClick = (id) => {
        setOpenMenuId((prevId) => (prevId === id ? null : id));

    };

    const handleClickOutside = (event) => {
        if (!event.target.closest('.menu-container')) {
            setOpenMenuId(null);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);


    useEffect(() => {
        if (openMenuId) {
            const targets = document.querySelectorAll(`#btn-${openMenuId}`);
            gsap.fromTo(targets, { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.5 });
        }
    }, [openMenuId]);


    const handleDelete = async (event, id, name) => {
        setDeleteingElement(id);
        event.preventDefault();
        if (isDeleting && deleteingElement === product._id) {
            return <Spinner animation="border" />;
        }
        Swal.fire({
            title: "Are you sure?",
            text: `You will delete ${name} from the list`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                completeDelete(id);
            }
        })
    }


    const completeDelete = async (id) => {
        const { data, error } = await deleteProduct({ id, accessToken });
        if (data) {
            refetchProducts();
            toast.success('Product deleted successfully', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return
        }
        if (error) {
            toast.error(error.data.message, {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })
            return
        }
    }



    // pagination

    useEffect(() => {
        if (data) {
            setMaxPageNumber(data.pages);
        }
    }, [data])


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


    // debounce search

    const debounceSearch = (cb, delay) => {
        let timeOut;
        const spinner = document.querySelector('.spinner');
        return (...args) => {
            clearTimeout(timeOut);
            spinner?.classList.remove('hidden');
            timeOut = setTimeout(() => {
                cb(...args);
                spinner.classList.add('hidden');
            }, delay);
        }
    }

    const handleSearch = debounceSearch((event) => {
        const value = event.target.value;
        if (value) {
            setKeyword(value);
            setPageCounter(1);
        } else {
            setKeyword('');
            setPageCounter(1);
        }
    }, 500);

    return (
        <div className='flex flex-col h-full'>
            <div className='h-[600px]'>
                <div className='flex justify-between'>
                    <h1 className='text-3xl'>All Products</h1>
                    <div className='sm:mr-20 mr-0'>
                        <button className="btn btn-primary text-lg cursor-pointer"
                            onClick={() => { navigate('AddProduct') }}>Add Product</button>
                    </div>
                </div>

                {/* search bar */}
                <div className='flex items-center relative' >
                    <input id='search'
                        className="form-control my-2 xl:w-1/4 sm:w-1/3 w-1/2 rounded-lg z-0 pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="text"
                        placeholder="Search..."
                        onChange={handleSearch}
                    />
                    <label htmlFor='search' className='absolute left-3 text-gray-500 text-lg bg-transparent z-20 p-1'>
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                        />
                    </label>
                    <span className='spinner -translate-x-10 hidden'>
                        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    </span>
                </div>



                {isLoading ? (
                    <Spinner animation="border" role="status">
                    </Spinner>
                ) : ''}

                {isSuccess && (
                    <div className='flex flex-col '>
                        <div className='flex my-4 text-lg'>
                            <div className='xl:w-[25%] lg:w-[30%] w-[40%] mr-2'>Name</div>
                            <div className='xl:w-[18%] lg:w-[20%] w-[35%] ps-2'>Price</div>
                            <div className='xl:w-[18%] lg:w-[20%] w-[15%] '>Quantity</div>
                            <div className='xl:w-[18%] lg:w-[20%] lg:flex hidden'>Category</div>
                        </div>
                        {data.products.map((product) => (
                            <>
                                <div className='flex my-3 lg:text-lg' key={product._id}>
                                    <div className='xl:w-[25%] lg:w-[30%] w-[40%] mr-2'>
                                        <Link to={`/admin/PorductsEdit/${product._id}`} className="lg:text-lg font-medium text-gray-300 hover:text-white hover:underline transition duration-300 hover:underline-offset-8">
                                            {product.name}
                                        </Link>
                                    </div>
                                    <div className='xl:w-[18%] lg:w-[20%] w-[35%] ps-2'>${product.price}</div>
                                    <div className='xl:w-[18%] lg:w-[20%] w-[15%] ps-2'>{product.quantity}</div>
                                    <div className='xl:w-[18%] lg:w-[20%] lg:flex hidden'>
                                        {categories?.filter(category => category._id === product.category)[0]?.name}
                                    </div>
                                    <div className='w-[18%] hidden xl:flex'>
                                        <Link to={`/admin/PorductsEdit/${product._id}`} className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded me-2'>Edit</Link>
                                        <button className='bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded ms-2'
                                            id={`btn-${product._id}`}
                                            onClick={(event) => handleDelete(event, product._id, product.name)}>
                                            {isDeleting && deleteingElement === product._id ? <Spinner animation="border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner> : 'Delete'}
                                        </button>
                                    </div>
                                    <div className='relative w-[5%] xl:hidden menu-container'>
                                        {isDeleting && deleteingElement === product._id ? <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner> : <FontAwesomeIcon
                                            icon={faEllipsis}
                                            className='cursor-pointer p-2 bg-gray-800 text-white rounded-full hover:bg-gray-600 transition-colors duration-300'
                                            onClick={() => handleMenuClick(product._id)}
                                        />}
                                        {openMenuId === product._id && (
                                            <div id={`btn-${product._id}`} className='absolute right-10 -top-5 z-10 flex flex-col items-center'>
                                                <Link to={`/admin/PorductsEdit/${product._id}`} className='bg-blue-500 hover:bg-blue-700 text-white p-2 my-1 rounded  w-20'>Edit</Link>
                                                <button className='bg-red-500 hover:bg-red-700 text-white p-2 my-1 rounded  w-20' id={`btn-${product._id}`}
                                                    onClick={(event) => handleDelete(event, product._id, product.name)}>
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                )}
            </div>


            {/* pagination */}
            {isSuccess && (
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
            )}
        </div>
    )
}
