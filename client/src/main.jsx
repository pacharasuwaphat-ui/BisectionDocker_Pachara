import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import './App.css'
import Home from './Home.jsx'
import Bisection from './Root/Bisection.jsx'
import Graphical from './Root/Graphical.jsx'
import FalsePosition from './Root/FalsePosition.jsx'
import Onepoint from './Root/OnePoint.jsx'
import NewtonRaphson from './Root/NewTonRaphson.jsx'
import Secant from './Root/Secant.jsx'

import NewtonDevided from './inter/NewtonDevided.jsx'
import Lagrange from './inter/Lagrange.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/root/Graphical",
    element: <Graphical/>,
  },
  {
    path: "/root/Bisection",
    element: <Bisection/>,
  },
  {
    path: "/root/FalsePosition",
    element: <FalsePosition/>,
  },
  {
    path: "/root/Onepoint",
    element: <Onepoint/>,
  },
  {
    path: "/root/NewtonRaphson",
    element: <NewtonRaphson/>,
  },
  {
    path: "/root/Secant",
    element: <Secant/>,
  },

// ------------------------ interpolation ---------------------------------

  {
    path: "/inter/newton",
    element: <NewtonDevided/>,
  },
  {
    path: "/inter/lagrange",
    element: <Lagrange/>,
  },


]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
