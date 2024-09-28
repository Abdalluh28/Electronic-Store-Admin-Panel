import { faCheck, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { useUpdateUserMutation } from '../../../redux/features/users/usersApiSlice';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';

export default function EditUserList(props) {
    

    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const [loadingNumber, setloadingNumber] = useState(0)
    const userInfo = JSON.parse(Cookies.get('userInfo'))
    const navigate = useNavigate();

    const showInput = (id, num) => {
        document.querySelectorAll(`.info.a${id}`)[num].classList.add('hidden');
        document.querySelectorAll(`.input.a${id}`)[num].classList.remove('hidden');
        document.querySelectorAll(`.input.a${id}`)[num].classList.add('flex');
    }


    const showInfo = async (id, num) => {

        const info = document.querySelectorAll(`.info.a${id}`)[num];
        const input = document.querySelectorAll(`.input.a${id} input`)[num];
        const userName = info.querySelector('.userName');
        const userEmail = info.querySelector('.userEmail');
        console.log(input.value, num === 0 ? 'firstName' : 'email')


        let updatedName = null
        let updatedEmail = null
        let lastName;
        if (num === 0) {
            updatedName = input.value.split(' ')[0]
            lastName = input.value.split(' ').slice(1).join(' ')
        } else {
            updatedEmail = input.value
        }

        const regOne = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/
        const regTwo = /[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,3}/
        console.log(regOne.test(updatedName))
        if (updatedName && !regOne.test(input.value)) {
            toast.error('Please enter a valid name', {
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

        if (updatedEmail && !regTwo.test(updatedEmail)) {
            toast.error('Please enter a valid email', {
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



        try {
            setloadingNumber(num === 0 ? 0 : 1)
            const { data, error:err } = await updateUser({
                id: props.user._id,
                [num === 0 ? 'firstName' : 'email']: num === 0 ? updatedName : updatedEmail,
                lastName
            })

            if(err && err.status ===  401) {
                toast.error('User already exist', {
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

            if(data){
                console.log(data)
            }


            if (userInfo.id === data.id) {
                Cookies.set('userInfo', JSON.stringify(data))
                if(num === 1) {
                    toast.success('Email updated successfully, Please login again', {
                        position: "top-right",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        onClose: () => navigate('/auth/login')
                    })
                    return
                }
                document.querySelector('.navigationUserName').innerHTML = data.firstName
            }


            toast.success('User updated successfully', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            if (num === 0) {
                userName.innerHTML = updatedName
            } else {
                userEmail.innerHTML = updatedEmail
            }

            props.refetch();

        } catch (error) {
            toast.error(error.message, {
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

        document.querySelectorAll(`.info.a${id}`)[num].classList.remove('hidden');
        document.querySelectorAll(`.input.a${id}`)[num].classList.add('hidden');


    }



    return (
        <>
            <div className='flex 2xl:w-[45%] lg:w-[80%] w-[80%] lg:flex-row flex-col'>
                <div className='2xl:w-[45%] lg:w-[50%] '>
                    <div className={`w-[100%] info flex a${props.user._id}`}>
                        <div className='lg:w-[50%] w-[60%] userName'>{props.user.firstName}</div>
                        <div className='w-[35%] flex sm:justify-start justify-end'>
                            <FontAwesomeIcon icon={faPenToSquare}
                                className='cursor-pointer p-2 self-end' onClick={() => { showInput(props.user._id, 0) }} />
                        </div>
                    </div>
                    <div className={`w-[100%] input hidden items-center a${props.user._id}`}>
                        <div className='lg:w-[50%] w-[60%]'>
                            <input type="text" defaultValue={props.user.firstName}
                                className='w-full bg-black border border-gray-300 text-white text-sm rounded-lg' />
                        </div>
                        <div className='w-[35%] '>
                            {isLoading && loadingNumber === 0 ?
                                <div className='w-[100%] flex sm:justify-start justify-end'>
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </div> :
                                <div className='w-[100%] flex sm:justify-start justify-end'>
                                    <FontAwesomeIcon icon={faCheck}
                                        className='cursor-pointer p-2'
                                        onClick={() => { showInfo(props.user._id, 0) }} />
                                </div>}

                        </div>
                    </div>
                </div>
                <div className='lg:w-[50%] '>
                    <div className={`w-[100%] info flex a${props.user._id}`}>
                        <div className='lg:w-[80%] w-[60%] userEmail'>{props.user.email}</div>
                        <div className='w-[35%] flex sm:justify-start justify-end'>
                            <FontAwesomeIcon icon={faPenToSquare}
                                className='cursor-pointer p-2 ' onClick={() => { showInput(props.user._id, 1) }} />
                        </div>
                    </div>
                    <div className={`w-[100%] input hidden items-center a${props.user._id}`}>
                        <div className='lg:w-[80%] w-[60%]'>
                            <input type="text" defaultValue={props.user.email}
                                className='w-full bg-black border border-gray-300 text-white text-sm rounded-lg' />
                        </div>
                        <div className='w-[35%]'>
                            {isLoading && loadingNumber === 1 ?
                                <div className='w-[100%] flex sm:justify-start justify-end'>
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </div> :
                                <div className='w-[100%] flex sm:justify-start justify-end'>
                                    <FontAwesomeIcon icon={faCheck}
                                        className='cursor-pointer p-2'
                                        onClick={() => { showInfo(props.user._id, 1) }} />
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
