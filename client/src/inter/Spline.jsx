import React from 'react'
import { useState } from 'react'
import Graph from '../component/Graph';
import Table from '../component/TableIteration'
import axios from "axios"; 
import Nav from './Menu'
import './UI.css'

function Spline() {

  const [value, setValue] = useState("");
  const [TextAns, setTextAns] = useState("");
  const [mode, setMode] = useState("Linear");

  const [numPoints, setNumPoints] = useState(3);
  const [xValue, setXValue] = useState(0);
  const [points, setPoints] = useState([
    { x: '', fx: '' },
    { x: '', fx: '' },
    { x: '', fx: '' },
  ]);
  const [plotgraph,setplot] = useState([]);
  const [answer, setAns] = useState(0);
  const [HaveCal, setCal] = useState(false);
  const [Old, setOld] = useState([]);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(true);
  
  function fetchDatabase(){
    // fetch คือขอ data จาก server ( เรียก GET)
    try {
      fetch('http://localhost:8000/spline')
      .then((response) =>{
        return response.json()
      })
      .then((responseData) =>{
        setOld(responseData)
      })
    } catch (error) {
        console.error('error message',error.message)
        res.status(500).json({
            message: 'something wrong',
        })
    }
  }

  const PushDataBase = async() =>{
    try{
      const data = {
        x : xValue,
        method : "spline",
        n : numPoints,
        points : points.map(p => ({ xi: p.x, fx: p.fx }))
      }
      console.log('submit data', data)
      const response = await axios.post('http://localhost:8000/inter', data)
      console.log('response' , response.data)

    }catch(error){
      if(error.response){
        console.log(error.response.data.message)
      }
    }
  }

  function Cancel() {
    setShowOld(false);
    setShowNew(true);
  }

  function getOldProblem() {
    setShowOld(true);
    setShowNew(false);
    fetchDatabase()
  }

  function Oldcal(e) {
    e.preventDefault();
    const selected = Old.find(item => item.id === Number(value));
    if (selected) {
      setNumPoints(selected.n);
      setXValue(selected.x);
      setPoints(selected.point.map(p => ({ x: p.xi, fx: p.fx })));
    }

    Cancel();
  }

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

  // คำนวน LinearSpline
  const LinearCal = (init , x , n) => {
    init.sort((a, b) => a.x - b.x)
    let i = 0
    for(;i<n;i++)
        if(init[i].x > x) break;
    if(i == n){
        alert("ไม่สามารถหาค่าได้ครับ");
        return;
    }   
    let m = (init[i].fx - init[i-1].fx)/(init[i].x - init[i-1].x)
    let a = 'f('+ x + ') = '+ init[i-1].fx +' + ' + m +'('+ x + '-' + init[i-1].x + ')'
    setTextAns(a);
    let Ans = init[i-1].fx + m*(x-init[i-1].x)
    setAns(Ans)

  };

const handleCalculate = () => {
  if (!xValue || points.some(p => p.x === '' || p.fx === '')) {
    alert("⚠️ นายท่านครับ ได้โปรด กรอก ข้อ มูล ให้ ครบ ก่อน นะ ครับ");
    return;
  }
  if (mode == 'Cubic') {
    alert("⚠️ ขออภัยด้วย ท่านไม่ได้ผิดแต่อย่างใด แต่เราแค่ยังทำไม่เสร็จ");
    return;
  }

  let x = parseFloat(xValue);
  let n = parseInt(numPoints);
  let point = [];

  // แปลงข้อมูลจุดให้เป็นตัวเลข
  let initial = points.slice(0, n).map(p => ({
    x: parseFloat(p.x),
    fx: parseFloat(p.fx)
  }));

  if(mode == 'Linear'){
    LinearCal(initial , x , n)
  }

  // เตรียมข้อมูลกราฟ
  point = initial.map(p => ({
    x: p.x,
    fx: p.fx
  }));


  // อัปเดต state ทั้งหมด
  setplot(point);
//   setAns(result);
//   setL(data);
  setCal(true);
  PushDataBase();
};

  return (

    <>
      <Nav current={'spline'}></Nav>
      <div className='EquationBox'>
        <h1>
            Spline
        </h1>
        <div className="spline-header">
      <div className="spline-tabs">
        <button
          className={`spline-tab ${mode === "Linear" ? "active" : ""}`}
          onClick={() => setMode("Linear")}
        >
          Linear
        </button>
        <button
          className={`spline-tab ${mode === "Quadratic" ? "active" : ""}`}
          onClick={() => setMode("Quadratic")}
        >
          Quadratic
        </button>
        <button
          className={`spline-tab ${mode === "Cubic" ? "active" : ""}`}
          onClick={() => setMode("Cubic")}
        >
          Cubic
        </button>
      </div>
    </div>
        
        {showNew && (
            
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

            <button className="btn btn-calc" onClick={getOldProblem}>Get Old</button>
            <button className="btn btn-calc" onClick={handleCalculate}>Calculate!</button>
          </div>

          <div className="ndd-table">
            {points.slice(0, numPoints).map((point, i) => (
              <div className="ndd-row" key={i}>
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
        )}

          {showOld && (
            <div>
              <div className='Textinput'>
                  <form onSubmit={Oldcal}>
                  {Old.map((items, index) => (
                      <center  key={index} className='oldSelect'>
                      <label>
                      <input className='oldSelect'
                          type="radio"
                          value={items.id}
                          checked={value === items.id}
                          onChange={(e) => setValue(Number(e.target.value))}
                      />
                      {" X = " + items.x + ", Num_of_point = " + items.n + ", Point -> " }
                      {items.point.map((p, i) => (
                        <span key={i}>
                          {"X" + i +" = (" + p.xi + ", " + p.fx + ") , "}
                        </span>
                      ))}
                      </label>
                      </center>
                  ))}
                  
                  <center>
                      <button className='btn btn-calc' type="submit">Select</button>
                  </center>
                  </form>
              </div>
              <center>
                  <button className='btn btn-calc' onClick={Cancel}>Cancel</button>
              </center>
            </div>
          )}

        {HaveCal && (
        <div className='ndd-container'>
            <h2 className='Header-answer'>
                Solution
            </h2>
            <h2>
                {TextAns}
            </h2>
            <h2>
                Fx is {answer}
            </h2>

        </div>
        
        
        )}
        

        {plotgraph.length > 0 && (
            <Graph Points={plotgraph} />
        )}
        

      </div>
    </>
  );
}

export default Spline