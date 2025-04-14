// import React from 'react'

// const Footer = () => {
//   return (
//     <div className='flex items-center justify-center h-16 bg-[#3fcd9d] text-[#0b0c0b] font-bold'>
//       <p className='text-center'>© 2023 My Blog. All rights reserved.</p>
//       <div className='flex gap-4 ml-4'>
//         <a href="/privacy" className='underline'>Privacy Policy</a>
//         <a href="/terms" className='underline'>Terms of Service</a>
//       </div>
//     </div>
//   )
// }

// export default Footer

import React from 'react';

const Footer = () => {
  return (
    <footer className="relative bg-[#4bc198] text-[#0b0c0b]">
      {/* Glossy shine overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none rounded-t-xl" />

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm relative z-10">
        <p className="text-center md:text-left font-medium">
          © {new Date().getFullYear()} <span className="font-semibold">My Blog</span>. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a href="/privacy" className="hover:underline hover:text-black transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:underline hover:text-black transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
