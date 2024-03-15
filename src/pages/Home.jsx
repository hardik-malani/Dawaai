import React from 'react'
import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <div className='bg-[#B1D7D0] h-screen w-screen absolute'>
        <Navbar/>
        <div className='text-[#00856F] mx-10 flex gap-6 relative top-32 left-[75%] font-semibold'>
            <span className='hover:text-[#559c90]'>Consult a doctor</span>
            <span className='hover:text-[#559c90]'>Get Medical Tests</span>
        </div>
    </div>
  )
}
