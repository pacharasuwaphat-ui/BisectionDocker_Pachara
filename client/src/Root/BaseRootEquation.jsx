import React from "react";
import { evaluate } from "mathjs";
import Graph from "../component/Graph";
import Table from "../component/TableIteration";
import Nav from "./Menu";

/**
 * Abstract function
 *  - fetchDatabase()
 *  - getOldProblem()
 *  - PushDataBase()
 *  - Oldcal()
 *  - Calculation()
 */
class BaseRootEquation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      Equation: "",
      XL: "",
      XR: "",
      X0: "",
      Er: "",
      Iterations: [],
      plotgraph: [],
      Old: [],
      showOld: false,
      showNew: true,
    };
  }

  // ---------- Abstract methods ----------
  fetchDatabase() {
    throw new Error("fetchDatabase() must be implemented in subclass");
  }

  getOldProblem() {
    throw new Error("getOldProblem() must be implemented in subclass");
  }

  PushDataBase() {
    throw new Error("PushDataBase() must be implemented in subclass");
  }

  Oldcal() {
    throw new Error("Oldcal() must be implemented in subclass");
  }

  Calculation() {
    throw new Error("Calculation() must be implemented in subclass");
  }

  // ---------- Common methods ----------
  Cancel = () => {
    this.setState({ showOld: false, showNew: true });
  };

  Fx = (x) => {
    const { Equation } = this.state;
    try {
      return evaluate(Equation, { x });
    } catch {
      return NaN;
    }
  };

  renderInputs() {
    const { Equation, XL, XR, Er } = this.state;
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
          value={XL}
          onChange={(e) => this.setState({ XL: e.target.value })}
          placeholder="xL"
          className="X"
        />
        <input
          type="text"
          value={XR}
          onChange={(e) => this.setState({ XR: e.target.value })}
          placeholder="xR"
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

  renderBaseLayout(currentName) {
    const {
      value,
      Equation,
      Er,
      Iterations,
      plotgraph,
      Old,
      showOld,
      showNew,
    } = this.state;

    return (
      <>
        <Nav current={currentName} />
        <div className="EquationBox">
          <h1>{currentName} Method</h1>

          {/* 🧾 ฟอร์มใหม่ */}
          {showNew && (
            <div>
              {this.renderInputs()}

              <center>
                <button onClick={() => this.Calculation()}>Calculate</button>
              </center>
              <center>
                <button onClick={() => this.getOldProblem()}>
                  Get Old Problem
                </button>
              </center>
            </div>
          )}

          {/* 🗂 แสดงข้อมูลเก่า */}
          {showOld && (
            <div>
              <div className="Textinput">
                <form onSubmit={(e) => this.Oldcal(e)}>
                  {Old.map((items, index) => (
                    <center key={index} className="oldSelect">
                      <label>
                        <input
                          className="oldSelect"
                          type="radio"
                          value={items.equation}
                          checked={value === items.equation}
                          onChange={(e) =>
                            this.setState({ value: e.target.value })
                          }
                        />
                        {items.equation}
                      </label>
                    </center>
                  ))}
                  <center>
                    <button type="submit">Select</button>
                  </center>
                </form>
              </div>
              <center>
                <button onClick={this.Cancel}>Cancel</button>
              </center>
            </div>
          )}

          {/* 📊 แสดงผล */}
          {Iterations.length > 0 && Equation && (
            <Table Iterations={Iterations} />
          )}
          {Iterations.length > 0 && Equation && <Graph Points={plotgraph} />}
        </div>
      </>
    );
  }
}

export default BaseRootEquation;
