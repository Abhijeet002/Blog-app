// client\src\App.jsx

import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Write from "./pages/Write";
import Single from "./pages/Single";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import CategoryPage from "./pages/CategoryPage";
import ScrollToTop from "./components/ScrollToTop";
import Profile from "./pages/Profile";

const Layout = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "profile/",
        element: <Profile />,
      },
      {
        path: "post/:id",
        element: <Single />,
      },
      {
        path: "write",
        element: <Write />,
      },
      {
        path: "explore/",
        element: <Explore />,
      },
      {
        path: "category/:category",
        element: <CategoryPage />,
      },
      {
        path: "*",
        element: <div>404 Not Found</div>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

const App = () => {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
};

export default App;
