import { useState } from 'react'
import { e, evaluate, im } from "mathjs";
import Graph from '../component/Graph';
import Table from '../component/TableIteration'
import axios from "axios"; 
import Nav from './Menu'

function OnePoint() {

  const [value, setValue] = useState("");

  const [Equation, setText] = useState("");
  const [X0, setX0] = useState("");
  const [Er, seteR] = useState("");
  const [Iterations, setIterations] = useState([]);
  const [Old, setOld] = useState([]);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(true);
  
  function fetchDatabase(){
    // fetch คือขอ data จาก server ( เรียก GET)
    // ------- ตรงนี้ --------
    fetch('http://localhost:8000/OnePoint')
    .then((response) =>{
      return response.json()
    })
    .then((responseData) =>{
      setOld(responseData)
    })
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
        x : X0,
        error : Er
      }
      console.log('submit data', data)
      const response = await axios.post('http://localhost:8000/OnePoint', data)
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
      setX0(selected.x);
      seteR(selected.error);
    }
    Cancel()
  }

  function Calculation(){
    if(Equation === "" || X0 == "" || Er === "")  {
      alert("ท่านสุภาพบุรุษ/สุภาพสตรีอาจจะมีครรภ์หรือไม่มีก็แล้วแต่ แต่ท่านกรอกข้อมูลไม่ครบนะไอหนู");
      return;
    }
    let x0 = parseFloat(X0);
    let x1 ;
    let Error;
    let data = [];
    let iteration = 1;

    // ทำการวนลูปคำนวณตามสูตร x_{i+1} = f(x_i)
  do {
    x1 = Fx(x0);                        // คำนวณค่าใหม่จากสมการ
    Error = Math.abs((x1 - x0) / x1);   // หา relative error
    data.push({
      iteration: iteration,
      x0: x0,
      x1: x1,
      error: Error
    });
    iteration++;
    x0 = x1;                            // เตรียมค่าใหม่สำหรับรอบถัดไป
  } while (Error > Er && iteration < 100); // กันลูปไม่รู้จบ (สูงสุด 100 รอบ)
    

    setIterations(data)
    PushDataBase()

  }
      
  return (
    <>
        <Nav current={'Onepoint'}></Nav>
        <div className="EquationBox">

            <h1>
            One-Point Iteration Method
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
                    {items.equation + ", X0 = " + items.x + ", Error = " + items.error + ", "}
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
            <Graph Equation={Equation} Iterations={Iterations} />
        )}

        </div>
    </>
  )
}

export default OnePoint