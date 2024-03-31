"use client"

import Image from "next/image";
import Footer from "./components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { useRouter } from 'next/navigation'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';




export default function Home() {
	const [islogin, setisLogin] = useState(false)
	const [issignup, setisSignup] = useState(true)
	const [isToken, setisToken] = useState(false)
	const [search, setSearch] = useState('')
	const [loginButtonDisplay, setLoginButtonDisplay] = useState(true)
	const router = useRouter()

	const [error, setError] = useState(false)
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')


	useEffect(() => {
		const token = localStorage.getItem("sessionToken")
		if (token) {
			setisToken(true)
		}
	}, [])


	const handleSubmit = async (e) => {
		e.preventDefault()

		setName('')
		setEmail('')
		setPassword('')

		if (!name || !email || !password) {
			setError("All fields are necessery.")
			return;
		}
		try {
			const resUserExists = await fetch("api/userExists", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email })
			})

			const { user } = await resUserExists.json()
			if (user) {
				setError("User Already Exists")
				return;
			}

			const res = await fetch('api/register', {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password })
			})

			if (res.ok) {
				setisSignup(false);
				setisLogin(true);
				toast.success('Registered Successfully', {
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
				toast.error('Invalid Credentials', {
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
		} catch (error) {
			console.log("Error During Registration: ", error)
		}
	}

	const handleLogin = async (e) => {
		e.preventDefault()
		setLoginButtonDisplay(false)
		if (!email || !password) {
			setError("All fields are necessery.")
			return;
		}

		try {
			const data = await fetch("api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password })
			})
			const res = await data.json()

			if (res.message === 'success') {
				localStorage.setItem('sessionToken', res.token);
				localStorage.setItem('userEmail', email);

				toast.success('Successfully Logged in', {
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
					router.push("/explore")
				}, 2000);
			}
			else {
				setEmail('')
				setPassword('')
				toast.error('Invalid Credentials', {
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
		} catch (error) {
			console.log("Error During Registration: ", error)
		}
	}

	return (
		<>
			<Navbar setSearch={setSearch} islogin={islogin} setisLogin={setisLogin} issignup={issignup} setisSignup={setisSignup} isToken={isToken} setisToken={setisToken} />
			<div className='min-h-screen w-screen  '>
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
				<img src="/back.jpg" alt="" className="absolute top-0 left-0 h-full w-full object-cover opacity-30 bg-repeat -z-50" />
				<div className="min-h-[89vh] w-screen  bg-transparent flex ">
					<div className="w-11/12 h-full m-auto md:flex flex-wrap justify-between items-center">
						<div className="left text-center md:text-left mt-16 md:w-[40%] md:ml-16">
							<h1 className="text-4xl font-bold text-black">Welcome to PhotoVerse</h1>
							<p className="text-xl font-base text-black mt-5">
								Whether you are searching for inspiration, looking to brighten your day, or simply seeking the perfect image, we have got you covered.
							</p>
							<Link href={'/explore'}>
								<button type="button" className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl mt-6 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Explore <span className="text-xl mb-2">&rarr;</span></button>
							</Link>

							<div className="newsletter w-full px-4 md:px-0 mt-6 md:mt-10">
								<h2 className="title-font font-medium text-gray-900 text-sm  text-left">Subscribe to our news letter</h2>
								<div className="flex xl:flex-nowrap md:flex-nowrap lg:flex-wrap flex-wrap items-center md:justify-start mt-2">
									<div className="relative w-72 md:w-96 sm:w-auto xl:mr-4 lg:mr-0 sm:mr-4 mr-2">
										<input type="text" id="footer-field" name="footer-field" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder="Enter Email Here" />
									</div>
									<button className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 ml-[5.5rem] mt-2 md:ml-0 md:mt-0">Subscribe</button>
								</div>
							</div>
						</div>

						{/* Sign Up card */}
						{issignup && !isToken && <form className="signup md:w-[30%] md:mr-20  shadow-slate-300 hover:shadow-slate-400 transition-shadow shadow-xl rounded-3xl">
							<div className=" bg-[#c2ddf3] rounded-3xl p-8 flex flex-col w-full mt-10 md:mt-0">
								<h2 className="text-gray-900 text-2xl font-semibold text-center title-font mb-5">Sign up</h2>


								<div className="relative mb-4">
									<label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
									<input value={name} onChange={(e) => setName(e.target.value)} type="name" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder="Enter your name" />
								</div>
								<div className="relative mb-4">
									<label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
									<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder="Enter Email" />
								</div>
								<div className="relative mb-4">
									<label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
									<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder="Enter Password" />
								</div>

								<p className="text-xs font-bold text-red-700 mb-1">{error}</p>
								<button type="submit" onClick={handleSubmit} className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Register</button>


								<p className="text-xs text-gray-500 mt-3">Already have account? <span onClick={() => { setisSignup(!issignup); setisLogin(!islogin) }} className="underline cursor-pointer">Sign in here</span></p>

							</div>
						</form>}

						{/* Login Card */}
						{islogin && !isToken && <form className="login md:w-[30%] md:mr-20  shadow-slate-300 hover:shadow-slate-400 transition-shadow shadow-xl rounded-3xl">
							<div className=" bg-[#c2ddf3] rounded-3xl p-8 flex flex-col w-full mt-10 md:mt-0">
								<h2 className="text-gray-900 text-2xl font-semibold text-center title-font mb-5">Login</h2>


								<div className="relative mb-4">
									<label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>

									<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder="Enter Email" />
								</div>
								<div className="relative mb-4">
									<label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>

									<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder="Enter Password" />
								</div>


								<button disabled={!loginButtonDisplay} type="submit" onClick={handleLogin} className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg disabled:bg-indigo-300 disabled:hover:bg-indigo-300">Login</button>
								<p className="text-xs text-gray-500 mt-3">Don&apos;t have account? <span onClick={() => { setisSignup(!issignup); setisLogin(!islogin) }} className="underline cursor-pointer">Sign Up here</span></p>
							</div>
						</form>}

						{isToken && <div className="flex justify-center items-center h-fit md:w-[40%] relative mt-10 md:mt-0 shadow-slate-600 shadow-xl hover:shadow-2xl transition-shadow rounded-3xl">
							{/* Overlay with opacity */}
							<div className="absolute inset-0  opacity-50"></div>

							{/* Image */}
							<div className="relative bg-gray-600 rounded-3xl">
								<Image
									height={600}
									width={600}
									src="/trending.jpg"
									alt="Trending Image"
									className="opacity-40 rounded-3xl"
								/>

								{/* Text in the middle */}
								<div className="absolute inset-0 flex justify-center items-end md:mb-10 mb-3 ">
									<Link href="/explore">
										<h1 class="mb-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-white from-yellow-400 md:text-xl lg:text-4xl"> See the most Tranding </h1>

										<button type="button" class="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 md:ml-24 ml-9">See Tranding Images &rarr;</button>
									</Link>
								</div>
							</div>
						</div>}

					</div>
				</div>
			</div>

		</>
	);
}
