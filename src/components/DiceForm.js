import React from "react";
import {
  AddRedDie,
  AddBlueDie,
  AddGreenDie,
  AddYellowDie,
  AddWhiteDie,
  AddBlackDie
} from "./dice";
import AttackDicesSection from "./AttackDicesSection";
import DefenseDicesSection from "./DefenseDicesSection";
import ComputeButton from "./ComputeButton";
import Container from "./Container";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { Route, Prompt, withRouter } from "react-router-dom";
import _ from "lodash";

function hasDefenseDice(diceCount) {
  return diceCount.black > 0 || diceCount.white > 0;
}

function hasAttackDice(diceCount) {
  return (
    diceCount.red > 0 ||
    diceCount.blue > 0 ||
    diceCount.green > 0 ||
    diceCount.yellow > 0
  );
}

function isValidDiceCount(diceCount) {
  return hasDefenseDice(diceCount) && hasAttackDice(diceCount);
}

function isValidDiceForm(diceCount, range, health) {
  return isValidDiceCount(diceCount) && range !== "" && health !== "";
}

class DiceFrom extends React.Component {
  state = {
    diceCount: {
      red: 0,
      blue: 0,
      green: 0,
      yellow: 0,
      white: 0,
      black: 0
    },
    range: "",
    health: ""
  };

  allDiceCount = () => _.sum(_.values(this.state.diceCount));

  addDie = color => {
    if (this.allDiceCount() >= 16) {
      alert("16 dice max");
    } else {
      this.setState({
        diceCount: {
          ...this.state.diceCount,
          [color]: this.state.diceCount[color] + 1
        }
      });
    }
  };

  removeDice = color => {
    this.setState({
      diceCount: {
        ...this.state.diceCount,
        [color]: 0
      }
    });
  };

  submitDiceCount = () => {
    if (
      isValidDiceForm(this.state.diceCount, this.state.range, this.state.health)
    ) {
      this.props.submitDiceCount(
        this.state.diceCount,
        this.state.range,
        this.state.health
      );
      return true;
    } else {
      alert("Make sure you selected defense dice, entered health and range !");
      return false;
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    return (
      <Route
        exact
        path="/"
        component={props => (
          <Container>
            <AttackDicesSection>
              <AddRedDie
                dicesCount={this.state.diceCount.red}
                addDie={this.addDie}
                removeDice={this.removeDice}
              />
              <AddBlueDie
                dicesCount={this.state.diceCount.blue}
                addDie={this.addDie}
                removeDice={this.removeDice}
              />
              <AddGreenDie
                dicesCount={this.state.diceCount.green}
                addDie={this.addDie}
                removeDice={this.removeDice}
              />
              <AddYellowDie
                dicesCount={this.state.diceCount.yellow}
                addDie={this.addDie}
                removeDice={this.removeDice}
              />
            </AttackDicesSection>
            <DefenseDicesSection>
              <AddWhiteDie
                dicesCount={this.state.diceCount.white}
                addDie={this.addDie}
                removeDice={this.removeDice}
              />
              <AddBlackDie
                dicesCount={this.state.diceCount.black}
                addDie={this.addDie}
                removeDice={this.removeDice}
              />
            </DefenseDicesSection>
            <div style={{ alignSelf: "center", width: "90%" }}>
              <Grid container justify="center" spacing={16}>
                <Grid item xs={8} sm={4} md={2}>
                  <TextField
                    style={{ fontSize: "6vmin" }}
                    label="Range"
                    value={this.state.range}
                    type="number"
                    fullWidth
                    margin="dense"
                    onChange={this.handleChange("range")}
                  />
                </Grid>
                <Grid item xs={8} sm={4} md={2}>
                  <TextField
                    style={{ fontSize: "6vmin" }}
                    label="Health"
                    value={this.state.health}
                    type="number"
                    fullWidth
                    margin="dense"
                    onChange={this.handleChange("health")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ComputeButton
                    onClick={() => {
                      if (this.submitDiceCount()) props.history.push("/odds");
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          </Container>
        )}
      />
    );
  }
}

export default DiceFrom;
