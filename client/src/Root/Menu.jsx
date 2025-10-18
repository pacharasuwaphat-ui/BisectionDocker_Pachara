import React from 'react'
import { Link } from 'react-router-dom'

function Menu({current}) {
  function isCurrent(s){
    if(current == s){
      return 'Current'
    }
    return ''
  }
  return (
    <nav>
        <Link to="/">Home</Link>
        <Link to="/root/Graphical" className={isCurrent('Graphical')}>Graphical</Link>
        <Link to="/root/Bisection" className={isCurrent('Bisection')}>Bisection</Link>
        <Link to="/root/FalsePosition" className={isCurrent('False')}>False-Position</Link>
        <Link to="/root/OnePoint" className={isCurrent('Onepoint')}>One-Point</Link>
        <Link to="/root/NewtonRaphson" className={isCurrent('Newton')}>Newton-Raphson</Link>
        <Link to="/root/Secant" className={isCurrent('Secant')}>Secant</Link>
    </nav>
  )
}

export default Menu