import React from 'react'

const Register = () => {
  return (
    <div className=' flex flex-col items-center justify-center h-screen border-2 bg-[#d4f7eb] text-[#0b0c0b]'>
      <h1 className='text-3xl font-bold mb-4'>Register</h1>
      <p className='mb-4'>Create a new account</p>

      {/* Registration Form */}
      <form className='flex flex-col items-center space-y-3 w-1/4'>
        <input type='text' placeholder='Username' className='border p-2 rounded' />
        <input type='email' placeholder='Email' className='border p-2 rounded' />
        <input type='password' placeholder='Password' className='border p-2 rounded' />
        <button type='submit' className='bg-[#3fcd9d] text-white p-2 px-4 rounded'>Register</button>
      </form>

    </div>
  )
}

export default Register