import React from 'react'
import { Link } from 'react-router-dom'

function Menu() {
  return (
    <nav>
        <Link to={'/root/Graphical'}>Root_of_Equaiton</Link>
        <Link to={'/inter/newton'}>Interpolation</Link>
        
    </nav>
  )
}

export default Menu