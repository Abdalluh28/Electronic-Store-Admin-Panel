import React, { useEffect, useState } from 'react'
import { useDeleteImageMutation, useUploadImageMutation } from '../../../redux/features/products/uploadApiSlice';
import { toast } from 'react-toastify';
import { gsap } from 'gsap';
import Swal from 'sweetalert2';
import { Spinner } from 'react-bootstrap';

export default function ProductImages(props) {

    const [images, setImages] = useState([]);
    const [imagesTwo, setImagesTwo] = useState([]);

    const [uploadImage] = useUploadImageMutation();
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)


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

            if (loading) {
                setIsLoadingUpdate(true)
            }


            if (data) {

                setIsLoadingUpdate(false)
                console.log(data)
                let image;
                if (data.image.includes('cloudinary')) {
                    image = data.image
                }else {
                    image = `${process.env.REACT_APP_API_URL}${data.image}`
                }
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
                                {isLoadingUpdate ? <Spinner animation="border" /> : 'Edit'}
                            </label>
                        </div>
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
