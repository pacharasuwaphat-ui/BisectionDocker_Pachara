import React from "react";
import Plot from "react-plotly.js";

function SurfacePlot() {
  // กำหนดค่าข้อมูลแกน X, Y
  const xValues = Array.from({ length: 30 }, (_, i) => i - 15);
  const yValues = Array.from({ length: 30 }, (_, i) => i - 15);

  // สร้าง Z เป็นฟังก์ชัน f(x, y)
  const zValues = yValues.map(y =>
    xValues.map(x => Math.pow(x, 2) - Math.pow(y, 2))
  );

  return (
    <div className="plot3d" style={{ backgroundColor: "#1e2329", minHeight: "100vh", padding: "20px" }}>
      <Plot 
        data={[
          {
            z: zValues,
            x: xValues,
            y: yValues,
            type: "surface",
            colorscale: "Jet",
            showscale: true,
          },
        ]}
        layout={{
          autosize: true,
          title: "",
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          scene: {
            xaxis: { title: "X Axis" },
            yaxis: { title: "Y Axis" },
            zaxis: { title: "Z Axis" },
          },
        }}
        style={{ width: "100%", height: "90vh" }}
        useResizeHandler
      />
    </div>
  );
}
export default SurfacePlot