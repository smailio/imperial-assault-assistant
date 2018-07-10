import styled from "styled-components";

const Container = styled.div`
  height: 100%;
  //padding-bottom: 10%;
  //padding-top: 10%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
  }

  @media only screen and (min-device-width: 481px) {
    margin: 0 auto 0 auto;
    //max-width: 800px;
  }
`;

export default Container;
