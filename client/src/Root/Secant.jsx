import React from "react";
import axios from "axios";
import BaseRootEquation from "./BaseRootEquation";

class Secant extends BaseRootEquation {
  async fetchDatabase() {
    const res = await fetch("http://localhost:8000/Secant");
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
      method: "secant",
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
    let x0 = parseFloat(XL);
    let x1 = parseFloat(XR);
    let x2, Error;
    let data = [];
    let point = [];
    let iteration = 1;

    do {
      const fx0 = Fx(x0);
      const fx1 = Fx(x1);
      if (fx1 - fx0 === 0) break;

      x2 = x1 - (fx1 * (x1 - x0)) / (fx1 - fx0);
      Error = Math.abs((x2 - x1) / x2);
      data.push({ iteration, x0, fx0, error: Error });
      point.push({ x: x0, fx: fx0 });
      x0 = x1;
      x1 = x2;
      iteration++;
    } while (Error > Er && iteration <= 100);

    point.sort((a, b) => a.x - b.x);
    this.setState({ Iterations: data, plotgraph: point }, this.PushDataBase);
  }

  render() {
    return this.renderBaseLayout("Secant");
  }
}

export default Secant;
