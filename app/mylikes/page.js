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
	const [hovered, setHovered] = useState(false);

	const handleClick = () => {
		setHovered(!hovered);
		console.log(hovered);

	};

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

		setimageList(res.userImages.reverse()) // Storing all Liked images of that user into imageList State. Newest will be first
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
			<div className="min-h-screen relative">
				<div className="flex justify-center items-center h-28">
					<p className="text-2xl md:text-3xl font-bold w-fit h-fit bg-slate-300 py-3 px-6 shadow-lg rounded-3xl">My Likes ({imageList.length} images)</p>
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

				{/* Fetching the images from the imageList array */}
				<div className="ctr  w-11/12 ">
					{
						imageList.map((item, index) => {
							return (<div key={item._id} onClick={handleClick} className="box relative rounded-3xl bg-gray-800">
								<div className={` ${hovered ? 'imageBox' : ''} imageHoverDesktop transition-opacity duration-300 relative rounded-3xl  max-w-full`}>
									<Image
										width={400} height={400}
										src={item.url} alt={'item'}
										className={`imageitem h-auto max-w-full rounded-3xl  `}
									/>

									<div className={`hoverbutton absolute inset-0  `}>
										<div className="flex justify-between items-center h-16 md:w-[60%] w-[48%] mx-auto rounded-3xl mt-10 ">
											<div className="flex h-full items-end md:pb-2.5 ">
												<button onClick={() => { handleRemove(item.url) }} type="button" className="text-white  md:px-5 md:py-2 text-center  mb-5 md:mb-0 ml-2 flex rounded-lg backdrop-blur-sm  justify-center">
													<Image height={47} width={47} src='/delete.png' alt="" className='' />
												</button>
											</div>

											<div className="flex h-full items-start md:items-end">
												<button onClick={() => handleDownload(item.downloadLink)} type="button" className=" text-white mt- md:px-5 md:py-1.5 text-center mb-2 flex rounded-lg backdrop-blur-sm  justify-center">
													<Image height={47} width={47} src='/download.png' alt="" className='  ' />
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>)
						})
					}

					{/* Delete Confirmation */}

					{/* <div id="popup-modal" tabindex="-1" class=" overflow-y-auto overflow-x-hidden fixed top-40 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
						<div class="relative p-4 w-full max-w-md max-h-full">
							<div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
								<button type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
									<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
										<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
									</svg>
									<span class="sr-only">Close modal</span>
								</button>
								<div class="p-4 md:p-5 text-center">
									<svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
										<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
									</svg>
									<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3>
									<button data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
										Yes, Im sure
									</button>
									<button data-modal-hide="popup-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button>
								</div>
							</div>
						</div>
					</div> */}

				</div>
			</div>
		</>
	)
}

export default Mylikes
