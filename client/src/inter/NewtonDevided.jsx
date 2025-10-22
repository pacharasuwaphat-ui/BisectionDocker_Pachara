import { useState } from 'react'
import axios from "axios";
import Nav from './Menu'
import './UI.css'
import Table from '../component/TableIteration';
import Graph from '../component/Graph';

function NewtonDivided() {

  const [value, setValue] = useState("");

  const [numPoints, setNumPoints] = useState(3);
  const [xValue, setXValue] = useState(0);
  const [points, setPoints] = useState([
    { x: '', fx: '' },
    { x: '', fx: '' },
    { x: '', fx: '' },
  ]);
  const [plotgraph,setplot] = useState([]);
  const [CI, setC] = useState([]);
  const [answer, setAns] = useState(0);
  const [HaveCal, setCal] = useState(false);
  const [Old, setOld] = useState([]);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(true);
  
  function fetchDatabase(){
    // fetch คือขอ data จาก server ( เรียก GET)
    try {
      fetch('http://localhost:8000/newtondivided')
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
        method : "newton",
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

  let dp = [[]];

  function devided(ini , i , j){
    if(i == j) 
      return ini[j].fx;
    if(dp[i][j] != -1)
      return dp[i][j];

    return dp[i][j] = (devided(ini,i,j+1) - devided(ini,i-1,j))/(ini[i].x - ini[j].x);
  }

  const handleCalculate = () => {
    if (!xValue || points.some(p => p.x === '' || p.fx === '')) {
      alert("⚠️ นายท่านครับ ได้โปรด กรอก ข้อ มูล ให้ ครบ ก่อน นะ ครับ");
      return;
    }
    // console.log('X value:', xValue);
    // console.log('Points:', points);
    let x = parseFloat(xValue)
    let n = parseInt(numPoints)
    let data = []
    let point = []
    setAns(0)

    dp = Array.from({ length: n }, () => Array(n).fill(-1));
    // console.table(dp)
    // dp[0][0] = 99;
    // console.table(dp)

    let initial = points.slice(0, n).map(p => ({
      x: parseFloat(p.x),
      fx: parseFloat(p.fx)
    }));

    let C = []
    let result = 0;
    for (let i = 0; i < n; i++) {
      C.push(devided(initial, i, 0));
      data.push({
        i: parseInt(i),
        Ci: C[i]
      });
      point.push({
        x : initial[i].x,
        fx : initial[i].fx
      })

      let temp = C[i];
      for (let j = 0; j < i; j++) {
        temp *= (x - initial[j].x);
      }
      result += temp; // <--- เก็บผลรวมที่นี่
    }

    point.sort((a, b) => a.x - b.x);
    setplot(point)
    setAns(result);
    setC(data) 
    setCal(true)
    PushDataBase()

  };

  return (

    <>
      <Nav current={'newton'}></Nav>
      <div className='EquationBox'>
        <h1>
            Newton Divided Different
        </h1>

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
        <h2>
            Fx is {answer}
        </h2>
        
        )}
        
        {CI.length > 0 && (
            <Table Iterations ={CI}></Table>
        )}

        {plotgraph.length > 0 && (
            <Graph Points={plotgraph} />
        )}
        

      </div>
    </>
  );
}

export default NewtonDivided;