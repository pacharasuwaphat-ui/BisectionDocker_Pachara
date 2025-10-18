import Plot from 'react-plotly.js';
import { evaluate } from "mathjs";
import { useState } from "react";

function Graph({ Equation, Iterations }) {

  function safeEvaluate(expr, scope) {
  try {
    return evaluate(expr, scope);
  } catch (err) {
    // console.log("Invalid equation:", expr);
    return NaN; // หรือ 0, null ตามต้องการ
  }
}

  
    // สร้างค่า x และ y สำหรับกราฟ
  let xValues = [];
  let yValues = [];
  for (let x = -100; x <= 100; x += 0.1) {
    xValues.push(x);
    yValues.push(safeEvaluate(Equation, { x }));
  }

  // จุดจาก iteration (xm แต่ละรอบ)
  const xmPoints = Iterations.map(item => item.xm);
  const xmValues = xmPoints.map(x => safeEvaluate(Equation, { x }));
  
  return (
    <Plot
      data={[
        {
          x: xValues,
          y: yValues,
          type: "scatter",
          mode: "lines",
          name: "f(x)"
        },
        {
          x: xmPoints,
          y: xmValues,
          type: "scatter",
          mode: "markers+text",
          name: "Iterations",
          marker: { color: "red", size: 8 },
          text: Iterations.map(i => `i=${i.iteration}`),
          textposition: "top center"
        }
      ]}
      layout={{
        width: 1400,
        height: 1000,
        title: `Graph of f(x) = ${Equation}`,
        // xaxis: { title: "x" ,range:[-10000,10000]},
        // yaxis: { title: "f(x)",range:[-5000,5000] }
        xaxis: { title: "x" },
        yaxis: { title: "f(x)"}
      }}
    />
  );
}

export default Graph;
