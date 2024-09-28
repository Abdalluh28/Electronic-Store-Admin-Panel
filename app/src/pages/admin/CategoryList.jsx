import React, { useState } from 'react'
import { useAddCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery, useUpdateCategoryMutation } from '../../redux/features/categories/categoriesApiSlice'
import { Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

export default function CategoryList() {


    const accessToken = Cookies.get('accessToken') ? Cookies.get('accessToken') : null
    const { data: categories, isLoading: isCategoriesLoading, refetch } = useGetCategoriesQuery();
    const [addCategory, { isLoading: isAddCategoryLoading }] = useAddCategoryMutation();
    const [updateCategory, { isLoading: isUpdateCategoryLoading }] = useUpdateCategoryMutation();
    const [deleteCategory, { isLoading: isDeleteCategoryLoading }] = useDeleteCategoryMutation();

    const [loadingId, setLoadingId] = useState(null);


    const handleAddCategory = async () => {
        const value = document.querySelector('.addInput').value;

        if (!value) {
            toast.error('Please provide a category name', {
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


        const regOne = /[a-zA-Z]{2,}/;

        if (!regOne.test(value)) {
            toast.error('Please enter a valid category name', {
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


        const { data, error: err } = await addCategory({ name: value, accessToken });

        if (data) {
            toast.success('Category updated successfully', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            refetch();
            return
        } else if (err.status === 400) {
            toast.error('Category already exists', {
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

    }

    const handleCategory = async (id, name) => {

        Swal.fire({
            title: 'Edit Category',
            input: 'text',
            inputPlaceholder: name,
            background: '#000',
            color: '#fff',
            showCancelButton: true,
            confirmButtonText: 'Update',
            showLoaderOnConfirm: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: 'Delete',
            customClass: {
                confirmButton: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-5',
                cancelButton: 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ',
                input: 'updatedInput placeholder-indigo-400 placeholder-opacity-50 '
            },
            inputAttributes: {
                style: 'background-color: black; color: white; border: 1px solid gray; padding: 10px; border-radius: 10px;'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                handleUpdate(result.value, id);
            } else if (result.isDismissed && result.dismiss === 'cancel') {
                confirmDelete(id, name);
            }
        })
    }

    const confirmDelete = async (id, name) => {
        Swal.fire({
            title: `Are you sure you want to delete ${name}?`,
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

        const { data, error: err } = await deleteCategory({ id, accessToken });

        if (data) {
            toast.success('Category deleted successfully', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            refetch();
            return
        } else if (err.status === 400) {
            toast.error('Category not found', {
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
        } else if (err.status === 401) {
            toast.error('Category has products', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })
        }

    }

    const handleUpdate = async (value, id) => {

        setLoadingId(id);

        if (value) {
            const regOne = /[a-zA-Z]{2,}/;
            if (!regOne.test(value)) {
                toast.error('Please enter a valid category name', {
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


            if (isUpdateCategoryLoading) {
                alert('Loading...');
            }

            const { data } = await updateCategory({ id, name: value, accessToken });

            if (data) {
                toast.success('Category updated successfully', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                refetch();
                return
            } else {
                toast.error('Category already exists', {
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


        } else {
            toast.error('Please enter a category name', {
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
    }

    return (
        <>

            <h1 className='text-3xl '>Category List</h1>
            <div className='ms-7'>
                <div className='mt-10'>
                    <input type="text" placeholder='Write Category Name'
                        className='addInput xl:w-[25%] w-[50%]  bg-black border border-gray-300 text-white text-sm rounded-lg' />
                    <button className='ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                        onClick={() => handleAddCategory()}>
                        {isAddCategoryLoading ?
                            <div>
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>
                            : <div>Add</div>}
                    </button>
                </div>
                <hr className='mt-5 text-red-500 w-[75%]' />
                <div>
                    {isCategoriesLoading ? <div>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div> :

                        <div className='flex gap-5 flex-wrap mt-5'>
                            {
                                categories.map((category) => (
                                    <div key={category._id} className='mt-2'>
                                        <div className='flex justify-between btn btn-danger' id={`a${category._id}`}
                                            onClick={() => handleCategory(category._id, category.name)}>
                                            {(isUpdateCategoryLoading || isDeleteCategoryLoading) && loadingId === category._id ?
                                                <Spinner animation="border" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </Spinner> : <p className='text-lg'>{category.name}</p>
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                    }
                </div>
            </div>

        </>
    )
}
