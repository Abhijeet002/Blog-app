// client\src\pages\Single.jsx

import React from "react";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

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
