import React from 'react'

const Login = () => {
  return (
    <div className=' auth login flex flex-col items-center justify-center h-screen border-2 bg-[#d4f7eb]  text-[#0b0c0b]' >
      <h1 className='text-3xl font-bold mb-4'>Login</h1>
      <p className='mb-4'>Please enter your credentials to login.</p>
      {/* Form for login */}
      <form className='flex flex-col gap-4 items-center p-4 rounded w-1/4'>
        <input type="text" placeholder="Username" className='border p-2 rounded' />
        <input type="password" placeholder="Password" className='border p-2 rounded' />
        <button className='bg-[#4bc198] p-2 px-4 rounded ' type="submit">Login</button>
      </form>
      {/* Link to register page */} 
      <p>Don't have an account? <a className='underline ' href="/register">Register</a></p>
    </div>
  )
}

export default Login