import React from 'react'
import './Component.css'

function TableIteration({ Iterations }) {
  if (!Iterations || Iterations.length === 0) return null;

  // ดึงชื่อคอลัมน์จาก key ของ object แถวแรก
  const headers = Object.keys(Iterations[0]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className='anotherColumn'>{header.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Iterations.map((row, i) => (
            <tr key={i}>
              {headers.map((header, j) => (
                <td key={j} className='anotherColumn'>
                  {typeof row[header] === 'number'
                    ? row[header].toFixed(6)
                    : row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableIteration;
