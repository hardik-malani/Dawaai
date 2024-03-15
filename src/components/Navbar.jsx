import React from 'react'

export default function Navbar() {
  return (
    <div className='w-[80%] bg-white flex justify-between items-center mx-auto px-10 py-2 absolute top-10 left-[8%] rounded-xl'>
        <img src="/logo.svg" alt="logo" className='h-[40px]' />
        <button className='text-[#00856F] font-semibold text-[20px] border-[1px] border-[#00856F] px-7 py-2 rounded-xl hover:bg-[#00856F] hover:text-white'>Login</button>
    </div>
  )
}
