import React from 'react'
import { Link } from 'react-router-dom'

function Menu({ current }) {

  function isCurrent(s){
    if(current == s){
      return 'Current'
    }
    return ''
  }

  return (
    <nav>
        <Link to="/" >Home</Link>
        <Link to="/inter/newton" className={isCurrent('newton')}>Newton_Devided</Link>
        <Link to="/inter/lagrange" className={isCurrent('lagrange')}>Lagrange</Link>
        <Link to="/inter/spline" className={isCurrent('spline')}>Spline</Link>
        
        
    </nav>
  )
}

export default Menu