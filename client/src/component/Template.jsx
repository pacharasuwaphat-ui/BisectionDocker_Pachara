import { useState } from 'react';
import axios from "axios";
import { evaluate } from "mathjs";
import Graph from '../component/Graph';
import TableIteration from '../component/TableIteration';
import Nav from '../component/Menu';

function RootTemplate({ methodName, apiPath, calculateFunction }) {
  const [equation, setEquation] = useState("");
  const [x1, setX1] = useState("");
  const [x2, setX2] = useState("");
  const [error, setError] = useState("");
  const [iterations, setIterations] = useState([]);
  const [oldProblems, setOldProblems] = useState([]);
  const [selected, setSelected] = useState("");
  const [showOld, setShowOld] = useState(false);

  // ดึงข้อมูลเก่าจาก Database
  async function fetchOldProblems() {
    try {
      const res = await fetch(`http://localhost:8000/${apiPath}`);
      const data = await res.json();
      setOldProblems(data);
      setShowOld(true);
    } catch (err) {
      console.error(err);
    }
  }

  // บันทึกข้อมูลใหม่ลงฐานข้อมูล
  async function pushToDB() {
    try {
      const payload = { equation, x1, x2, error };
      await axios.post(`http://localhost:8000/${apiPath}`, payload);
    } catch (err) {
      console.error(err);
    }
  }

  // คำนวณตามเมธอด (ส่งฟังก์ชันเข้ามา)
  function handleCalculate() {
    if (!equation || !x1 || (!x2 && methodName !== "One Point") || !error) {
      alert("กรุณากรอกข้อมูลให้ครบก่อนคำนวณ");
      return;
    }

    const result = calculateFunction(equation, x1, x2, error);
    setIterations(result);
    pushToDB();
  }

  return (
    <>
      <Nav />
      <div className="EquationBox">
        <h1>{methodName} Method</h1>

        {!showOld && (
          <>
            <div className="Textinput">
              <input
                type="text"
                placeholder="Equation"
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                className="EquationInput"
              />
              <input
                type="text"
                placeholder="x1"
                value={x1}
                onChange={(e) => setX1(e.target.value)}
                className="X"
              />
              {methodName !== "One Point" && (
                <input
                  type="text"
                  placeholder="x2"
                  value={x2}
                  onChange={(e) => setX2(e.target.value)}
                  className="X"
                />
              )}
              <input
                type="text"
                placeholder="Error"
                value={error}
                onChange={(e) => setError(e.target.value)}
                className="X"
              />
            </div>

            <center>
              <button onClick={handleCalculate}>Calculate</button>
              <button onClick={fetchOldProblems}>Get Old Problem</button>
            </center>
          </>
        )}

        {showOld && (
          <div>
            <h3>Old Problems</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              {oldProblems.map((item, index) => (
                <div key={index}>
                  <label>
                    <input
                      type="radio"
                      value={item.equation}
                      checked={selected === item.equation}
                      onChange={(e) => setSelected(e.target.value)}
                    />
                    {`${item.equation} | x1=${item.xl}, x2=${item.xr}, error=${item.error}`}
                  </label>
                </div>
              ))}
            </form>
            <center>
              <button onClick={() => setShowOld(false)}>Back</button>
            </center>
          </div>
        )}

        {iterations.length > 0 && (
          <>
            <TableIteration Iterations={iterations} />
            <Graph Equation={equation} Iterations={iterations} />
          </>
        )}
      </div>
    </>
  );
}

export default RootTemplate;
