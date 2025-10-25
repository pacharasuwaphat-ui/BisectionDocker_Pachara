import React from 'react'
import { useState } from 'react'
import { multiply   } from "mathjs";
import Graph from '../component/Graph';
import Table from '../component/TableIteration'
import axios from "axios"; 
import Nav from './Menu'
import './UI.css'

function GuassSeidel() {

  const [value, setValue] = useState("");

  const [Size , setSize] = useState(0);
    const [A, setA] = useState([
  ]);
  const [X, setX] = useState([]);
  const [B, setB] = useState([]);
  const [X0 , setX0] = useState([]);
  const [Er, seteR] = useState("");

  const [Iterations, setIterations] = useState([]);
  const [Old, setOld] = useState([]);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(true);

  function fetchDatabase(){
    // fetch คือขอ data จาก server ( เรียก GET)
    try {
      fetch('http://localhost:8000/guassseidel')
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

  function Oldcal(e){
    e.preventDefault();
    const selected = Old.find(item => item.id === Number(value));
    if (selected) {
      setSize(selected.n);
      setA(selected.A);
      setB(selected.B);
      setX0(selected.X0);
      seteR(selected.error);
    }
    Cancel()
  }

  const PushDataBase = async() =>{
    try{
      const data = {
        n : Size,
        error : Er,
        method : "guassseidel",
        A : A,
        B : B,
        X0 : X0
        
      }
      console.log('submit data', data)
      const response = await axios.post('http://localhost:8000/linearAlgebra', data)
      console.log('response' , response.data)

    }catch(error){
      if(error.response){
        console.log(error.response.data.message)
      }
    }
  }

    // เพิ่มหรือลดจำนวนจุด
  const updateNumPoints = (delta) => {
    const newCount = Math.min(Math.max(1, Size + delta) , 5);
    setSize(newCount);

    let newPoints = [];
    let newX = [];
    let newB = [];
    let newX0 = [];
    for(let i=0;i<newCount;i++){
        let temp = [];
        for(let j=0;j<newCount;j++){
            temp.push(null)
        }
        newPoints.push(temp);
        newX.push('x'+i)
        newB.push(null)
        newX0.push(null)
        
    }
    
    setA(newPoints);
    setX(newX);
    setB(newB);
    setX0(newX0);

  };

  // อัปเดตค่าจุด x และ f(x)
  const handleChange = (i, j, value) => {
    const newPoints = [...A];
    newPoints[i][j] = parseFloat(value);
    setA(newPoints);
  };

  const oneDChange = (i, name, value) => {
    if(name === 'b'){
        const newPoints = [...B];
        newPoints[i] = parseFloat(value);
        setB(newPoints);
    }
    if(name === 'x0'){
        const newPoints = [...X0];
        newPoints[i] = parseFloat(value);
        setX0(newPoints);
    }
  };

  function Calculation(){
    const N = Size;
    let data = [];
    const error = parseFloat(Er)
    let xi = []

    // initial
    for(let i=0;i<N;i++)xi.push(X0[i])
    
    let it = 0
    while(1){
      it++;
      const xBefore = structuredClone(xi);
      for(let k=0;k<N;k++){
        xi[k] = B[k]
        for(let j=0;j<N;j++){
          if(j == k) continue
          xi[k] -= A[k][j]*xi[j]
        }
        xi[k] /= A[k][k]
      }
      let obj = { Iterations: it };
      let Log = true
      let xError = []
      for(let k=0;k<N;k++){
        xError.push(Math.abs((xi[k]-xBefore[k])/xi[k]))
        if(xError[k] > error) Log = false
      }

      xi.forEach((p, i) => {
        obj['x' + (i + 1)] = p;   // ตั้งชื่อ key แบบไดนามิก
      });
      xError.forEach((p, i) => {
        obj['error' + (i + 1)] = p;   // ตั้งชื่อ key แบบไดนามิก
      });
      data.push(obj);
      if(Log || it == 100) break;
    }
    
    
    setIterations(data);
    PushDataBase()
  }


  return (
    <>
        <Nav current={'guassseidel'}></Nav>
        <div className="EquationBox">

            <h1>
            Guass-Seidel Iterations
            </h1>
            <div className='Textinput'>
            <button className="btn btn-decrease" onClick={() => updateNumPoints(-1)}>-</button>
              <span className="Count">       {    Size     }        </span>
              <button className="btn btn-increase" onClick={() => updateNumPoints(1)}>+</button>
              {showNew && (<input
                type= "text"
                value = {Er} 
                onChange={(e) => seteR(e.target.value)} // อัพเดท state เมื่อพิมพ์
                placeholder="Error"
                className="X"
                />)}
            </div>
            {showNew && (
              
            <div>
              
            {A.slice(0, Size).map((point, i) => 
                <div key={`row-${i}`}>
                    {point.slice(0, Size).map((p, j) => (
                    <input
                        key={`a-${i}-${j}`}   //  เพิ่ม key ให้ input
                        type="number"
                        placeholder={`  a${i}${j}`}
                        value={p ?? ''}
                        onChange={(e) => handleChange(i, j, e.target.value)}
                        className="element-a"
                    />
                    ))}
                    <input
                    key={`x-${i}`}         //  key สำหรับช่อง x
                    type="text"
                    placeholder={`  x${i}`}
                    value={X[i] ?? ''}
                    onChange={(e) => oneDChange(i, 'x', e.target.value)}
                    className="element-x"
                    disabled
                    />
                    <input
                    key={`b-${i}`}         //  key สำหรับช่อง b
                    type="number"
                    placeholder={`  b${i}`}
                    value={B[i] ?? ''}
                    onChange={(e) => oneDChange(i, 'b', e.target.value)}
                    className="element-a"
                    />
                </div>
                )}
                <div className='x0'>
                {X0.slice(0,Size).map((p,i) =>(
                    <input
                        key={`X0-${i}`}
                        type="number"
                        placeholder={` x0[${i}]`}
                        value={X0[i]  ?? ''}
                        onChange={(e) => oneDChange(i,'x0', e.target.value)}
                        className='element-a'
                    />
                ))}
            </div>
            <center>
                <button className='btn btn-calc' onClick={() => Calculation()}>Calculate</button>
            </center>
            <center>
                <button className='btn btn-calc' onClick={() => getOldProblem()}>Get Old</button>
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
                          value={items.id}
                          checked={value === items.id}
                          onChange={(e) => setValue(Number(e.target.value))}
                      />
                      {" N = " + items.n + ", error = " + items.error + ", A -> [" }
                      {items.A.map((p, i) => (
                        <span key={i}>
                          {"["}
                          {p.map((q,j)=> (
                          <span key={j}>
                            {q + ','}
                          </span> 
                          ))}
                          {"]"}
                        </span>
                      ))}
                      {"] B -> [" }
                      {items.B.map((p, i) => (
                        <span key={i}>
                          {p + ','}
                        </span>
                      ))}{"]" }
                      {" X0 -> [" }
                      {items.X0.map((p, i) => (
                        <span key={i}>
                          {p + ','}
                        </span>
                      ))}{"]" }
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
            
        {Iterations.length > 0 && (
            <Table Iterations ={Iterations}></Table>
        )}

        </div>
    </>
  )
}

export default GuassSeidel