import React from 'react'
import { useState } from 'react'
import './Component.css'

function TableIteration({Iterations}) {

    // const [Iterations, setIterations] = useState([]);
    // setIterations(Iter);

  return (
    <div>
        <table >
          <thead>
            <tr>
              <th  className='Firstcolumn'>Iteration</th>
              <th className='anotherColumn'>XL</th>
              <th className='anotherColumn'>XR</th>
              <th className='anotherColumn'>XM</th>
              <th className='anotherColumn'>Error</th>
            </tr>
          </thead>
          <tbody>
            {Iterations.map((item) => (
              <tr key={item.iteration}>
                <td  className='Firstcolumn'>{item.iteration}</td>
                <td className='anotherColumn'>{item.xl.toFixed(6)}</td>
                <td className='anotherColumn'>{item.xr.toFixed(6)}</td>
                <td className='anotherColumn'>{item.xm.toFixed(6)}</td>
                <td className='anotherColumn'>{item.error.toFixed(6)}</td>
              </tr>
            ))}
          </tbody>
        </table>

    </div>
  )
}

export default TableIteration
