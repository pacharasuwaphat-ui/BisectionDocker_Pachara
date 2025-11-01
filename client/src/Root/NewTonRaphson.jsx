import React from "react";
import axios from "axios";
import BaseRootEquation from "./BaseRootEquation";

class NewtonRaphson extends BaseRootEquation {
  renderInputs() {
    const { Equation, X0, Er } = this.state;
    return (
      <div className="Textinput">
        <input
          type="text"
          value={Equation}
          onChange={(e) => this.setState({ Equation: e.target.value })}
          placeholder="input your equation"
          className="EquationInput"
        />
        <input
          type="text"
          value={X0}
          onChange={(e) => this.setState({ X0: e.target.value })}
          placeholder="X0"
          className="X"
        />
        <input
          type="text"
          value={Er}
          onChange={(e) => this.setState({ Er: e.target.value })}
          placeholder="Error"
          className="X"
        />
      </div>
    );
  }

  async fetchDatabase() {
    const res = await fetch("http://localhost:8000/NewtonRaphson");
    this.setState({ Old: await res.json() });
  }

  async getOldProblem() {
    this.setState({ showOld: true, showNew: false });
    await this.fetchDatabase();
  }

  async PushDataBase() {
    const { Equation, X0, Er } = this.state;
    await axios.post("http://localhost:8000/root1x", {
      equation: Equation,
      x: X0,
      error: Er,
      method: "newton",
    });
  }

  Oldcal(e) {
    e.preventDefault();
    const selected = this.state.Old.find((item) => item.equation === this.state.value);
    if (selected) {
      this.setState({
        Equation: selected.equation,
        X0: selected.x,
        Er: selected.error,
      });
    }
    this.Cancel();
  }

  derivative(x) {
    const h = 1e-6;
    return (this.Fx(x + h) - this.Fx(x - h)) / (2 * h);
  }

  Calculation() {
    const { Equation, X0, Er } = this.state;
    if (!Equation || !X0 || !Er) {
      alert("กรุณากรอกข้อมูลให้ครบก่อนคำนวณ");
      return;
    }

    let x0 = parseFloat(X0);
    let x1, Error;
    let data = [];
    let point = [];
    let iteration = 1;

    do {
      const fx0 = this.Fx(x0);
      const fpx0 = this.derivative(x0);
      if (fpx0 === 0) {
        alert("f'(x) = 0 ทำให้ไม่สามารถคำนวณต่อได้");
        break;
      }

      x1 = x0 - fx0 / fpx0;
      Error = Math.abs((x1 - x0) / x1);
      data.push({ iteration, x0, fx: fx0, error: Error });
      point.push({ x: x0, fx: fx0 });
      x0 = x1;
      iteration++;
    } while (Error > Er && iteration <= 100);

    point.sort((a, b) => a.x - b.x);
    this.setState({ Iterations: data, plotgraph: point }, this.PushDataBase);
  }

  render() {
    return this.renderBaseLayout("Newton-Raphson");
  }
}

export default NewtonRaphson;
