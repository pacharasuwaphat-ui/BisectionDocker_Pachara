import React from 'react'
import { useState } from 'react'
import { multiply   } from "mathjs";
import Table from '../component/TableIteration'
import axios from "axios"; 
import Nav from './Menu'
import './UI.css'

function LU() {

  const [value, setValue] = useState("");

  const [Size , setSize] = useState(0);
    const [A, setA] = useState([
  ]);
  const [X, setX] = useState([]);
  const [B, setB] = useState([]);

  const [Iterations, setIterations] = useState([]);
  const [Old, setOld] = useState([]);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(true);

  function fetchDatabase(){
    // fetch คือขอ data จาก server ( เรียก GET)
    try {
      fetch('http://localhost:8000/lu')
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
    }
    Cancel()
  }

  const PushDataBase = async() =>{
    try{
      const data = {
        n : Size,
        error : 0,
        method : "lu",
        A : A,
        B : B
        
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
    for(let i=0;i<newCount;i++){
        let temp = [];
        for(let j=0;j<newCount;j++){
            temp.push(null)
        }
        newPoints.push(temp);
        newX.push('x'+i)
        newB.push(null)
        
    }
    
    setA(newPoints);
    setX(newX);
    setB(newB);

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
  };

  function Calculation(){
    const N = Size;
    let data = [];
    let L = [];
    let U = [];
    for(let i=0;i<N;i++){
      let tempL = [];
      let tempU = []
      for(let j=0;j<N;j++){
        tempL.push(0)
        if(i==j)tempU.push(1)
        else tempU.push(0)
      }
      L.push(tempL)
      U.push(tempU)
    }

    for(let i=0;i<N;i++){
      // Find L
      for(let j=i;j<N;j++){
        L[j][i] = A[j][i]
        for(let k=0;k<i;k++){
          L[j][i] -= L[j][k]*U[k][i]
        }
      }
      // Find U
      for(let j=i+1;j<N;j++){
        U[i][j] = A[i][j]
        for(let k=0;k<i;k++){
          U[i][j] -= L[i][k]*U[k][j]
        }
        U[i][j] /= L[i][i]
      }
    }

    // forward sub
    let Y = []
    for(let i=0;i<N;i++) Y.push(0);
    for(let i=0;i<N;i++){
        let temp = B[i]
        for(let j=0;j<i;j++){
            temp -= L[i][j]*Y[j]
        }
        Y[i] = temp/L[i][i]
    }

    // back sub
    let backsub = []
    for(let i=0;i<N;i++) backsub.push(0);
    for(let i=N-1;i>=0;i--){
        let temp = Y[i]
        for(let j=N-1;j>i;j--){
            temp -= U[i][j]*backsub[j]
        }
        backsub[i] = temp/U[i][i]
        data.push({
            xi : 'x'+(i+1),
            ans : backsub[i]
        })
    }

    setIterations(data);
    PushDataBase()
  }


  return (
    <>
        <Nav current={'lu'}></Nav>
        <div className="EquationBox">

            <h1>
            LU Decomposition
            </h1>
            <div className='Textinput'>
            <button className="btn btn-decrease" onClick={() => updateNumPoints(-1)}>-</button>
              <span className="Count">       {    Size     }        </span>
              <button className="btn btn-increase" onClick={() => updateNumPoints(1)}>+</button>
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

export default LU