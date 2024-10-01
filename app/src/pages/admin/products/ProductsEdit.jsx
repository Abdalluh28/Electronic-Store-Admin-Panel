import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { useGetSingleProductQuery, useUpdateProductMutation } from '../../../redux/features/products/productsApiSlice';
import ProductImages from './ProductImages';
import { Dropdown, Spinner } from 'react-bootstrap';
import { useGetCategoriesQuery, useGetCategoryQuery } from '../../../redux/features/categories/categoriesApiSlice';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export default function ProductsEdit() {

    const accessToken = Cookies.get('accessToken') ? Cookies.get('accessToken') : null;
    const { id } = useParams();
    const { data: product, isLoading, refetch } = useGetSingleProductQuery({ id });
    const [updateProduct, { isLoading: updateLoading }] = useUpdateProductMutation();
    const { data: categories } = useGetCategoriesQuery();

    const [inputProduct, setInputProduct] = useState({
        name: '',
        price: '',
        quantity: '',
        category: '',
        brand: '',
        description: '',
    });

    const [images, setImages] = useState([]);
    const { data: category, refetch: refetchCategory } = useGetCategoryQuery({ productId: id });

    useEffect(() => {
        const fetchImages = async () => {
            if (product && product.product.images) {
                const imageUrls = product.product.images.map(image =>
                {
                    console.log(`${process.env.REACT_APP_API_URL}${image}`);
                    if (image.includes('cloudinary')) {
                        return image
                    }
                    return `${process.env.REACT_APP_API_URL}${image}`
                }
                );
                setImages(imageUrls);
            }
        };

        fetchImages();

        console.log(id);
    }, [product]);


    const handleDeleteImageParent = (images) => {
        setImages(images);
        refetch();
    };

    const handleCategory = (id, name) => {
        setInputProduct({ ...inputProduct, category: id });
        document.querySelector('#dropdown-basic').innerHTML = name
    }


    const handleUpdateProduct = async () => {
        const formData = new FormData();
        for (const [key, value] of Object.entries(inputProduct)) {
            formData.append(key, value);
        }

        const { data, error: err } = await updateProduct({ id, formData, accessToken });

        if (err && err.status === 401) {
            toast.error('Category not found', {
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

        if (err) {
            toast.error(err.data.message, {
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

        console.log(data)
        refetch();
        refetchCategory({ id: data.updatedProduct.category });
        setInputProduct({
            name: '',
            price: '',
            quantity: '',
            category: '',
            brand: '',
            description: '',
        })

        if (data.category) {
            refetchCategory({ id });
        }

        toast.success('Product updated successfully', {
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


    return (
        <>
            <h1 className='text-2xl mb-3'>Products Edit</h1>
            {isLoading && (
                <Spinner animation="border"  />
            )}
            {!isLoading && (
                <div>
                    <div className='flex justify-around lg:flex-row flex-col-reverse'>
                        <div className='lg:w-1/2 w-full lg:mt-0 mt-4'>
                            <div className='flex flex-col sm:flex-row flex-wrap '>
                                {['name', 'price', 'quantity', 'brand'].map((item) => (
                                    <>
                                        <div className='sm:w-1/2 w-full flex flex-col mb-3 sm:items-start items-center'>
                                            <label htmlFor={item} className="form-label w-3/4">{item}</label>
                                            <input type={item == "price" || item == "quantity" ? "number" : "text"} placeholder={product?.[item]} className='bg-black border border-gray-300 text-white text-sm rounded-lg  w-3/4'
                                                id={item} onChange={(e) => setInputProduct({ ...inputProduct, [item]: e.target.value })} />
                                        </div>
                                    </>
                                ))}

                                {/* category */}

                                <div className='flex flex-col mb-3 w-full sm:mt-0 mt-3 justify-end sm:items-start items-center'>
                                    <label className='form-label w-3/4'>Category</label>
                                    <Dropdown className="w-3/4">
                                        <Dropdown.Toggle variant="dark" id="dropdown-basic" className="bg-black border border-gray-300 text-white rounded-lg w-full h-12 flex justify-between items-center text-lg" >
                                            {category ? category.name : "Select Category"}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            {categories && categories.map((category, index) => (
                                                <Dropdown.Item key={index} onClick={() => handleCategory(category._id, category.name)}>{category.name}</Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                                {/* description */}
                                <div className='flex flex-col mb-3 w-full sm:items-start items-center'>
                                    <label htmlFor="description" className="form-label w-3/4 ">Description</label>
                                    <textarea type="text" placeholder={product?.description} className='bg-black border border-gray-300 text-white text-sm rounded-lg w-3/4'
                                        id='description' rows={5} onChange={(e) => setInputProduct({ ...inputProduct, description: e.target.value })} />
                                </div>
                            </div>

                            <div className='flex lg:justify-start justify-center mt-3'>
                                <button className='bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-1/2'
                                    onClick={handleUpdateProduct}>
                                    {updateLoading ? <div className='text-center'>
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </div> : 'Update'}
                                </button>
                            </div>
                        </div>
                        <div className='lg:w-1/2 w-full md:mt-0 mt-4'>
                            <ProductImages images={images} id={id} handleDeleteImageParent={handleDeleteImageParent} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
