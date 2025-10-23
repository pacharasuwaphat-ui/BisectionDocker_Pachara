import React from 'react'
import { useState } from 'react'
import { e, evaluate, im , abs } from "mathjs";
import Graph from '../component/Graph';
import Table from '../component/TableIteration'
import axios from "axios"; 
import Nav from './Menu'
import './UI.css'

function Conjugate() {

  const [value, setValue] = useState("");

  const [Size , setSize] = useState(0);
    const [A, setA] = useState([
    []
  ]);
  const [X, setX] = useState([]);
  const [B, setB] = useState([]);
  const [X0, setX0] = useState([]);

  const [Equation, setText] = useState("");
  const [Iterations, setIterations] = useState([]);
  const [plotgraph, setpoint] = useState([]);
  const [Old, setOld] = useState([]);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(true);

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
        newX.push(null)
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
    newPoints[i][j] = value;
    setA(newPoints);
  };

  const oneDChange = (i, name, value) => {
    if(name = 'x'){
        const newPoints = [...X];
        newPoints[i] = value;
        setX(newPoints);
    }
    if(name = 'b'){
        const newPoints = [...B];
        newPoints[i] = value;
        setB(newPoints);
    }
    if(name = 'x0'){
        const newPoints = [...X0];
        newPoints[i] = value;
        setX0(newPoints);
    }
  };


  function Calculation(){
    
  }


  return (
    <>
        <Nav current={'conjugate'}></Nav>
        <div className="EquationBox">

            <h1>
            Conjugate Gradiant Method
            </h1>
            {showNew && (
            <div>
            <div className='Textinput'>
            <button className="btn btn-decrease" onClick={() => updateNumPoints(-1)}>-</button>
              <span className="Count">       {    Size     }        </span>
              <button className="btn btn-increase" onClick={() => updateNumPoints(1)}>+</button>
            </div>
            <center>
                <button onClick={() => Calculation()}>Calculate</button>
            </center>   
            </div>
            )}
            <div className='matrix'>


                {A.slice(0, Size).map((point, i) => 
                    <div >
                    {point.slice(0, Size).map((p, j) => (
                        <input
                            type="number"
                            placeholder={`  a${i}${j}`}
                            value={p}
                            onChange={(e) => handleChange(i,j, e.target.value)}
                            className='element-a'
                        />
                    ))}
                    <input
                        type="number"
                        placeholder={`  x${i}`}
                        value={X[i]}
                        onChange={(e) => oneDChange(i,'x', e.target.value)}
                        className='element-x'
                    />
                    <input
                        type="number"
                        placeholder={`  b${i}`}
                        value={B[i]}
                        onChange={(e) => oneDChange(i,'b', e.target.value)}
                        className='element-a'
                    />
                    </div> 
                )}
            </div>
            {/* <h2>X0</h2> */}
            <div className='x0'>
                {X0.slice(0,Size).map((p,i) =>(
                    <input
                        type="number"
                        placeholder={` x0[${i}]`}
                        value={X0[i]}
                        onChange={(e) => oneDChange(i,'x0', e.target.value)}
                        className='element-a'
                    />
                ))}
            </div>
            
            {/* Table of root */}
        {/* {Iterations.length > 0 && Equation && (
            <Table Iterations ={Iterations}></Table>
        )}

        {Iterations.length > 0 && Equation && (
            <Graph Points={plotgraph} />
        )} */}

        </div>
    </>
  )
}

export default Conjugate