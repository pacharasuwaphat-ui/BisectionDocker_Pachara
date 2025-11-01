import React from 'react'
import { useState } from 'react'
import { multiply , add , subtract , transpose , pow , det} from "mathjs";
import Graph from '../component/graph3d';
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
  const [Er, seteR] = useState("");

  const [Iterations, setIterations] = useState([]);
  const [plotgraph, setpoint] = useState([]);
  const [Old, setOld] = useState([]);
  const [Sym, setSym] = useState([]);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(true);
  const [showSym, setShowSym] = useState(false);

  function fetchDatabase(){
    // fetch คือขอ data จาก server ( เรียก GET)
    try {
      fetch('http://localhost:8000/conjugate')
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
        method : "conjugate",
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

  const toMatrix = (arr) => arr.map(v => [v]);

  function checkPos(){
    let N = Size
     for(let i=1;i<=N;i++){
        let temp = []
        for(let j=0;j<i;j++){
            let t = []
            for(let k=0;k<i;k++){
                t.push(A[j][k])
            }
            temp.push(t)
        }
        if(det(temp) === 0){
            alert('it not positive desfinite')
            return false;
        }
    }
    return true;
  }

  function isnotSym(){
    let N = Size
    let a = structuredClone(A);
    let at = transpose(a)
    for(let i=0;i<N;i++){
        for(let j=0;j<N;j++){
            if(!(a[i][j] === at[i][j])){
                alert('it not symmethry')
                return true;    
            }
        }
    }
    return false;
  }

  function newSym(a){
    let at = transpose(a)
    return multiply(1/2 ,add(a,at))
  }

  function Calculation(){

    if(checkPos() === false) return;

    let N = Size
    let data = []
    let error = parseFloat(Er)
    let a = structuredClone(A);
    let b = structuredClone(B);
    let x = structuredClone(X0);

    if(isnotSym()){
      setShowSym(true)
      a = newSym(a)
      setSym(structuredClone(a))
    }
    else setShowSym(false)

    // cal the iteration 0 of conjugate
    let R = subtract(multiply(a,x),b)
    let D = multiply(-1,R)
    let numerator = multiply(transpose(toMatrix(D)), toMatrix(R))[0][0];            // scalar
    let denominator = multiply(transpose(toMatrix(D)), multiply(a, toMatrix(D)))[0][0]; // scalar
    let lamda = (-1) * numerator / denominator;
    x = add(x , multiply(lamda,D))
    R = subtract(multiply(a,x),b)
    let alpha = ( multiply(transpose(toMatrix(R)),a,toMatrix(D))[0][0] )/(multiply(transpose(toMatrix(D)),a,toMatrix(D))[0][0] )
    D = add(multiply(-1,R),multiply(alpha,D))

    let it = 0
    while(1){
        it++;

        // cal iterations of conjugate
        numerator = multiply(transpose(toMatrix(D)), toMatrix(R))[0][0];            // scalar
        denominator = multiply(transpose(toMatrix(D)), multiply(a, toMatrix(D)))[0][0]; // scalar
        let lamda = (-1) * numerator / denominator;
        x = add(x , multiply(lamda,D))
        R = subtract(multiply(a,x),b)
        alpha = ( multiply(transpose(toMatrix(R)),a,toMatrix(D))[0][0] )/(multiply(transpose(toMatrix(D)),a,toMatrix(D))[0][0] )
        D = add(multiply(-1,R),multiply(alpha,D))

        let err = Math.sqrt(multiply(transpose(toMatrix(R)), toMatrix(R))[0][0]);

        // Push obj to iterations
        let obj = { Iterations: it };
        x.forEach((p, i) => {
            obj['x' + (i + 1)] = p;   // ตั้งชื่อ key แบบไดนามิก
        });
        R.forEach((p, i) => {
            obj['R' + (i + 1)] = p;   // ตั้งชื่อ key แบบไดนามิก
        });
        obj['Alpha'] = alpha
        D.forEach((p, i) => {
            obj['D' + (i + 1)] = p;   // ตั้งชื่อ key แบบไดนามิก
        });
        obj['error'] = err
        data.push(obj);

        // break

        if(err < error || it == 100) break;
    }

    setIterations(data)
    PushDataBase()
  }


  return (
    <>
        <Nav current={'conjugate'}></Nav>
        <div className="EquationBox">

            <h1>
            Conjugate Gradiant Method
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

        {showSym && (
          <div className='ndd-container'>
            <h2 className='Symhead'> Symmetry Matrix's</h2>
              <div>
              {Sym.map((p) =>(
                <div className='Symrows'>
                  {p.map((q) =>(
                    <div className='Symelement'>{q}</div>
                  ))}
                </div>
              ))}
              </div>
          </div>
        )}

            
            {/* Table of root */}
          {Iterations.length > 0 && (
            <Table Iterations ={Iterations}></Table>
        )}

        {/* <Graph></Graph> */}

        </div>
    </>
  )
}

export default Conjugate