"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Image from 'next/image'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';

const Mylikes = () => {
    const [isToken, setisToken] = useState(false)
    const [imageList, setimageList] = useState([])
    const [url, setUrl] = useState('')

    const fetchData = async (email) => {
        console.log(`email from fetchdata: ${email}`);
        const data = await fetch('/api/userLikes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        })
        const res = await data.json()
        console.log(res);
        setimageList(res.userImages)
    }

    useEffect(() => {
        const fetchDataAndSetUser = async () => {
            const token = localStorage.getItem("sessionToken");
            const userEmail = localStorage.getItem("userEmail");
            console.log(token, userEmail);

            if (token) {
                setisToken(true);
                await fetchData(userEmail);
            }
        };

        fetchDataAndSetUser();
    }, []);


    const handleRemove = async (url) => {
        const userEmail = localStorage.getItem("userEmail");

        const data = await fetch('/api/removeLike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail, url })
        })
        const res = await data.json()
        if (res.message === "success") {
            toast.success('Removed!', {
                position: "bottom-left",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            await fetchData(userEmail)
        }
    }

    return (
        <>
            <Navbar isToken={isToken} setisToken={setisToken} />
            <div className="min-h-screen">
                <p className="text-2xl md:text-3xl font-bold text-center my-10">My Favourites ({imageList.length} images)</p>
                <ToastContainer
                    position="bottom-left"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />

                <div className="h-fit grid grid-flow-dense grid-cols-1 md:grid-cols-4 gap-2 w-11/12 m-auto">
                    {
                        imageList.map((item, index) => {
                            return (<div key={item._id} className="flex flex-wrap items-center relative rounded-3xl">
                                <div className="relative rounded-3xl">
                                    <Image
                                        width={400} height={400}
                                        src={item.url} alt={'item'}
                                        className="opacity-100 h-auto max-w-full rounded-3xl cursor-pointer"
                                    />

                                    <div className="absolute inset-0 flex items-end mb- cursor-pointer w-full m-auto">
                                        <div className="flex justify-between items-center h-16 w-full px-5 backdrop-blur-sm rounded-3xl">
                                            <div className="flex">
                                                <button onClick={() => { handleRemove(item.url) }} type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex ">Like
                                                    <Image height={20} width={20} src='/like.png' alt="" className=' backdrop-blur-3xl rounded-full ml-4' />
                                                </button>

                                            </div>

                                            <button type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>)
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default Mylikes
