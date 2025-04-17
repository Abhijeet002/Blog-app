// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isOpenGenres, setIsOpenGenres] = useState(false);

//   return (
//     <header className="bg-teal-600 text-white">
//       <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
//         <div className="text-2xl font-bold">
//           <Link to="/">MyBlog</Link>
//         </div>

//         {/* Desktop Nav */}
//         <nav className="hidden md:flex items-center space-x-6">
//           <Link to="/" className="hover:underline">Home</Link>
//           <Link to="/login" className="hover:underline">Login</Link>
//           <Link to="/register" className="hover:underline">Register</Link>

//           {/* Genres Dropdown */}
//           <div className="relative group">
//             <button className="hover:underline">Genres</button>
//             <div className="absolute left-0 mt-2 w-40 bg-white text-teal-600 rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-300 z-20">
//               <Link to="/genres/entertainment" className="block px-4 py-2 hover:bg-teal-100">Entertainment</Link>
//               <Link to="/genres/lifestyle" className="block px-4 py-2 hover:bg-teal-100">Lifestyle</Link>
//               <Link to="/genres/technology" className="block px-4 py-2 hover:bg-teal-100">Technology</Link>
//               <Link to="/genres/travel" className="block px-4 py-2 hover:bg-teal-100">Travel</Link>
//               <Link to="/genres/health" className="block px-4 py-2 hover:bg-teal-100">Health</Link>
//             </div>
//           </div>

//           <Link to="/profile" className="hover:underline">Profile</Link>
//           {/* <Link to="/settings" className="hover:underline">Settings</Link> */}

//           {/* Logout Button with Curtain Effect */}
//           <button className="relative group px-4 py-2 overflow-hidden bg-white text-teal-600 rounded">
//             <span className="relative z-10">Logout</span>
//             <span className="absolute inset-0 bg-teal-100 top-full group-hover:top-0 transition-all duration-300 ease-in-out z-0"></span>
//           </button>
//         </nav>

//         {/* Mobile Hamburger */}
//         <div className="md:hidden">
//           <button onClick={() => setIsOpen(!isOpen)}>
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
//               viewBox="0 0 24 24">
//               {isOpen ? (
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//               ) : (
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//               )}
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden px-4 pb-4 space-y-2 bg-teal-700">
//           <Link to="/" className="block hover:underline">Home</Link>
//           <Link to="/login" className="block hover:underline">Login</Link>
//           <Link to="/register" className="block hover:underline">Register</Link>

//           {/* Mobile Genres Dropdown */}
//           <div className="space-y-1">
//             <button
//               onClick={() => setIsOpenGenres(!isOpenGenres)}
//               className="w-full text-left hover:underline"
//             >
//               Genres
//             </button>
//             {isOpenGenres && (
//               <div className="pl-4 space-y-1 text-teal-100">
//                 <Link to="/genres/entertainment" className="block hover:underline">Entertainment</Link>
//                 <Link to="/genres/lifestyle" className="block hover:underline">Lifestyle</Link>
//                 <Link to="/genres/technology" className="block hover:underline">Technology</Link>
//                 <Link to="/genres/travel" className="block hover:underline">Travel</Link>
//                 <Link to="/genres/health" className="block hover:underline">Health</Link>
//               </div>
//             )}
//           </div>

//           <Link to="/profile" className="block hover:underline">Profile</Link>
//           {/* <Link to="/settings" className="block hover:underline">Settings</Link> */}

//           <button className="block w-full text-left px-4 py-2 bg-white text-teal-600 rounded">Logout</button>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Navbar;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenGenres, setIsOpenGenres] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-semibold text-teal-600">
            <Link to="/">MyBlog</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
            <Link to="/" className="hover:text-teal-600 transition-colors">Home</Link>
            <Link to="/login" className="hover:text-teal-600 transition-colors">Login</Link>
            <Link to="/register" className="hover:text-teal-600 transition-colors">Register</Link>

            <div className="relative group">
              <button className="hover:text-teal-600 transition-colors">Genres</button>
              <div className="absolute left-0 mt-2 w-44 bg-white border rounded-md shadow-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-300 z-20">
                <Link to="/genres/entertainment" className="block px-4 py-2 text-gray-700 hover:bg-teal-50">Entertainment</Link>
                <Link to="/genres/lifestyle" className="block px-4 py-2 text-gray-700 hover:bg-teal-50">Lifestyle</Link>
                <Link to="/genres/technology" className="block px-4 py-2 text-gray-700 hover:bg-teal-50">Technology</Link>
                <Link to="/genres/travel" className="block px-4 py-2 text-gray-700 hover:bg-teal-50">Travel</Link>
                <Link to="/genres/health" className="block px-4 py-2 text-gray-700 hover:bg-teal-50">Health</Link>
              </div>
            </div>

            <Link to="/profile" className="hover:text-teal-600 transition-colors">Profile</Link>

            {/* Logout with Curtain Hover */}
            <button className="relative overflow-hidden px-4 py-2 text-sm font-medium text-teal-600 bg-white rounded group border border-teal-200">
              <span className="relative z-10">Logout</span>
              <span className="absolute inset-0 bg-teal-50 top-full group-hover:top-0 transition-all duration-300 ease-in-out z-0"></span>
            </button>
          </nav>

          {/* Hamburger for Mobile */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 shadow-md">
          <Link to="/" className="block py-2 text-gray-700 hover:text-teal-600">Home</Link>
          <Link to="/login" className="block py-2 text-gray-700 hover:text-teal-600">Login</Link>
          <Link to="/register" className="block py-2 text-gray-700 hover:text-teal-600">Register</Link>

          {/* Genres Dropdown */}
          <div>
            <button onClick={() => setIsOpenGenres(!isOpenGenres)} className="block py-2 text-gray-700 hover:text-teal-600 w-full text-left">
              Genres
            </button>
            {isOpenGenres && (
              <div className="pl-4">
                <Link to="/?genres=entertainment" className="block py-1 text-sm text-gray-600 hover:text-teal-600">Entertainment</Link>
                <Link to="/genres/lifestyle" className="block py-1 text-sm text-gray-600 hover:text-teal-600">Lifestyle</Link>
                <Link to="/genres/technology" className="block py-1 text-sm text-gray-600 hover:text-teal-600">Technology</Link>
                <Link to="/genres/travel" className="block py-1 text-sm text-gray-600 hover:text-teal-600">Travel</Link>
                <Link to="/genres/health" className="block py-1 text-sm text-gray-600 hover:text-teal-600">Health</Link>
              </div>
            )}
          </div>

          <Link to="/profile" className="block py-2 text-gray-700 hover:text-teal-600">Profile</Link>
          <button className="w-full text-left mt-2 px-4 py-2 text-sm text-teal-600 border border-teal-200 rounded bg-white">Logout</button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
