"use client"
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';
import Link from 'next/link';


const Popular = () => {
  const [imageList, setimageList] = useState([]) // To store the returned Images from DB
  const [isLoading, setisLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [isToken, setisToken] = useState(false)
  const [search, setSearch] = useState('')
  const [hovered, setHovered] = useState(false);

  const [viewBox, setviewBox] = useState(false)
  const [viewimage, setviewimage] = useState('')
  const [desc, setdesc] = useState('')

  const [dlinkStore, setdlinkStore] = useState('')
  const [owner, setowner] = useState({})
  const [comments, setcomments] = useState([])
  const [userComments, setuserComments] = useState('')

  const handleClick = () => {
    setHovered(!hovered);
    console.log(hovered);

  };

  const handleView = async (url, downloadLink, desc, owner, comment) => {
    setviewBox(!viewBox)
    setviewimage(url)
    setdesc(desc)
    setowner(owner)
    setdlinkStore(downloadLink)
    setcomments(comment)
  }

  const handleClose = () => {
    setviewBox(!viewBox)
  }

  // To navigate User into Login page if they want to like a image without login
  const router = useRouter()

  // Fetching the most liked images
  const fetchData = async () => {
    const data = await fetch('/api/trending')
    const res = await data.json() // In res.allImages, all trending images are present
    setimageList(res.allImages.reverse()) // Saving the most liked images inside imageList state
    console.log(res.allImages[0]);

  }

  useEffect(() => {
    fetchData()

    const token = localStorage.getItem("sessionToken")
    const userEmail = localStorage.getItem("userEmail")
    if (token) {
      setisToken(true) // To pass into Navbar. It will Customise Navbar for loggedin users
      setEmail(userEmail)
    }
  }, [])

  // User can like a image in this `/popular` route also
  const handleLike = async (url) => {
    if (isToken) {
      const data = await fetch('api/popular', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, email })
      })

      const res = await data.json()
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

  const handleComments = async () => {
    // Getting the name of the user
    const nameOfUser = await fetch(`/api/getName`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    })
    const nres = await nameOfUser.json()
    const nameFromEmail = nres.user.name;
    console.log(nameFromEmail);

    // Writing comments
    const data = await fetch(`/api/writeComments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: viewimage,
        email,
        userComments,
        name: nameFromEmail
      })
    })
    const res = await data.json()
    if (res.message === 'success') {
      toast.success('Commented!', {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setcomments(res.comments);
      setuserComments('')
      console.log(comments);
    }
    else {
      toast.error('Some Error Occured. Please Retry!', {
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
  return (
    <>
      <Navbar setSearch={setSearch} isToken={isToken} setisToken={setisToken} />
      <div className="min-h-[79vh] w-screen relative flex flex-col">
        <div className="flex justify-center items-center h-28">
          <p className="text-lg md:text-3xl font-bold py-3 px-6 bg-gradient-to-r from-[#d2d9df] to-[#c1cdd6] shadow-lg md:shadow-xl hover:shadow-2xl transition-shadow rounded-3xl text-slate-700 select-none bg-[#e7ecef]">
            Most Liked Images
          </p>
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

        {/* Fetching the images from imageList array */}
        <div className="ctr w-11/12">
          {
            imageList.map((item, index) => {
              return (<div key={item._id} onClick={handleClick} className="box relative rounded-3xl bg-gray-800">
                <div className={` ${hovered ? 'imageBox' : ''} imageHoverDesktop transition-opacity duration-300 relative rounded-3xl  max-w-full`}>
                  <Image
                    width={400} height={400}
                    src={item.url} alt={'item'}
                    className={`imageitem h-auto max-w-full rounded-3xl  `}
                  />

                  <div className={`hoverbutton flex-col absolute inset-0  `}>

                    {/* Button to See the image and comments */}
                    <div className="h-[25%] w-full flex justify-end ">
                      <button onClick={() => handleView(item.url, item.downloadLink, item.desc, item.owner, item.comments)} type="button" className="mr-8 h-10 mt-2 px-2  rounded-3xl text-gray-200 text-5xl tracking-widest">...</button>
                    </div>

                    {/* Like and download button */}
                    <div className="flex justify-between items-center h-[75%] w-[60%] mx-auto rounded-3xl mt-10">
                      <div className="flex">
                        <button onClick={() => { handleLike(item.url) }} type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex ">Like
                          <Image height={20} width={20} src='/like.png' alt="" className=' backdrop-blur-3xl rounded-full ml-4' />
                        </button>
                      </div>

                      <button onClick={() => handleDownload(item.downloadLink)} type="button" className=" text-white  py-2.5 text-center  mb-2 flex rounded-lg  justify-center">
                        <Image height={40} width={40} src='/download.png' alt="" className='  ' />
                      </button>
                    </div>


                  </div>
                </div>
              </div>)
            })
          }
        </div>


        {/* Image Details Popup */}
        <div className={`fixed h-[90vh] w-screen ${viewBox ? 'flex' : 'hidden'}  justify-center items-center backdrop-blur-md pb-16 md:pb-0`}>
          <div className="absolute h-[80%] md:w-9/12 w-[95%] bg-[#e7ecef]  rounded-3xl px-5 md:overflow-hidden overflow-auto">
            <div className=" h-[10%] w-full flex justify-end items-start sticky top-0 bg-[#e7ecef] rounded-b-xl box-border py-2.5 px-5 z-50">

              <button onClick={handleClose} type="button" className="text-black bg-red-500 hover:bg-red-600 hover:text-gray-900 rounded-lg text-sm w-9 h-9 md:w-10 md:h-10 ms-auto inline-flex justify-center items-center  mr-" data-modal-hide="default-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
              </button>
            </div>

            {/* Whole inner Display */}
            <div className="flex flex-col md:flex-row md:justify-between md:w-11/12 h-[90%] md:m-auto ">
              <div className="left md:w-[40%] ">
                <img src={viewimage} alt="alt_text" className='rounded-3xl md:h-[90%] object-cover shadow-xl shadow-gray-400' />
              </div>

              {/* Image details side of Box popup */}
              <div className="right relative md:w-[55%] h-[90%] px-2 pt-5 md:overflow-auto md:pr-6">
                <p className="text-2xl ">{desc}</p>
                {/* Download Button */}
                <button onClick={() => handleDownload(dlinkStore)} className="relative inline-flex items-center justify-center p-0.5 mb-1 mt-5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 ">
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                    <div className="flex justify-between space-x-3">
                      <img src="/download_svg.svg" alt="" className='w-6' />
                      <span>Download</span>
                    </div>
                  </span>
                </button>

                {/* Owner Details goes here */}
                <p className="text-base text-gray-700 text-center md:text-left mt-5 underline underline-offset-8">Owner Details</p>
                <div className="flex flex-col flex-wrap md:flex-row justify-between">
                  <div className="text-lg flex space-x-2 mt-3">
                    <img src={owner.profile_image} alt="profile_photo" className='rounded-full h-10' />
                    <p className="text-base text-gray-700 mt-1">{owner.username}</p>
                  </div>

                  {owner.instagram_username && <div className="flex space-x-2 mt-3">
                    <a href='https://www.instagram.com/code_wizard4/' target='_blank' className=" text-gray-500">
                      <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-8 h-8" viewBox="0 0 24 24">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                      </svg>
                    </a>
                    <p className='text-lg text-gray-700'>{owner.instagram_username}</p>
                  </div>}

                  {owner.location && <div className="text-lg flex space-x-2 items-center mb-1 mt-3">
                    <img src={`/location.png`} alt="profile_photo" className='rounded-full h-9' />
                    <p className="text-base text-gray-700">{owner.location}</p>
                  </div>}
                </div>

                {/* Comment Section starts here  */}
                <div className="md:h-[17.5rem] min-h-36 w-full flex flex-col mt-7 pb-8 md:pb-0 overflow-y-auto">
                  <div className='search flex bg-gray-300 w-full rounded-3xl  '>
                    <input value={userComments} onChange={(e) => setuserComments(e.target.value)} type="comment" name="search" id="search" placeholder='Your thoughts...' className='py-1 px-5 w-[85%] rounded-l-3xl h-10 bg-gray-300 text-black placeholder:text-slate-500 outline-none' />

                    <button onClick={handleComments} className='w-[15%] md:flex justify-center items-center'>
                      <Image width={37} height={40} src="/comment.png" alt="" className='h-7 w-7 cursor-pointer mr-5 md:mr-0 ' />
                    </button>
                  </div>
                  <div className="mt-5 overflow-auto">
                    <p className="text-base text-gray-700 text-center md:text-left underline underline-offset-8 mb-3">All Comments</p>
                    {
                      comments.length === 0 && <p className="mt-5 text-base text-gray-500 text-center md:text-left ">No comments till now. Add one!</p>
                    }
                    {
                      comments.map((item, index) => {
                        return (
                          <div key={index} className="">
                            <p className=" text-gray-500">
                              {item.name} : {item.comm}
                            </p>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Popular
