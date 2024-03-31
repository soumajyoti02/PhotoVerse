"use client"
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';


const Popular = () => {
  const [imageList, setimageList] = useState([]) // To store the returned Images from DB
  const [isLoading, setisLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [isToken, setisToken] = useState(false)
  const [search, setSearch] = useState('')
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    setHovered(!hovered);
    console.log(hovered);

  };

  // To navigate User into Login page if they want to like a image without login
  const router = useRouter()

  // Fetching the most liked images
  const fetchData = async () => {
    const data = await fetch('/api/trending')
    const res = await data.json() // In res.allImages, all trending images are present
    setimageList(res.allImages.reverse()) // Saving the most liked images inside imageList state
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
  return (
    <>
      <Navbar setSearch={setSearch} isToken={isToken} setisToken={setisToken} />
      <div className="min-h-screen w-screen">
        <div className="flex justify-center items-center h-28">
          <p className="text-lg md:text-3xl font-bold w-fit h-fit bg-slate-300 py-3 px-6 shadow-lg md:shadow-xl hover:shadow-2xl transition-shadow rounded-3xl select-none">Trending Images</p>
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
        <div className="ctr  w-11/12">
          {
            imageList.map((item, index) => {
              return (<div key={item._id} onClick={handleClick} className="box relative rounded-3xl bg-gray-800">
                <div className={` ${hovered ? 'imageBox' : ''} imageHoverDesktop transition-opacity duration-300 relative rounded-3xl  max-w-full`}>
                  <Image
                    width={400} height={400}
                    src={item.url} alt={'item'}
                    className={`imageitem h-auto max-w-full rounded-3xl cursor-pointer `}
                  />
                  <div className={`hoverbutton absolute inset-0 cursor-pointer `}>
                    <div className="flex justify-between items-center h-16 w-[60%] mx-auto rounded-3xl mt-10">
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
      </div>
    </>
  )
}

export default Popular
