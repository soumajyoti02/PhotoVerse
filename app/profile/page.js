"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';

const Profile = () => {
    const [email, setEmail] = useState('')
    const [isToken, setisToken] = useState(false)
    const [username, setusername] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [currentpassword, setcurrentPassword] = useState('')

    const fetchName = async (userEmail) => {
        const data = await fetch(`/api/getName`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail })
        })
        const res = await data.json()
        setusername(res.user.name)
        console.log(res.user.name);
    }

    const handleName = async () => {
        if (name.length === 0) {
            toast.error('Please Enter Valid Name', {
                position: "bottom-left",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return
        }
        const data = await fetch(`/api/updateName`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name })
        })
        const res = await data.json()
        if (res.message === "success") {
            console.log(`Successfully Renamed ${res.user.name}`);
            toast.success('Name Succesfully Updated!', {
                position: "bottom-left",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            await fetchName(res.user.email)
            setName('')
        }
    }

    const handlePassword = async () => {
        if (password.length === 0 || currentpassword.length === 0) {
            toast.error('Please Enter Valid Password', {
                position: "bottom-left",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return
        }
        const data = await fetch(`/api/updatePassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, currentpassword })
        })
        const res = await data.json()
        if (res.message === "success") {
            console.log(`Successfully Updated Password`);
            toast.success('Succesfully Updated!', {
                position: "bottom-left",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setPassword('')
            setcurrentPassword('')

        }

        else {
            toast.error('Incorrect Password!', {
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

    useEffect(() => {
        const token = localStorage.getItem("sessionToken")
        const userEmail = localStorage.getItem("userEmail")
        if (token) {
            setisToken(true)
            setEmail(userEmail)
        }
        fetchName(userEmail)
    }, [])

    return (
        <>
            <Navbar isToken={isToken} setisToken={setisToken} />
            <div className="min-h-[75vh]">
                <div className="flex justify-center items-center h-28">
                    <p className="text-lg md:text-3xl font-bold w-fit h-fit bg-slate-300 py-3 px-6 shadow-lg md:shadow-xl hover:shadow-2xl transition-shadow rounded-3xl select-none">My Profile</p>
                </div>
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

                {/* Update name side */}
                <div className="flex flex-col md:flex-row md:justify-around items-center w-11/12 h-full m-auto md:mt-20">
                    <div className="nameChanger h-fit w-full md:w-[35%] bg-slate-300 flex flex-col justify-center items-center rounded-3xl p-4 shadow-lg hover:shadow-2xl transition-shadow shadow-slate-300">
                        <p className='text-center font-semibold text-xl mt-3 mb-6'>Update Name</p>
                        <div className="flex flex-col w-11/12">
                            <label htmlFor="name" className='text-sm mb-1 ml-1 font-light'>Current Name</label>
                            <input type="text" name="name" id="name" placeholder='Enter Your Name' className='px-3 py-2 rounded-lg outline-none' value={username} disabled />
                        </div>
                        <div className="flex flex-col mt-6 w-11/12">
                            <label htmlFor="newname" className='text-sm mb-1 ml-1 font-light'>New Name</label>
                            <input value={name} onChange={(e) => { setName(e.target.value) }} type="text" name="newname" id="newname" placeholder='Enter New Name' className='px-3 py-2 rounded-lg outline-none' />
                        </div>
                        <button onClick={handleName} className="px-3 py-2 bg-yellow-300 hover:bg-yellow-400 transition-colors rounded-2xl mt-5 font-semibold">Update Name</button>
                    </div>

                    {/* Update Password Side */}
                    <div className="nameChanger h-fit w-full md:w-[35%] bg-slate-300 flex flex-col justify-center items-center rounded-3xl p-4 shadow-lg hover:shadow-2xl transition-shadow shadow-slate-300 mt-10 md:mt-0">
                        <p className='text-center font-semibold text-xl mt-3 mb-6'>Update Password</p>

                        <div className="flex flex-col w-11/12">
                            <label htmlFor="name" className='text-sm mb-1 ml-1 font-light'>Current Password</label>
                            <input value={currentpassword} onChange={(e) => { setcurrentPassword(e.target.value) }} type="text" name="name" id="name" placeholder='Enter Your Name' className='px-3 py-2 rounded-lg outline-none' />
                        </div>
                        <div className="flex flex-col mt-6 w-11/12">
                            <label htmlFor="newname" className='text-sm mb-1 ml-1 font-light'>New Password</label>
                            <input value={password} onChange={(e) => { setPassword(e.target.value) }} type="text" name="newname" id="newname" placeholder='Enter New Name' className='px-3 py-2 rounded-lg outline-none' />
                        </div>

                        <button onClick={handlePassword} className="px-3 py-2 bg-yellow-300 hover:bg-yellow-400 transition-colors rounded-2xl mt-5 font-semibold">Update Password</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
