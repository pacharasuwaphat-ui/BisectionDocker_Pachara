import React from 'react'
import { Link } from 'react-router-dom'

function Menu() {
  return (
    <nav>
        <Link to={'/root/Graphical'}>Root_of_Equaiton</Link>
        <Link to={'/inter/newton'}>Interpolation</Link>
        <Link to={'/integration/single_trapezoidal'}>Integration</Link>
        <Link to={'/linear/cramer'}>Linear_Algebra</Link>
        
    </nav>
  )
}

export default Menu