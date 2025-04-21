import React from "react";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

// const Single = () => {
//   return (
//     <div>
//       <h1 className='text-3xl font-bold'>Single Post</h1>
//       <div className='flex flex-col md:flex-row items-center gap-6 sm:gap-10'>
//         <div className='hidden md:block md:w-1/2 overflow-hidden rounded-3xl shadow-lg'>
//           <img src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0" alt="Post" className='w-full h-64 md:h-80 object-cover transition-transform duration-300 hover:scale-105' />
//         </div>
//         <div className='w-full md:w-1/2 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-md relative transition-all hover:shadow-lg'>
//           <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-3'>Post Title</h2>
//           <p className='text-gray-600 text-sm sm:text-base leading-relaxed mb-5'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.</p>
//           <button className='text-sm sm:text-base font-medium text-white bg-[#3fcd9d] px-5 py-2 rounded-full hover:bg-[#2bbd8e] transition-all duration-200 shadow-sm'>Read More</button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Single

const Single = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Post Content (spans 7 out of 12 columns on large screens) */}
      <div className="lg:col-span-8 ">
        <img
          src="https://images.unsplash.com/photo-1741648711665-e1a8003b7891"
          alt="Post Banner"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />

        <h1 className="text-3xl font-bold mb-2">Post Title Goes Here</h1>

        <div className="m-3 ml-0 flex justify-start items-center gap-3 text-sm text-gray-500">
          <img
            src="https://randomuser.me/api/portraits/men/11.jpg"
            alt="Author"
            className="w-8 h-8 rounded-full object-cover mt-0.5"
          />
          <p className="text-gray-600 mt-0 mb-0 relative flex flex-col ">
            <span className="font-medium">By John Doe</span>
            {/* <br></br> */}
            <span>Apr 12, 2025</span>
          </p>
          <div className=" flex gap-3 right-0 text-gray-400 bg-yellow-400">
          <Link to={"/write?edit/1"}>
            <Pencil
              className="w-5 h-5 cursor-pointer hover:text-[#3fcd9d] transition"
              title="Edit"
            />
          </Link>
            <Trash2
              className="w-5 h-5 cursor-pointer hover:text-red-500 transition"
              title="Delete"
            />
          </div>
        </div>
        <div className="text-gray-800 leading-relaxed space-y-4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae
            tincidunt dui. Sed ut perspiciatis unde omnis iste natus error sit
            voluptatem accusantium doloremque laudantium.
          </p>
          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
            fugit, sed quia consequuntur magni dolores eos.
          </p>
        </div>
      </div>

      {/* Right: Sidebar Recommendations (spans 5 out of 12 columns on large screens) */}
      
      <Sidebar/>
    </div>
  );
};

export default Single;
