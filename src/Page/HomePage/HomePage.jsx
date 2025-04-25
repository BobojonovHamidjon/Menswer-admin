import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshtoken')
    navigate('/login')
  }

  return (
    <div>
      <header className='text-right text-3xl font-bold p-4 bg-gray-900'>
        <button onClick={handleLogout} className="bg-red-500 text-white cursor-pointer px-4 py-2 rounded-md">
          Log Out
        </button>
      </header>
      <div className='grid grid-cols-12 gap-4'>

        <nav className="flex flex-col gap-4 col-span-3 p-4 bg-[#1E2939] min-h-screen">
          <img src="https://aoron.nippon.com.uz/assets/logoWhite-1ybNuyjI.png" alt="logo "  className='mx-auto text-center w-20 h-20' />
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md text-white font-bold ${
                isActive ? 'bg-green-600' : 'hover:bg-gray-700'
              }`
            }>
            Product
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md text-white font-bold ${
                isActive ? 'bg-green-600' : 'hover:bg-gray-700'
              }`
            }>
            Categories
          </NavLink>

          <NavLink
            to="/discount"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md text-white font-bold ${
                isActive ? 'bg-green-600' : 'hover:bg-gray-700'
              }`
            }>
            Discount
          </NavLink>

          <NavLink to="/sizes" className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-md text-white font-bold ${
              isActive ? 'bg-green-600' : 'hover:bg-gray-700'
            }`}>
            Sizes
          </NavLink>

          <NavLink to="/colors" className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-md text-white font-bold ${
              isActive ? 'bg-green-600' : 'hover:bg-gray-700'
            }`}>
            Colors
          </NavLink>

          <NavLink to="/faq" className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-md text-white font-bold ${
              isActive ? 'bg-green-600' : 'hover:bg-gray-700'
            }`}>
            Faq
          </NavLink>

          <NavLink to="/contact" className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-md text-white font-bold ${
              isActive ? 'bg-green-600' : 'hover:bg-gray-700'
            }`}>
            Contact
          </NavLink>

          <NavLink to="/team" className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-md text-white font-bold ${
              isActive ? 'bg-green-600' : 'hover:bg-gray-700'
            }`}>
            Team
          </NavLink>

          <NavLink to="/news" className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-md text-white font-bold ${
              isActive ? 'bg-green-600' : 'hover:bg-gray-700'
            }`}>
            News
          </NavLink>
        </nav>

        <div className='col-span-9 p-4 overflow-y-scroll h-[94vh]'>
          <Outlet />
        </div>
      </div>

    
    </div>
  )
}

export default HomePage
