import React from "react";
import axios from "axios";
import BaseRootEquation from "./BaseRootEquation";

class Graphical extends BaseRootEquation {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      XL: "",
      XR: "",
    };
  }

  async fetchDatabase() {
    const res = await fetch("http://localhost:8000/Graphical");
    this.setState({ Old: await res.json() });
  }

  async getOldProblem() {
    this.setState({ showOld: true, showNew: false });
    await this.fetchDatabase();
  }

  async PushDataBase() {
    const { Equation, XL, XR, Er } = this.state;
    await axios.post("http://localhost:8000/root2x", {
      equation: Equation,
      xl: XL,
      xr: XR,
      error: Er,
      method: "graphical",
    });
  }

  Oldcal(e) {
    e.preventDefault();
    const selected = this.state.Old.find((item) => item.equation === this.state.value);
    if (selected) {
      this.setState({
        Equation: selected.equation,
        XL: selected.xl,
        XR: selected.xr,
        Er: selected.error,
      });
    }
    this.Cancel();
  }

  Calculation() {
    const { Equation, XL, XR, Er } = this.state;
    if (!Equation || !XL || !XR || !Er) {
      alert("กรุณากรอกข้อมูลให้ครบก่อนคำนวณ");
      return;
    }

    let xl = parseFloat(XL);
    let xr = parseFloat(XR);
    let xm = xl;
    let Error;
    let xmo = xm;
    let change = 1.0;
    let data = [];
    let point = [];
    let iteration = 1;

    for (xm = xl + change; xm <= xr; xm += change) {
      Error = Math.abs(this.Fx(xm));
      if (Error <= Er) break;
      if (xm >= xr && Math.abs(this.Fx(xm)) > Er) {
        alert("ช่วงที่กำหนดไม่สามารถหาค่าได้");
        return;
      }
      data.push({ iteration, X: xm, error: Error });
      point.push({ x: xm, fx: this.Fx(xm) });
      iteration++;
      if (this.Fx(xm) * this.Fx(xmo) < 0) {
        xr = xm;
        xl = xmo;
        xm = xl;
        change /= 10.0;
        continue;
      }
      xmo = xm;
    }

    point.sort((a, b) => a.x - b.x);
    this.setState({ Iterations: data, plotgraph: point }, this.PushDataBase);
  }

  render() {
    return this.renderBaseLayout("Graphical");
  }
}

export default Graphical;
