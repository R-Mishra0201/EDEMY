import React from 'react'
import { assets, dummyEducatorData } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'


const Navbar = () => {
  const educatorData = dummyEducatorData
  const {user} = useUser()
  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      <Link to='/'>
      {/* <img src={assets.logo} alt="Logo" className='w-28 lg:w-32'/> */}
        <div
        onClick={() => navigate("/")}
        className="cursor-pointer flex flex-col leading-tight"
      >
        <span className="text-blue-700 font-extrabold text-sm sm:text-base lg:text-lg tracking-wide uppercase">
          Intelligent E-Learning
        </span>
        <span className="text-cyan-600 font-semibold text-xs sm:text-sm lg:text-base tracking-widest uppercase">
          Management System
        </span>
        <span className="text-gray-400 font-medium text-xs tracking-widest uppercase">
          (LMS)
        </span>
      </div>
      </Link>
      <div className='flex items-center gap-5 text-gray-500 relative'>
        <p>Hi! {user ? user.fullName : 'Developers'}</p>
        {user ? <UserButton/> : <img className='max-w-28' src={assets.profile_img}/>}
      </div>
    </div>
  )
}

export default Navbar
