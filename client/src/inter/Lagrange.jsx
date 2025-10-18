import React from 'react'
import { useState } from 'react'
import { e, evaluate, im } from "mathjs";
import Graph from '../component/Graph';
import Table from '../component/TableIteration'
import axios from "axios"; 
import Nav from './Menu'

function Lagrange() {
  const [numPoints, setNumPoints] = useState(3);
  const [xValue, setXValue] = useState(0);
  const [points, setPoints] = useState([
    { x: '', fx: '' },
    { x: '', fx: '' },
    { x: '', fx: '' },
  ]);

  // เพิ่มหรือลดจำนวนจุด
  const updateNumPoints = (delta) => {
    const newCount = Math.max(2, numPoints + delta);
    setNumPoints(newCount);

    const newPoints = [...points];
    while (newPoints.length < newCount) newPoints.push({ x: '', fx: '' });
    while (newPoints.length > newCount) newPoints.pop();
    setPoints(newPoints);
  };

  // อัปเดตค่าจุด x และ f(x)
  const handleChange = (index, field, value) => {
    const newPoints = [...points];
    newPoints[index][field] = value;
    setPoints(newPoints);
  };

  const handleCalculate = () => {
    console.log('X value:', xValue);
    console.log('Points:', points);
    alert('ยังไม่ได้ใส่สูตรคำนวณ 😄');
  };

  return (

    <>
      <Nav current={'lagrange'}></Nav>
      <div className='EquationBox'>
        <h1>
            Lagrange
        </h1>
         <div className="ndd-container">
          <div className="ndd-controls">
            <span className="ndd-label">Number of points</span>

            <div className="ndd-counter">
              <button className="btn btn-decrease" onClick={() => updateNumPoints(-1)}>-</button>
              <span className="ndd-count">{numPoints}</span>
              <button className="btn btn-increase" onClick={() => updateNumPoints(1)}>+</button>
            </div>

            <div className="ndd-xvalue">
              <label>X value</label>
              <input
                type="number"
                value={xValue}
                onChange={(e) => setXValue(e.target.value)}
                step="any"
              />
            </div>

            <button className="btn btn-calc" onClick={handleCalculate}>Calculate!</button>
          </div>

          <div className="ndd-table">
            {points.slice(0, numPoints).map((point, i) => (
              <div className="ndd-row" key={i}>
                <input type="checkbox" className="ndd-check" />
                <span className="ndd-index">{i + 1}.</span>
                <input
                  type="number"
                  placeholder={`x${i}`}
                  value={point.x}
                  onChange={(e) => handleChange(i, 'x', e.target.value)}
                />
                <input
                  type="number"
                  placeholder={`f(x${i})`}
                  value={point.fx}
                  onChange={(e) => handleChange(i, 'fx', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Lagrange