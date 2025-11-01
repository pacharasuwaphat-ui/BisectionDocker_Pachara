import React from "react";
import axios from "axios";
import BaseRootEquation from "./BaseRootEquation";

class Bisection extends BaseRootEquation {
  async fetchDatabase() {
    const res = await fetch("http://localhost:8000/Bisection");
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
      method: "bisection",
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
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const Fx = (x) => this.Fx(x);
    let xl = parseFloat(XL);
    let xr = parseFloat(XR);
    let xm = (xl + xr) / 2;
    let Error, iteration = 1;
    let data = [];
    let point = [];

    if (Fx(xm) * Fx(xr) > 0) xr = xm;
    else xl = xm;

    do {
      const xmo = xm;
      xm = (xl + xr) / 2;
      if (Fx(xm) * Fx(xr) > 0) xr = xm;
      else xl = xm;
      Error = Math.abs((xm - xmo) / xm);
      data.push({ iteration, xl, xr, xm, error: Error });
      point.push({ x: xm, fx: Fx(xm) });
      iteration++;
    } while (Error > Er);

    point.sort((a, b) => a.x - b.x);
    this.setState({ Iterations: data, plotgraph: point }, this.PushDataBase);
  }

  render() {
    return this.renderBaseLayout("Bisection");
  }
}

export default Bisection;
