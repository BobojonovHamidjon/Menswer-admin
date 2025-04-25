import React, { useEffect } from 'react'
import LoginPage from './Page/LoginPage/LoginPage'
import { Route, Routes, useNavigate } from 'react-router-dom'
import HomePage from './Page/HomePage/HomePage'
import Categories from './Page/HomePage/Categories'
import Discount from './Page/HomePage/Discount'
import Sizes from './Page/HomePage/Sizes'
import Colors from './Page/HomePage/Colors'
import Faq from './Page/HomePage/Faq'
import Contact from './Page/HomePage/Contact'
import Team from './Page/HomePage/Team'
import News from './Page/HomePage/News'
import Product from './Page/HomePage/Product'
import { ToastContainer } from 'react-toastify'

const App = () => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/login')
    } else {
      navigate('/')
    }
  }, [])

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} >
        <Route path="/categories" element={<Categories />} />
        <Route path="/discount" element={<Discount />} />
        <Route path="/sizes" element={<Sizes />} />
        <Route path="/colors" element={<Colors />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/team" element={<Team />} />
        <Route path="/news" element={<News />} />
        <Route path="/product" element={<Product />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
