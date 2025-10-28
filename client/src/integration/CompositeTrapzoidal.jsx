import React from 'react'
import { useState } from 'react'
import { e, evaluate, im } from "mathjs";
import { abs } from "mathjs";
import Graph from '../component/Graph';
import axios from "axios"; 
import Nav from './Menu'

function CompositeTrapzoidal() {

  const [value, setValue] = useState("");

  const [Equation, setText] = useState("");
  const [X0, setX0] = useState("");
  const [X1, setX1] = useState(""); 
  const [N, setN] = useState(""); 
  const [Answer, setAns] = useState(""); 
  const [plotgraph, setpoint] = useState([]);
  const [Old, setOld] = useState([]);
  const [HaveCal, setCal] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(true);
  
  function fetchDatabase(){
    // fetch คือขอ data จาก server ( เรียก GET)
    try {
      fetch('http://localhost:8000/compositetrape')
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
  function Cancel() {
    setShowOld(false);
    setShowNew(true);
  }

  function getOldProblem() {
    setShowOld(true);
    setShowNew(false);
    fetchDatabase()
  }

  const PushDataBase = async() =>{
    try{
      const data = {
        equation : Equation,
        x0 : X0,
        x1 : X1,
        n : N,
        method : 'trapezoidal'
      }
      console.log('submit data', data)
      const response = await axios.post('http://localhost:8000/compositeintegration', data)
      console.log('response' , response.data)

    }catch(error){
      if(error.response){
        console.log(error.response.data.message)
      }
    }
  }


  function Fx(i){
    let scope = { x: i}; 
    return  evaluate(Equation, scope);
  }

  // นำค่าที่ดึงจาก database มาใส่ให้แต่ละค่า
  function Oldcal(e){
    e.preventDefault();
    const selected = Old.find(item => item.equation === value);
    if (selected) {
      setText(selected.equation);
      setX1(selected.x1);
      setX0(selected.x0);
      setN(selected.n);
    }
    Cancel()
  }

  function Calculation(){
    if(Equation === "" || X1 === "" || X0 === "")  {
      alert("ท่านสุภาพบุรุษ/สุภาพสตรีอาจจะมีครรภ์หรือไม่มีก็แล้วแต่ แต่ท่านกรอกข้อมูลไม่ครบนะไอหนู");
      return;
    }
    if(X1 < X0)  {
      alert("X1 ต้อง >= X0 นะครับ");
      return;
    }
    let x1 = parseFloat(X1)
    let x0 = parseFloat(X0)
    let point = [];
    let ans = 0
    let n = parseInt(N);
    let h = (x1 - x0) / n;

    // เก็บค่าทุกจุด และคำนวณผลรวม
    for (let i = 0; i <= n; i++) {
      let xi = x0 + i * h;
      let fxi = Fx(xi);
      point.push({
        x: xi,
        fx: fxi
      });

      // ใช้สูตร Composite Trapezoidal
      if (i === 0 || i === n) ans += fxi;
      else ans += 2 * fxi;
    }
    ans = (h / 2) * ans;

    setAns(ans)
    setCal(true)
    setpoint(point)
    PushDataBase()

  }


  return (
    <>
        <Nav current={'compositetrape'}></Nav>
        <div className="EquationBox">

            <h1>
            Composite Trapezoidal
            </h1>
            {showNew && (
            <div>
            <div className='Textinput'>
                <input
                type= "text"
                value = {Equation} 
                onChange={(e) => setText(e.target.value)} // อัพเดท state เมื่อพิมพ์
                placeholder="input your equation"
                className="EquationInput"
                />
                <input
                type= "text"
                value = {X0} 
                onChange={(e) => setX0(e.target.value)} // อัพเดท state เมื่อพิมพ์
                placeholder="x0"
                className="X"
                />
                <input
                type= "text"
                value = {X1} 
                onChange={(e) => setX1(e.target.value)} // อัพเดท state เมื่อพิมพ์
                placeholder="x1"
                className="X"
                />
                <input
                type= "text"
                value = {N} 
                onChange={(e) => setN(e.target.value)} // อัพเดท state เมื่อพิมพ์
                placeholder="n"
                className="X"
                />
            </div>
            <center>
                <button className='btn btn-calc' onClick={() => Calculation()}>Calculate</button>
            </center>
            <center>
                <button className='btn btn-calc' onClick={getOldProblem}>Get Old Problem</button>
            </center>
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
                        value={items.equation}
                        checked={value === items.equation}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    {items.equation + ", X0 = " + items.x0 + ", X1 = " + items.x1 + ", N = " + items.n }
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
            
            {/* Table of root */}

        {HaveCal && (
        <div className='ndd-container'>
            <h2 className='Header-answer'>
                Area below graph is
            </h2>
            <h2>
                {Answer}
            </h2>
        </div>
        )}

        {plotgraph.length > 0 && (
            <Graph Points={plotgraph} />
        )}

        </div>
    </>
  )
}

export default CompositeTrapzoidal