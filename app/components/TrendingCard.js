import Link from 'next/link'
import React from 'react'

const TrendingCard = ({ title, slug, image }) => {
    return (
        <>
            <div className=" md:h-[60vh] h-[50vh] mb-8 relative opacity-95 shadow-xl shadow-gray-500 rounded-xl hover:shadow-gray-600 transition-shadow duration-300">
                <img src={image} alt="cd1" className="w-full h-full object-cover rounded-xl mb-8 z-10" />
                <div className="absolute inset-0 z-20 flex flex-col justify-start items-center bg-gray-900 bg-opacity-40 hover:bg-opacity-55 transition-opacity duration-300 rounded-xl">
                    <div className="h-full w-full rounded-xl flex flex-col justify-between items-center py-8 md:py-12">

                        <button type="button" class="backdrop-blur-xl bg-slate-800 bg-opacity-50 hover:from-teal-200 hover:to-lime-200 font-bold rounded-lg text-3xl px-5 py-2.5 text-center me-2 mb-2  ">
                            <span className="bg-gradient-to-r from-gray-300 to-neutral-400 bg-clip-text text-transparent">
                                {title}
                            </span>
                        </button>

                        <Link href={{ pathname: '/explore', query: { search: slug } }}>
                            <button type="button" className="text-white bg-gradient-to-br from-green-700 to-blue-700 hover:bg-gradient-to-bl mt-6 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Explore <span className="text-xl mb-2">&rarr;</span></button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TrendingCard
