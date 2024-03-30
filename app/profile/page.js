"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

const Profile = () => {
    const [email, setEmail] = useState('')
    const [isToken, setisToken] = useState(false)
    const [search, setSearch] = useState("Northern Lakes");

    useEffect(() => {
        const token = localStorage.getItem("sessionToken")
        const userEmail = localStorage.getItem("userEmail")
        if (token) {
            setisToken(true)
            setEmail(userEmail)
        }
    }, [])

    return (
        <>
            <Navbar search={search} setSearch={setSearch} isToken={isToken} setisToken={setisToken} />
            <div className="min-h-screen">

            </div>
        </>
    )
}

export default Profile
