import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#d4f7eb] text-[#0b0c0b] font-body">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight">
          Welcome to <span className="text-[#3fcd9d]">MyBlog</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8">
          Discover stories, ideas, and personal experiences shared by people just like you.
        </p>
        <Link
          to="/explore"
          className="bg-[#3fcd9d] hover:bg-[#34ba8b] text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
        >
          Explore Blogs
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6 px-6 md:px-16 py-12">
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold mb-2 text-[#3fcd9d]">Write</h3>
          <p>Share your thoughts and insights through well-crafted blog posts.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold mb-2 text-[#3fcd9d]">Read</h3>
          <p>Get inspired by reading stories and posts from our growing community.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold mb-2 text-[#3fcd9d]">Connect</h3>
          <p>Follow your favorite authors and interact through comments and likes.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 px-4  text-[#0b0c0b]">
        <h2 className="text-2xl md:text-3xl font-bold mb-10">Start your writing journey today</h2>
        <Link
          to="/register"
          className="bg-[#0b0c0b] text-white py-2 px-6 rounded-full font-semibold hover:bg-[#1f1f1f] transition"
        >
          Join Now
        </Link>
      </section>

      {/* Floating Create Button */}
      <Link
        to="/create"
        className="fixed bottom-6 right-6 bg-[#3fcd9d] hover:bg-[#34ba8b] text-white rounded-full p-4 shadow-lg transition-all duration-300 group z-50"
        title="Write a new blog"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 group-hover:rotate-12 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  );
};

export default Home;
