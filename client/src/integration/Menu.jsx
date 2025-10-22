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
        <Link to="/integration/single_trapezoidal" className={isCurrent('singletrape')}>Single_Trapezoidal</Link>
        <Link to="/integration/composite_trapezoidal" className={isCurrent('compositetrape')}>Composite_Trapezoidal</Link>
        <Link to="/integration/single_simpson" className={isCurrent('singlesimpson')}>Single_Simpson</Link>
        <Link to="/integration/composite_simpson" className={isCurrent('compositesimpson')}>Composite_Simpson</Link>
    </nav>
  )
}

export default Menu