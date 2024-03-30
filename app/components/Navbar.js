"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const Navbar = ({ islogin, issignup, setisLogin, setisSignup, isToken, setisToken, search, setSearch }) => {
    const [menu, setMenu] = useState(false)
    const [searchText, setsearchText] = useState('')

    const handleLogout = () => {
        // Remove session token from local storage
        localStorage.removeItem('sessionToken');
        localStorage.removeItem("userEmail")
        setisToken(false)
    }

    const handleSearch = () => {
        // Only for explore route
        setSearch(searchText)
    }


    return (
        <>
            <nav className="sticky top-0 left-0 w-screen py-1 border-b border-b-white md:border-none rounded-b-3xl shadow-slate-300 shadow-md transition-all duration-300 backdrop-blur-3xl z-50">
                <div className='h-16 md:h-[4.5rem] w-11/12 m-auto pt-5 pb-3  flex justify-between items-center md:pb-6 sticky top-0'>
                    <Link href={'/'} className="text-2xl font-bold text-black md:flex items-center">PhotoVerse</Link>

                    <div className="flex space-x-5">

                        {isToken && <Link href={'/profile'} className="relative inline-flex items-center justify-center p-0.5   overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 ">
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-[#e7ecef] rounded-md group-hover:bg-opacity-0">
                                Profile
                            </span>
                        </Link>}

                        <div className='h-8 md:hidden flex'>
                            <img onClick={() => { setMenu(!menu) }} src="/hamburger.svg" alt="" className='h-full mt-1' />
                        </div>
                    </div>

                    {/* Desktop menu */}
                    <ul className={`md:flex hidden w-[80%] justify-between items-center " `}>
                        <li className='search flex bg-gray-300 w-[35rem] m-auto rounded-3xl  '>
                            <input value={searchText} onChange={(e) => setsearchText(e.target.value)} type="search" name="search" id="search" placeholder='Type Category' className='py-1 px-5 w-[90%] rounded-l-3xl h-10 bg-gray-300 text-black placeholder:text-slate-500 outline-none' />

                            <Link href={{ pathname: '/explore', query: { search: searchText } }}>
                                <Image onClick={handleSearch} width={37} height={50} src="/search.png" alt="" className='h-9 cursor-pointer' />
                            </Link>
                        </li>
                        <div className="flex justify-center items-center space-x-8">
                            <Link href={'/explore'} className='text-black text-lg text-center font-bold '>Explore</Link>
                            <Link href={'/popular'} className='text-black text-lg text-center font-bold '>Popular</Link>
                            {isToken && <Link href={'/mylikes'} className='text-black text-lg text-center font-bold '>My Likes</Link>}
                            {!isToken && <Link href={'/'} onClick={() => { setisSignup(false); setisLogin(true) }} className='bg-yellow-400 w-28 rounded-3xl p-2 font-bold text-center m-auto hover:bg-yellow-500 cursor-pointer'>
                                Login
                            </Link>}
                            {isToken && <Link href={'/'} onClick={handleLogout} className='bg-yellow-400 w-28 rounded-3xl p-2 font-bold text-center m-auto hover:bg-yellow-500 cursor-pointer'>
                                Logout
                            </Link>}
                        </div>
                    </ul>
                </div>

                {/* Hamburger menu */}
                {menu && <ul className={`mb-3 `}>
                    <li className='search flex  bg-gray-300 w-10/12 m-auto rounded-3xl mt-5'>
                        <input value={searchText} onChange={(e) => setsearchText(e.target.value)} type="search" name="search" id="search" placeholder='Type Category' className='py-1 px-5 w-[85%] rounded-l-3xl h-10 bg-gray-300 text-black placeholder:text-black outline-none' />
                        <Link href={{ pathname: '/explore', query: { search: searchText } }}>
                            <Image onClick={handleSearch} width={37} height={50} src="/search.png" alt="" className='h-9 ' />
                        </Link>
                    </li>
                    <li className='flex h-14 justify-center items-center border-b border-slate-300'>
                        <Link href={'/explore'} className='text-black text-lg text-center  font-bold '>Explore</Link>
                    </li>
                    <li className='flex h-14 justify-center items-center border-b border-slate-300'>
                        <Link href={'/popular'} className='text-black text-lg text-center  font-bold '>Popular Images</Link>
                    </li>
                    {isToken && <li className='flex h-14 justify-center items-center'>
                        <Link href={'/mylikes'} className='text-black text-lg text-center  font-bold '>My Likes</Link>
                    </li>}
                    <li className="flex h-14 justify-center">
                        {!isToken && <Link href={'/'} onClick={() => { setisSignup(false); setisLogin(true); setsearchText(''); setMenu(!menu) }} className='bg-yellow-400 w-28 rounded-3xl p-2 font-bold text-center m-auto mt-5 cursor-pointer select-none'>Login</Link>}
                        {isToken && <Link href={'/'} onClick={handleLogout} className='bg-yellow-400 w-28 rounded-3xl p-2 font-bold text-center m-auto  cursor-pointer select-none'>Logout</Link>}
                    </li>
                </ul>}
            </nav>
        </>
    )
}

export default Navbar
