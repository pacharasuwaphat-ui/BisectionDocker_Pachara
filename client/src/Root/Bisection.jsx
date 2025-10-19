// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useState } from 'react'
import { e, evaluate, im } from "mathjs";
import Graph from '../component/Graph';
import Table from '../component/TableIteration'
// import Dropdown from './component/dropdown'
import axios from "axios"; 
import Nav from './Menu'

function Bisection() {

  const [value, setValue] = useState("");

  const [Equation, setText] = useState("");
  const [XL, setXL] = useState("");
  const [XR, setXR] = useState("");
  const [Er, seteR] = useState("");
  const [Iterations, setIterations] = useState([]);
  const [plotgraph, setpoint] = useState([]);
  const [Old, setOld] = useState([]);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(true);
  
  function fetchDatabase(){
    // fetch คือขอ data จาก server ( เรียก GET)
    try {
      fetch('http://localhost:8000/Bisection')
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
        xr : XR,
        xl : XL,
        error : Er
      }
      console.log('submit data', data)
      const response = await axios.post('http://localhost:8000/Bisection', data)
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

  function Oldcal(e){
    e.preventDefault();
    const selected = Old.find(item => item.equation === value);
    if (selected) {
      setText(selected.equation);
      setXL(selected.xl);
      setXR(selected.xr);
      seteR(selected.error);
    }
    Cancel()
  }

  function Calculation(){
    if(Equation === "" || XL === "" || XR === "" || Er === "")  {
      alert("ท่านสุภาพบุรุษ/สุภาพสตรีอาจจะมีครรภ์หรือไม่มีก็แล้วแต่ แต่ท่านกรอกข้อมูลไม่ครบนะไอหนู");
      return;
    }
    let xl = parseFloat(XL);
    let xr = parseFloat(XR);
    let xm = (xl+xr)/2;
    let Error;
    let xmo;
    let data = [];
    let point = [];
    let iteration = 1;
    if(Fx(xm)*Fx(xr) > 0){
      xr = xm;
    }
    else{
      xl = xm;
    }
    do{
      xmo = xm;
      xm = (xl+xr)/2;
      if(Fx(xm)*Fx(xr) > 0){
        xr = xm;
      }
      else{
        xl = xm;
      }

      Error = Math.abs((xm-xmo)/xm);
      data.push({
        iteration: iteration,
        xl: xl,
        xr: xr,
        xm: xm,
        error: Error
      });
      point.push({
        x: xm,
        fx: Fx(xm)
      });
      iteration++;

    }while(Error > Er);

    point.sort((a, b) => a.x - b.x);
    setIterations(data)
    setpoint(point)
    PushDataBase()

  }
      
  return (
    <>
        <Nav current={'Bisection'}></Nav>
        <div className="EquationBox">

            <h1>
            Bisection Method
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
                value = {XL} 
                onChange={(e) => setXL(e.target.value)} // อัพเดท state เมื่อพิมพ์
                placeholder="xL"
                className="X"
                />
                <input
                type= "text"
                value = {XR} 
                onChange={(e) => setXR(e.target.value)} // อัพเดท state เมื่อพิมพ์
                placeholder="xR"
                className="X"
                />
                <input
                type= "text"
                value = {Er} 
                onChange={(e) => seteR(e.target.value)} // อัพเดท state เมื่อพิมพ์
                placeholder="Error"
                className="X"
                />
            </div>
            <center>
                <button onClick={() => Calculation(false)}>Calculate</button>
            </center>
            <center>
                <button onClick={getOldProblem}>Get Old Problem</button>
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
                    {items.equation + ", Xl = " + items.xl + ", Xr = " + items.xr + ", Error = " + items.error + ", "}
                    </label>
                    </center>
                ))}
                
                <center>
                    <button type="submit">Select</button>
                </center>
                </form>
            </div>
            <center>
                <button onClick={Cancel}>Cancel</button>
            </center>
            </div>
            )}
            
            {/* Table of root */}
        {Iterations.length > 0 && Equation && (
            <Table Iterations ={Iterations}></Table>
        )}

        {Iterations.length > 0 && Equation && (
            <Graph Points={plotgraph} />
        )}

        </div>
    </>
  )
}

export default Bisection