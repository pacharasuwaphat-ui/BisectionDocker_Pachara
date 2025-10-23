import { useState } from 'react'
import { evaluate, im } from "mathjs";
import Graph from '../component/Graph';
import Table from '../component/TableIteration'
import axios from "axios"; 
import Nav from './Menu'

function Secant() {

  const [value, setValue] = useState("");

  const [Equation, setText] = useState("");
  const [X0, setX0] = useState("");
  const [X1, setX1] = useState("");
  const [Er, seteR] = useState("");
  const [Iterations, setIterations] = useState([]);
  const [plotgraph, setpoint] = useState([]);
  const [Old, setOld] = useState([]);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(true);
  
  function fetchDatabase(){
    // fetch คือขอ data จาก server ( เรียก GET)
    // ------- ตรงนี้ --------
    try {
      fetch('http://localhost:8000/Secant')
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
      // ------- ตรงนี้ --------
      const data = {
        equation : Equation,
        xl : X0,
        xr : X1,
        error : Er,
        method : "secant"
      }
      console.log('submit data', data)
      const response = await axios.post('http://localhost:8000/root2x', data)
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
    // ------- ตรงนี้ ---------
    e.preventDefault();
    const selected = Old.find(item => item.equation === value);
    if (selected) {
      setText(selected.equation);
      setX0(selected.xl);
      setX1(selected.xr);
      seteR(selected.error);
    }
    Cancel()
  }

  function Calculation(){
    if(Equation === "" || X0 === "" || Er === "")  {
      alert("ท่านสุภาพบุรุษ/สุภาพสตรีอาจจะมีครรภ์หรือไม่มีก็แล้วแต่ แต่ท่านกรอกข้อมูลไม่ครบนะไอหนู");
      return;
    }
    let x0 = parseFloat(X0);
    let x1 = parseFloat(X1);
    let x2;
    let Error;
    let data = [];
    let point = [];
    let iteration = 1;
    
     // วนคำนวณตามสูตร Secant: x_{i+1} = x_i - f(x_i) * (x_i - x_{i-1}) / (f(x_i) - f(x_{i-1}))
    do {
      const fx0 = Fx(x0);
      const fx1 = Fx(x1);

      // กันไม่ให้หารด้วยศูนย์
      if (fx1 - fx0 === 0) {
        alert("ไม่สามารถคำนวณได้ เนื่องจาก f(x1) - f(x0) = 0");
        break;
      }

      x2 = x1 - (fx1 * (x1 - x0)) / (fx1 - fx0);
      Error = Math.abs((x2 - x1) / x2);

      data.push({
        iteration: iteration,
        x0: x0,
        fx0: fx0,
        error: Error
      });
      point.push({
        x: x0,
        fx: fx0
      });
      // เตรียมค่ารอบถัดไป
      iteration++;
      x0 = x1;
      x1 = x2;

    } while (Error > Er && iteration <= 100); // จำกัดสูงสุด 100 รอบ ป้องกันลูปไม่จบ

    point.sort((a, b) => a.x - b.x);
    setIterations(data)
    setpoint(point)
    PushDataBase()


  }
      
  return (
    <>
        <Nav current={'Secant'}></Nav>
        <div className="EquationBox">

            <h1>
            Secant Iteration Method
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
                placeholder="X0"
                className="X"
                />
                <input
                type= "text"
                value = {X1} 
                onChange={(e) => setX1(e.target.value)} // อัพเดท state เมื่อพิมพ์
                placeholder="X1"
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

            {/* ----------------------ตรงนี้------------------------ */}

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
                    {items.equation + ", X0 = " + items.xl + ", X1 = " + items.xr + ", Error = " + items.error + ", "}
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
            <Graph  Points={plotgraph} />
        )}

        </div>
    </>
  )
}

export default Secant