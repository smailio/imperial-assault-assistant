import React from "react";
import styled from "styled-components";
import Tappable from "react-tappable";

const colors = {
  red: "tomato",
  blue: "dodgerblue",
  green: "limegreen",
  yellow: "yellow",
  white: "white",
  black: "darkslategray"
};

const Dice = styled.a`
  height: 10vmin;
  width: 10vmin;
  color: darkslategray;
  background-color: ${props => colors[props.backgroundColor]};
  border: 1vmin solid darkslategray;
  border-radius: 5%;
  cursor: pointer;
`;

const Row25p = styled.div`
  display: flex;
  flex-direction: row;
  width: 40vmin;
  height: 20vmin;

  //height: 100%;
  justify-content: space-evenly;
  align-items: center;

  .Tappable-active {
    height: 18vmin;
    width: 18vmin;
  }
`;
//
// const RowX = styled.div`
//   display: flex;
//   //flex-direction: column;
//   //width: 75px;
//   //height: 125px;
//   justify-content: space-around;
//   //align-content: center;
// `;
const AddDie = ({ addDie, removeDice, dicesCount, color }) => (
  <Row25p>
    <Tappable
      pressDelay={800}
      onTap={() => addDie(color)}
      onPress={() => removeDice(color)}
      component={props => <Dice backgroundColor={color} {...props} />}
    />
    {/*<RowX>*/}
    {/*<span>*/}
    {/*<a>-</a>*/}
    {/*</span>*/}
    {/*<span>*/}
    {/*<a href="" onClick={() => addDice(color)}>*/}
    {/*+*/}
    {/*</a>*/}
    {/*</span>*/}
    {/*</RowX>*/}
    <div style={{ height: "6vmin", fontSize: "4vmin" }}>✕</div>
    <div style={{ height: "12vmin", fontSize: "10vmin" }}>{dicesCount}</div>
  </Row25p>
);

export const AddRedDie = props => <AddDie color="red" {...props} />;
export const AddBlueDie = props => <AddDie color="blue" {...props} />;
export const AddGreenDie = props => <AddDie color="green" {...props} />;
export const AddYellowDie = props => <AddDie color="yellow" {...props} />;
export const AddWhiteDie = props => <AddDie color="white" {...props} />;
export const AddBlackDie = props => <AddDie color="black" {...props} />;
