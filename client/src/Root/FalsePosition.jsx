import React from "react";
import axios from "axios";
import BaseRootEquation from "./BaseRootEquation";

class FalsePosition extends BaseRootEquation {
  async fetchDatabase() {
    const res = await fetch("http://localhost:8000/FalsePosition");
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
      method: "false",
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

    const Fx = (x) => this.Fx(x);
    let xl = parseFloat(XL);
    let xr = parseFloat(XR);
    let xm, Error;
    let iteration = 1;
    let data = [];
    let point = [];

    do {
      xm = (xl * Fx(xr) - xr * Fx(xl)) / (Fx(xr) - Fx(xl));
      if (Fx(xm) * Fx(xr) > 0) xr = xm;
      else xl = xm;
      Error = Math.abs(Fx(xm));
      data.push({ iteration, xl, xr, xm, error: Error });
      point.push({ x: xm, fx: Fx(xm) });
      iteration++;
    } while (Error > Er && iteration < 100);

    point.sort((a, b) => a.x - b.x);
    this.setState({ Iterations: data, plotgraph: point }, this.PushDataBase);
  }

  render() {
    return this.renderBaseLayout("False-Position");
  }
}

export default FalsePosition;
