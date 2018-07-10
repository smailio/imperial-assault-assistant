import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

const Odds = ({ odds }) => {
  return (
    <div>
      {odds && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="dense">
                <span>Damage</span>
              </TableCell>
              <TableCell padding="dense">
                <span>Odds</span>
              </TableCell>
              <TableCell padding="dense">
                <span>Cummulated</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {odds && odds.map(odd => <Odd key={odd.value} {...odd} />)}
          </TableBody>
        </Table>
      )}
      {!odds && (
        <h1 style={{ margin: "10%" }}>
          You should fill a dice form and compute odds to get to this page !{" "}
        </h1>
      )}
    </div>
  );
};

const Odd = ({ value, odds, exact, surgeOdds }) => [
  <TableRow style={{ height: 75 }}>
    <TableCell padding="dense">
      <div>{value} +</div>
      <div
        style={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          paddingTop: 9
        }}
      >
        {/*<Typography variant="caption">Surge : </Typography>*/}
        {surgeOdds.slice(0, 4).map(({ odds, value }, i) => [
          <Typography
            key={value}
            variant="caption"
            style={
              i > 0
                ? { padding: "0px 5px 0px 5px" }
                : { padding: "0px 5px 0px 0px" }
            }
          >
            {value} - {Math.trunc(odds * 100)}%
          </Typography>,
          <Typography key={value} variant="caption">
            {i < 3 && i < surgeOdds.length - 1 && " | "}
          </Typography>
        ])}
      </div>
    </TableCell>
    <TableCell padding="dense">{(exact * 100).toFixed(2)} %</TableCell>
    <TableCell padding="dense">{Math.trunc(odds * 100)} %</TableCell>
  </TableRow>
];

export default Odds;
