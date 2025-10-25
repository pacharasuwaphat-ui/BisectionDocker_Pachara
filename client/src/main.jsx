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
import Spline from './inter/Spline.jsx'

import SingleTrapezoidal from './integration/SingleTrapzoidal.jsx'
import SingleSimpson from './integration/SingleSimpson.jsx'
import CompositeTrapezoidal from './integration/CompositeTrapzoidal.jsx'
import CompositeSimpson from './integration/CompositeSimpson.jsx'

import Conjugate from './linear/Conjugate.jsx'
import Cramer from './linear/Cramer.jsx'
import Guass from './linear/Guass.jsx'
import GuassJordan from './linear/GuassJordan.jsx'
import Inversion from './linear/inversion.jsx'
import LU from './linear/LU.jsx'
import Jacobi from './linear/Jacobi.jsx'
import GuassSeidel from './linear/GuassSeidel.jsx'
import Cholesky from './linear/Cholesky.jsx'

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
  {
    path: "/inter/spline",
    element: <Spline/>,
  },

// ------------------------ integration  ---------------------------------

  {
    path: "/integration/single_trapezoidal",
    element: <SingleTrapezoidal/>,
  },
  {
    path: "/integration/composite_trapezoidal",
    element: <CompositeTrapezoidal/>,
  },
  {
    path: "/integration/single_simpson",
    element: <SingleSimpson/>,
  },
  {
    path: "/integration/composite_simpson",
    element: <CompositeSimpson/>,
  },

// ------------------------ Linear Algebra  ---------------------------------

  {
    path: "/linear/conjugate",
    element: <Conjugate/>,
  },
  {
    path: "/linear/cramer",
    element: <Cramer/>,
  },
  {
    path: "/linear/guass",
    element: <Guass/>,
  },
  {
    path: "/linear/guassjordan",
    element: <GuassJordan/>,
  },
  {
    path: "/linear/inversion",
    element: <Inversion/>,
  },
  {
    path: "/linear/lu",
    element: <LU/>,
  },
  {
    path: "/linear/jacobi",
    element: <Jacobi/>,
  },
  {
    path: "/linear/guassseidel",
    element: <GuassSeidel/>,
  },
  {
    path: "/linear/cholesky",
    element: <Cholesky/>,
  },



]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
