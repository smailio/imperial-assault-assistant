import styled from "styled-components";
import React from "react";

const Button = styled.button`
  /* Adapt the colours based on primary prop */
  background-color: white;
  color: tomato;
  font-size: 9vmin;
  //padding: 0.25em 2vmin;
  border: 3px solid tomato;
  border-radius: 1%;
  cursor: pointer;
  width: 40vmin;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 8vmin;
  span {
    font-size: 4vmin;
    margin-right: 1vmin;
  }
  :hover {
    background-color: tomato;
    color: white;
  }
`;

const ComputeDiceSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20vmin;
`;

export default ({ onClick }) => (
  <ComputeDiceSection>
    <Button onClick={onClick}>
      <span>ODDS</span>
      {/*👊*/}
    </Button>
  </ComputeDiceSection>
);
