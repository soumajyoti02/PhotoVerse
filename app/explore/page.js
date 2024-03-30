"use client"
import React, { useEffect, useRef, useState, Suspense } from 'react'
import Navbar from '../components/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';

const Explore = () => {
    const access_key = "Z79VCnstJy-KX6RXnze1D1hphoCx5Y2brwCwbdEM-UA"

    const [image, setImage] = useState([]);
    const [search, setSearch] = useState("Northern Lakes");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('')
    const [isToken, setisToken] = useState(false)

    const [page, setPage] = useState(1)

    const router = useRouter()
    const searchParams = useSearchParams()


    useEffect(() => {
        if (searchParams.get('search')) {
            setSearch(searchParams.get('search'));
            console.log(`SearchParam: ${search}`);

        }
        console.log(`Search text from Main: ${search}`);
        setPage(1)
        const token = localStorage.getItem("sessionToken")
        const userEmail = localStorage.getItem("userEmail")
        if (token) {
            setisToken(true)
            setEmail(userEmail)
        }
        fetchData()
    }, [])

    useEffect(() => {
        console.log(`Search text from useeffect: ${search}`);
        fetchData();
    }, [search])

    useEffect(() => {
        console.log(search);

        fetchData();
    }, [page])

    const fetchData = async () => {

        const response = await fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${search}&client_id=${access_key}`);

        setLoading(true)
        const data = await response.json();
        setLoading(false)
        console.log(data.results[0]);
        console.log(data.results);
        setImage(data.results);
    }

    const handlePagination = async (e) => {

        const buttonName = e.target.name;
        if (buttonName === 'inc') {
            setPage(page + 1);
            console.log(`this is ${page}`);

        } else {
            if (page > 1) {
                console.log(`this is ${page}`);
                setPage(page - 1);
            }
        }
        await fetchData();
    };





    const handleLike = async (url, id) => {
        console.log(isToken);
        console.log(email);
        console.log(id);

        if (isToken) {
            const data = await fetch('api/popular', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, email })
            })

            const res = await data.json()
            console.log(`${res.image ? res.image.likes : ''}`)

            if (res.message === 'success') {
                toast.success('Liked!', {
                    position: "bottom-left",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
            else {
                toast.error(res.message, {
                    position: "bottom-left",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }

        }
        else {
            toast.error('Please Login first', {
                position: "bottom-left",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setTimeout(() => {
                router.push("/")
            }, 2000);
        }

    }
    return (
        <>
            <Navbar search={search} setSearch={setSearch} isToken={isToken} setisToken={setisToken} />
            <p className='text-xl md:text-3xl font-extrabold text-center my-10'>Showing Images: {search}</p>
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


            <div className="min-h-screen grid grid-flow-dense grid-cols-1 md:grid-cols-4 gap-2 w-11/12 m-auto">
                {
                    image.map((item, index) => {
                        return (<div key={item.id} className="flex flex-wrap items-center relative rounded-3xl">

                            <div className="relative rounded-3xl">
                                <Image
                                    width={400} height={400}
                                    src={item.urls.regular} alt={item.alt_description}
                                    className="opacity-100 h-auto max-w-full rounded-3xl cursor-pointer"
                                />

                                <div className="absolute inset-0 flex items-end cursor-pointer ">
                                    <div className="flex justify-between items-center h-16 w-full px-5 backdrop-blur-sm rounded-3xl">
                                        <div className="flex">
                                            <button onClick={() => { handleLike(item.urls.regular, item.id) }} type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex ">Like
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

            <div className="flex w-9/12  md:w-1/4 justify-between m-auto mt-10">
                <button disabled={page == 1} name='dec' onClick={handlePagination} className="flex items-center justify-center px-4 h-10 me-3 text-base font-medium text-gray-300 bg-gray-600 border border-gray-300 rounded-lg hover:bg-gray-700 hover:text-gray-100  disabled:bg-slate-400 disabled:text-gray-300">
                    <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                    </svg>
                    Previous
                </button>
                <button name='inc' onClick={handlePagination} className="flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    Next
                    <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </button>
            </div>
        </>
    )
}


{/* <div key={item.id} className="flex items-center">
    <div>
        <Image onClick={() => { handleLike(item.urls.regular) }} width={400} height={400} className="h-auto max-w-full rounded-lg cursor-pointer" src={item.urls.regular} alt={item.alt_description} />
    </div>
</div> */}


{/* <div key={item.id} className="flex flex-wrap items-center relative rounded-3xl">
    <div className="absolute inset-0 opacity-50"></div>

    <div className="relative bg-gray-600 rounded-3xl">
        <Image
            onClick={() => { handleLike(item.urls.regular) }} width={400} height={400}
            src={item.urls.regular} alt={item.alt_description}
            className="opacity-40 h-auto max-w-full rounded-3xl cursor-pointer"
        />

        <div className="absolute inset-0 flex justify-center items-end md:mb-10 mb-3 ">

        </div>
    </div>
</div> */}

export default Explore
