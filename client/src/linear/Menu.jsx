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
        <Link to="/" >Home</Link>
        <Link to="/linear/cramer" className={isCurrent('cramer')}>Cramer</Link>
        <Link to="/linear/guass" className={isCurrent('guass')}>Guass</Link>
        <Link to="/linear/guassjordan" className={isCurrent('guassjordan')}>GuassJordan</Link>
        <Link to="/linear/inversion" className={isCurrent('inversion')}>inversion</Link>
        <Link to="/linear/lu" className={isCurrent('lu')}>LU</Link>
        <Link to="/linear/cholesky" className={isCurrent('cholesky')}>Cholesky</Link>
        <Link to="/linear/jacobi" className={isCurrent('jacobi')}>Jacobi</Link>
        <Link to="/linear/guassseidel" className={isCurrent('guassseidel')}>Guass_Seidel</Link>
        <Link to="/linear/conjugate" className={isCurrent('conjugate')}>Conjugate</Link>
        
        
    </nav>
  )
}

export default Menu