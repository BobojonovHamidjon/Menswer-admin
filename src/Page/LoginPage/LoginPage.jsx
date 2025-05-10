import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const LoginPage = () => {
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch('https://testaoron.limsa.uz/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                login:phone,
                password:password
            })
        }).then((res)=>res.json())
        .then((item)=>{
            
            if(item?.success){
                toast.success(item?.data?.message)
                localStorage.setItem('token', item?.data?.access_token)
                localStorage.setItem('refreshtoken', item?.data?.refresh_token)
                navigate('/')
            }else{
                toast.error(item?.message?.message)
            }
        })
    }
  return (
    <div>
         <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="username" 
              type="text" 
              placeholder="Username" 
              required
              onChange={(e) => setPhone(e.target.value)} 
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
              id="password" 
              type="password" 
              placeholder="******************" 
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs italic"></p>
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-green-500  text-white cursor-pointer w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              type="button" 
              onClick={handleSubmit}
            >
              Login
            </button>
          
          </div>
        </form>
       
      </div>
      
    </div>
    </div>
  )
}

export default LoginPage