import Link from 'next/link'
import React from 'react'

const QuickSearch = ({ title, slug }) => {
    return (
        <>
            <Link href={{ pathname: '/explore', query: { search: slug } }}>
                <div className="flex md:justify-start items-center h-24">
                    <p className="text-md  font-semibold py-3 px-6 shadow-lg md:shadow-xl hover:shadow-2xl transition-shadow rounded-xl bg-gradient-to-r from-emerald-900 to-red-800 bg-clip-text text-transparent select-none bg-[#e7ecef]">
                        {title}
                    </p>
                </div>
            </Link>
        </>
    )
}

export default QuickSearch
