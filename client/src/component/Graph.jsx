import Plot from "react-plotly.js";

function Graph({ Points = [], title = "Graph" }) {
  if (!Points || Points.length === 0) return null;

  Points.sort((a, b) => a.x - b.x);

  const xValues = Points.map(p => p.x);
  const yValues = Points.map(p => p.fx);

  return (
    <Plot
      data={[
        {
          x: xValues,
          y: yValues,
          type: "scatter",
          mode: "markers+lines",
          name: "Data Points",
          line: { color: "green" },
          marker: { color: "red", size: 8 },
        },
      ]}
      layout={{
        width: 1200,
        height: 700,
        title: { text: title, font: { size: 20 } },
        xaxis: {
          title: "x",
          zeroline: true,
          showgrid: true,
          gridcolor: "#eee",
        },
        yaxis: {
          title: "f(x)",
          zeroline: true,
          showgrid: true,
          gridcolor: "#eee",
        },
        plot_bgcolor: "#fff",
        paper_bgcolor: "#f9fbfd",
        margin: { l: 60, r: 40, t: 60, b: 60 },
      }}
      config={{ displayModeBar: false }}
    />
  );
}

export default Graph;
