import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { oddsSummarizedForDiceCount } from "./model";
import Odds from "./components/Odds";
import DiceForm from "./components/DiceForm";
import Container from "./components/Container";

class App extends Component {
  state = {
    odds: []
  };

  // allDiceCount = () => _.sum(_.values(this.state.diceCount));

  // addDie = color => {
  //   if (this.allDiceCount() >= 9) {
  //     alert("9 dice max");
  //   } else {
  //     this.setState({
  //       diceCount: {
  //         ...this.state.diceCount,
  //         [color]: this.state.diceCount[color] + 1
  //       }
  //     });
  //   }
  // };

  calculateOdds = (diceCount, requiredRange, hp) => {
    console.log(
      "diceCount",
      diceCount,
      "requiredRange",
      requiredRange,
      "hp",
      hp
    );
    const odds = oddsSummarizedForDiceCount(diceCount, requiredRange, hp);
    console.log(odds);
    this.setState({ odds });
  };

  render() {
    return (
      <Router>
        <Container>
          {/*<Route*/}
          {/*exact*/}
          {/*path="/"*/}
          {/*component={props => (*/}
          {/*)}*/}
          {/*/>*/}
          <DiceForm
            submitDiceCount={(diceCount, range, health) => {
              this.calculateOdds(diceCount, range, health);

              // props.history.push("/odds");
            }}
          />
          <Route
            exact
            path="/odds"
            component={props =>
              !this.state.odds || this.state.odds.length === 0 ? (
                <Redirect to="/" />
              ) : (
                <div style={{ margin: "5% auto 0 auto" }}>
                  <Odds odds={this.state.odds} />
                </div>
              )
            }
          />
        </Container>
      </Router>
    );
  }
}

export default App;
