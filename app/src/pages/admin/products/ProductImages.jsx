import React, { useEffect, useState } from 'react'
import { useDeleteImageMutation, useUploadImageMutation } from '../../../redux/features/products/uploadApiSlice';
import { toast } from 'react-toastify';
import { gsap } from 'gsap';
import Swal from 'sweetalert2';

export default function ProductImages(props) {

    const [images, setImages] = useState([]);
    const [imagesTwo, setImagesTwo] = useState([]);

    const [uploadImage] = useUploadImageMutation();
    const [deleteImage, { isLoading }] = useDeleteImageMutation();


    useEffect(() => {
        setImages(props.images)
        setImagesTwo(props.images)
    }, [props.images])



    const changeImage = (idx) => {

        gsap.to('.mainImage', {
            duration: 0.5,
            opacity: 0,
            onComplete: () => {
                const selectedImage = images[idx];


                const updatedImages = images.map((image, index) => {
                    if (index === 0) return selectedImage;
                    if (index === idx) return images[0];
                    return image;
                });

                setImages(updatedImages);

                gsap.to('.mainImage', {
                    duration: 0.5,
                    opacity: 1
                });
            }
        });

    }


    const handleUploadImage = async (e) => {

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('id', props.id);
        const mainImage = document.querySelector('.mainImage img');
        const index = imagesTwo.indexOf(mainImage.src);
        formData.append('index', index);
        try {
            const { data, error: err, isLoading: loading } = await uploadImage(formData);

            if (data) {
                const image = await fetch(`http://localhost:3000${data.image}`).then(res => res.blob()).then(blob => URL.createObjectURL(blob))
                if (image) {
                    setImages(prevImages => {
                        const updatedImages = [...prevImages];
                        updatedImages[index] = image; // Update the image at the correct index
                        return updatedImages;
                    });

                    props.handleDeleteImageParent(images)

                    toast.success('Image updated successfully', {
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



            } else {
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
            }

        } catch (error) {
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
        }

    }


    const handelDeleteImage = async (image) => {


        const index = imagesTwo.indexOf(image);


        Swal.fire({
            title: 'Are you sure?',
            text: "You will delete this image!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                confirmDelete(index)
            }
        })
    }


    const confirmDelete = async (index) => {
        try {

            const { data, error: err, isLoading: loading } = await deleteImage({ id: props.id, index });

            if (data) {

                setImages(prevImages => {
                    const updatedImages = [...prevImages];
                    updatedImages[0] = data; // Update the image at the correct index
                    return updatedImages;
                });

                props.handleDeleteImageParent(images)

                toast.success('Image deleted successfully', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });

            } else {
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
            }

        } catch (error) {
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
        }
    }


    return (
        <>
            <div className='w-full flex gap-10'>
                <div className='w-[60%] mainImage flex flex-col relative'>
                    <img src={images[0]} alt="" className='rounded-xl h-[90%]' />
                    <div className='flex mt-2 gap-3 justify-center'>
                        <div className='sm:w-1/3'>
                            <form encType='multipart/form-data'>
                                <input type='file' className='hidden' id='file' onChange={handleUploadImage} />
                            </form>
                            <label htmlFor='file' className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 sm:px-0 text-center cursor-pointer w-full rounded ms-2'>
                                Upload
                            </label>
                        </div>
                        <button className='bg-red-500 hover:bg-red-700 text-white py-1 sm:w-1/3 px-4 sm:px-0 rounded ms-2'
                            onClick={() => handelDeleteImage(images[0])}>Delete</button>
                    </div>
                </div>
                <div>
                    {images.slice(1).map((image, index) => (
                        <img
                            key={index + 1}
                            src={image}
                            alt=""
                            className='rounded-xl w-32 mb-4 cursor-pointer'
                            onClick={() => changeImage(index + 1)}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}
