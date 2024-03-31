"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';
import Link from 'next/link';

const Mylikes = () => {
    const [isToken, setisToken] = useState(false)
    const [imageList, setimageList] = useState([]) // To store the liked images
    const [search, setSearch] = useState('')

    const router = useRouter()

    // To fetch the liked images of that user
    const fetchData = async (email) => {
        const data = await fetch('/api/userLikes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        })
        const res = await data.json()
        console.log(res.userImages[0]);

        setimageList(res.userImages) // Storing all Liked images of that user into imageList State
    }

    useEffect(() => {
        const fetchDataAndSetUser = async () => {
            const token = localStorage.getItem("sessionToken");
            const userEmail = localStorage.getItem("userEmail");
            if (token) {
                setisToken(true); // To pass into Navbar. It will Customise Navbar for loggedin users
                await fetchData(userEmail);
            }
        };
        fetchDataAndSetUser();
    }, []);

    // To remove that image from My like if user Clicks on "Remove" button
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
            await fetchData(userEmail) // Rerendering My Likes section to show the change
        }
    }

    /*
    Getting the DownloadLink from the LikedImage Model. 
    When saving an image to LikedImage model within the /explore route's handleLike function, 
    I append {downloadLink: item.links.download + '&force=true'} 

    So, in every other route, I only need to use item.downloadLink. 
    However, within /explore, I must include {item.links.download + '&force=true'}  to download an image
    because I'm directly using the download link from the image, 
    not from my LikedImage model in the database.
    */

    const handleDownload = (url) => {
        router.push(url)
    }

    return (
        <>
            <Navbar setSearch={setSearch} isToken={isToken} setisToken={setisToken} />
            <div className="min-h-screen ">
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

                {/* Fetching the images from the imageList array */}
                <div className="ctr  w-11/12 ">
                    {
                        imageList.map((item, index) => {
                            return (<div key={item._id} className="box  relative rounded-3xl">
                                <div className="imageBox relative rounded-3xl">
                                    <Image
                                        width={400} height={400}
                                        src={item.url} alt={'item'}
                                        className="opacity-100 h-auto max-w-full rounded-3xl cursor-pointer"
                                    />

                                    <div className="absolute inset-0 flex items-end cursor-pointer w-full m-auto">
                                        <div className="flex justify-between items-end h-full w-full px-3 md:px-6 ">
                                            <div className="flex h-full items-end md:pb-2.5 ">
                                                <button onClick={() => { handleRemove(item.url) }} type="button" className="text-white  md:px-5 md:py-2 text-center  mb-5 md:mb-0 ml-2 flex rounded-lg backdrop-blur-md  justify-center">
                                                    <Image height={35} width={35} src='/delete.png' alt="" className='h-[35px]' />
                                                </button>
                                            </div>

                                            <div className="flex h-full items-start md:items-end">
                                                <button onClick={() => handleDownload(item.downloadLink)} type="button" className=" text-white mt-3 md:px-5 md:py-2.5 text-center mb-2 flex rounded-lg backdrop-blur-md  justify-center">
                                                    <Image height={35} width={35} src='/d1.png' alt="" className='h-[35px]  ' />
                                                </button>
                                            </div>
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
