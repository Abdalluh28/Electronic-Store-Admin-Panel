import React, { useEffect, useRef, useState } from "react";
import { useGetCategoriesQuery } from "../../../redux/features/categories/categoriesApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, Spinner } from "react-bootstrap";
import { useCreateProductMutation, useDeleteProductMutation } from "../../../redux/features/products/productsApiSlice";
import Cookie from "js-cookie";
import { useUploadImageMutation } from "../../../redux/features/products/uploadApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setProductFlag } from "../../../redux/slices/productSlice";

export default function AddProduct() {

    const [src, setSrc] = useState([])
    const [images, setImages] = useState([])
    const accessToken = Cookie.get('accessToken') || '';
    const { data: categories } = useGetCategoriesQuery();
    const [createProduct] = useCreateProductMutation();
    const [uploadImage] = useUploadImageMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const [isLoading, setIsLoading] = useState(false)

    const productFlag = useSelector(state => state.product.productFlag)
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [inputInfo, setInputInfo] = useState({
        name: "",
        price: "",
        quantity: "",
        brand: "",
        description: "",
        category: ""
    })

    useEffect(() => {
        if(categories) {
            setInputInfo(Prev => ({
                ...Prev,
                category: categories[0]._id
            }))
        }
    },[categories])



    const handleAddImage = (index, value) => {

        setImages(Prev => [...Prev, value])

        const reader = new FileReader();

        reader.onloadend = () => {
            const updatedSrc = [...src]
            updatedSrc[index] = reader.result;
            setSrc(updatedSrc)
        }

        if (value) {
            reader.readAsDataURL(value)
        }
    }

    const handleCategory = (id) => {
        setInputInfo(Prev => ({
            ...Prev,
            category: id
        }))
        document.querySelector('#dropdown-basic').innerHTML = categories.find(category => category._id === id).name
    }


    const handleAddProduct = async () => {

        setIsLoading(true)

        if (images.length < 3) {
            setIsLoading(false)
            toast.error('Please upload 3 images', {
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

        const formData = new FormData();
        formData.append('name', inputInfo.name);
        formData.append('price', inputInfo.price);
        formData.append('quantity', inputInfo.quantity);
        formData.append('brand', inputInfo.brand);
        formData.append('description', inputInfo.description);
        formData.append('category', inputInfo.category);
        console.log(formData)
        const { data, error } = await createProduct({ formData, accessToken })
        if (error && error.status === 401) {
            toast.error('Please provide all fields', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setIsLoading(false)
            return
        }
        let counter = 0
        if (data) {


            for (let i = 0; i < images.length; i++) {
                let formData2 = new FormData();
                formData2.append(`image`, images[i]);
                formData2.append('id', data.product._id);
                formData2.append('index', i);
                const { data: image } = await uploadImage(formData2)
                if (image) {
                    console.log(image)
                    counter++
                }
                console.log(data)
            }

            if (counter === images.length) {
                setIsLoading(false)
                toast.success('Product added successfully', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setImages([])
                setSrc([])

                dispatch(setProductFlag(!productFlag))
                navigate('/admin/productsList')
                return
            }

            setIsLoading(false)
            toast.error('Upload failed', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            await deleteProduct({ id: data.product._id, accessToken })

            return
        } else {
            setIsLoading(false)
            toast.error('Something went wrong', {
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
            <h1 className="text-2xl mb-3">Add Product</h1>
            <div className="flex flex-col">
                <div className="flex gap-4 sm:flex-row flex-col">
                    {/* upload Image */}

                    {['imageOne', 'imageTwo', 'imageThree'].map((image, index) => (
                        <div className="flex sm:w-1/3 w-full" key={image}>
                            <input type="file" className="file-input file-input-bordered hidden" id={image} onChange={(e) => handleAddImage(index, e.target.files[0])} />
                            {!src[index] && <label htmlFor={image} className='bg-black border border-gray-300 text-white rounded-lg w-full h-40 flex justify-center items-center'>
                                {src[index] ? src[index] : "Upload Image"}
                            </label>}
                            {src[index] && (
                                <div className="flex gap-2 sm:w-fit items-center w-full">
                                    <img src={src[index]} alt="img" className="w-3/4 h-52" />
                                    <FontAwesomeIcon
                                        icon={faTrashCan}
                                        className='bg-red-500 hover:bg-red-600 w-fit py-2 px-3 rounded-lg cursor-pointer'
                                        onClick={() => {
                                            setSrc(Prev => Prev.filter((_, i) => i !== index))
                                            setImages(Prev => Prev.filter((_, i) => i !== index))
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}


                </div>
                <div className="mt-4 flex flex-wrap sm:flex-row flex-col">
                    {/* form */}
                    {["name", "price", "quantity", "brand"].map(field => (
                        <div key={field} className='flex flex-col mb-3 sm:w-1/2 w-full items-center lg:items-start'>
                            <label htmlFor={field} className="form-label sm:w-3/4 w-full self-center lg:self-start">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input type={field == "price" || field == "quantity" ? "number" : "text"} className='bg-black border border-gray-300 text-white text-sm rounded-lg h-12 sm:w-3/4 w-full' id={field}
                                onChange={(e) => setInputInfo(Prev => ({ ...Prev, [field]: e.target.value }))} />
                        </div>
                    ))}
                    <div className='flex flex-col mb-3 sm:w-3/4 w-full items-center lg:items-start'>
                        <label htmlFor="description" className="form-label sm:w-3/4 w-full self-center lg:self-start">Description</label>
                        <textarea className='bg-black border border-gray-300 text-white text-sm rounded-lg sm:w-3/4 w-full' id='description' rows={5}
                            onChange={(e) => setInputInfo(Prev => ({ ...Prev, description: e.target.value }))} />
                    </div>
                    {/* category */}
                    <div className='flex flex-col mb-3 sm:w-1/2 w-full sm:mt-0 mt-3 items-center lg:items-start justify-end'>
                        <Dropdown className="sm:w-3/4 w-full">
                            <Dropdown.Toggle variant="dark" id="dropdown-basic" className="bg-black border border-gray-300 text-white rounded-lg w-full h-12 flex justify-between items-center text-lg" >
                                {categories ? categories[0].name : "Select Category"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {categories && categories.map((category, index) => (
                                    <Dropdown.Item key={index} onClick={() => handleCategory(category._id)}>{category.name}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                    </div>



                    <button className="z-10 btn btn-primary w-fit px-5 py-2 self-center mt-5 text-xl"
                        onClick={handleAddProduct}>
                        {isLoading ? <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner> : "Add Product"}
                    </button>

                </div>
            </div>
        </>
    )
}