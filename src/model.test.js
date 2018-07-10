import _ from "lodash";
import {
  oddsForIcon,
  result,
  combineDefenseFaces,
  black,
  blue,
  green,
  red,
  white,
  yellow,
  odds,
  oddsPerIcon,
  combineAttackDice,
  combineDefenseDice,
  combineAttackAndDefense,
  distinct,
  diceCountToList,
  oddsSummarized,
  cumulativeOdds
} from "./model.js";

it("combine defense dice", () => {
  const die = combineDefenseDice([
    {
      numberOfFaces: 10,
      faces: [
        { value: { block: 5, evade: 0, dodge: 0 }, occurrence: 5 },
        { value: { block: 10, evade: 1, dodge: 0 }, occurrence: 5 }
      ]
    },
    {
      numberOfFaces: 8,
      faces: [
        { value: { block: 2, evade: 5, dodge: 0 }, occurrence: 5 },
        { value: { block: 0, evade: 0, dodge: 1 }, occurrence: 3 }
      ]
    }
  ]);
  expect(die).toEqual({
    numberOfFaces: 80,
    faces: [
      { value: { block: 7, evade: 5, dodge: 0 }, occurrence: 25 },
      { value: { block: 5, evade: 0, dodge: 1 }, occurrence: 15 },
      { value: { block: 12, evade: 6, dodge: 0 }, occurrence: 25 },
      { value: { block: 10, evade: 1, dodge: 1 }, occurrence: 15 }
    ]
  });
});

it("combine attack dice", () => {
  const die = combineAttackDice([
    {
      numberOfFaces: 10,
      faces: [
        { value: { damage: 5, surge: 0, range: 1 }, occurrence: 5 },
        { value: { damage: 10, surge: 1, range: 1 }, occurrence: 5 }
      ]
    },
    {
      numberOfFaces: 8,
      faces: [
        { value: { damage: 2, surge: 5, range: 1 }, occurrence: 5 },
        { value: { damage: 7, surge: 6, range: 1 }, occurrence: 3 }
      ]
    }
  ]);
  expect(die).toEqual({
    numberOfFaces: 80,
    faces: [
      { value: { damage: 7, surge: 5, range: 2 }, occurrence: 25 },
      { value: { damage: 12, surge: 6, range: 2 }, occurrence: 40 },
      { value: { damage: 17, surge: 7, range: 2 }, occurrence: 15 }
    ]
  });
  const die2 = combineAttackDice([
    {
      numberOfFaces: 10,
      faces: [
        { value: { damage: 5, surge: 0, range: 1 }, occurrence: 5 },
        { value: { damage: 10, surge: 1, range: 1 }, occurrence: 5 }
      ]
    },
    {
      numberOfFaces: 8,
      faces: [
        { value: { damage: 2, surge: 5, range: 1 }, occurrence: 5 },
        { value: { damage: 3, surge: 6, range: 8 }, occurrence: 3 }
      ]
    }
  ]);
  expect(die2).toEqual({
    numberOfFaces: 80,
    faces: [
      { value: { damage: 7, surge: 5, range: 2 }, occurrence: 25 },
      { value: { damage: 8, surge: 6, range: 9 }, occurrence: 15 },
      { value: { damage: 12, surge: 6, range: 2 }, occurrence: 25 },
      { value: { damage: 13, surge: 7, range: 9 }, occurrence: 15 }
    ]
  });
});

it("combine attack and defence", () => {
  const attackDie = {
    numberOfFaces: 80,
    faces: [
      { value: { damage: 7, surge: 5, range: 3 }, occurrence: 25 },
      { value: { damage: 12, surge: 6, range: 2 }, occurrence: 40 },
      { value: { damage: 17, surge: 7, range: 2 }, occurrence: 15 }
    ]
  };
  const defenseDie = {
    numberOfFaces: 80,
    faces: [
      { value: { block: 7, evade: 5, dodge: 0 }, occurrence: 25 },
      { value: { block: 5, evade: 0, dodge: 0 }, occurrence: 15 },
      { value: { block: 12, evade: 6, dodge: 0 }, occurrence: 25 },
      { value: { block: 10, evade: 1, dodge: 0 }, occurrence: 15 }
    ]
  };
  const resultDie = combineAttackAndDefense(attackDie, defenseDie, 1, 25);
  expect(resultDie).toEqual({
    numberOfFaces: 6400,
    faces: [
      { value: { damage: 0, surge: 0 }, occurrence: 2250 },
      { value: { damage: 2, surge: 5 }, occurrence: 975 },
      { value: { damage: 0, surge: 4 }, occurrence: 375 },
      { value: { damage: 5, surge: 1 }, occurrence: 1375 },
      { value: { damage: 7, surge: 6 }, occurrence: 825 },
      { value: { damage: 10, surge: 2 }, occurrence: 375 },
      { value: { damage: 12, surge: 7 }, occurrence: 225 }
    ]
  });
});

it("combine attack and defense dice (dodge)", () => {
  const attackDie = {
    numberOfFaces: 80,
    faces: [
      { value: { damage: 7, surge: 5, range: 3 }, occurrence: 25 },
      { value: { damage: 12, surge: 6, range: 2 }, occurrence: 40 },
      { value: { damage: 17, surge: 7, range: 2 }, occurrence: 15 }
    ]
  };
  const defenseDie = {
    numberOfFaces: 6,
    faces: [
      { value: { block: 0, evade: 0, dodge: 1 }, occurrence: 1 },
      { value: { block: 0, evade: 0, dodge: 0 }, occurrence: 5 }
    ]
  };
  let resultDie = combineAttackAndDefense(attackDie, defenseDie, 1, 99);
  expect(resultDie).toEqual({
    numberOfFaces: 480,
    faces: [
      { value: { damage: 0, surge: 0 }, occurrence: 80 },
      { value: { damage: 7, surge: 5 }, occurrence: 125 },
      { value: { damage: 12, surge: 6 }, occurrence: 200 },
      { value: { damage: 17, surge: 7 }, occurrence: 75 }
    ]
  });
  resultDie = combineAttackAndDefense(attackDie, defenseDie, 1, 8);
  expect(resultDie).toEqual({
    numberOfFaces: 480,
    faces: [
      { value: { damage: 0, surge: 0 }, occurrence: 80 },
      { value: { damage: 7, surge: 5 }, occurrence: 125 },
      { value: { damage: 8, surge: 6 }, occurrence: 200 },
      { value: { damage: 8, surge: 7 }, occurrence: 75 }
    ]
  });
});

it("combine attack and defense dice (range)", () => {
  const attackDie = {
    numberOfFaces: 80,
    faces: [
      { value: { damage: 7, surge: 5, range: 3 }, occurrence: 25 },
      { value: { damage: 12, surge: 6, range: 2 }, occurrence: 40 },
      { value: { damage: 17, surge: 7, range: 2 }, occurrence: 15 }
    ]
  };
  const defenseDie = {
    numberOfFaces: 80,
    faces: [
      { value: { block: 7, evade: 5, dodge: 0 }, occurrence: 25 },
      { value: { block: 5, evade: 0, dodge: 0 }, occurrence: 15 },
      { value: { block: 12, evade: 6, dodge: 0 }, occurrence: 25 },
      { value: { block: 10, evade: 1, dodge: 0 }, occurrence: 15 }
    ]
  };
  let resultDie = combineAttackAndDefense(attackDie, defenseDie, 3, 99);
  expect(resultDie).toEqual({
    numberOfFaces: 6400,
    faces: [
      { value: { damage: 0, surge: 0 }, occurrence: 5650 },
      { value: { damage: 2, surge: 5 }, occurrence: 375 },
      { value: { damage: 0, surge: 4 }, occurrence: 375 }
    ]
  });
});

it("combine attack and defense dice (max hp)", () => {
  const attackDie = {
    numberOfFaces: 80,
    faces: [
      { value: { damage: 7, surge: 5, range: 3 }, occurrence: 25 },
      { value: { damage: 12, surge: 6, range: 2 }, occurrence: 40 },
      { value: { damage: 17, surge: 7, range: 2 }, occurrence: 15 }
    ]
  };
  const defenseDie = {
    numberOfFaces: 6,
    faces: [
      { value: { block: 0, evade: 0, dodge: 1 }, occurrence: 1 },
      { value: { block: 0, evade: 0, dodge: 0 }, occurrence: 5 }
    ]
  };
  let resultDie = combineAttackAndDefense(attackDie, defenseDie, 1, 8);
  expect(resultDie).toEqual({
    numberOfFaces: 480,
    faces: [
      { value: { damage: 0, surge: 0 }, occurrence: 80 },
      { value: { damage: 7, surge: 5 }, occurrence: 125 },
      { value: { damage: 8, surge: 6 }, occurrence: 200 },
      { value: { damage: 8, surge: 7 }, occurrence: 75 }
    ]
  });
});

it("compute odds for icon", () => {
  const resultDie = {
    faces: [
      { value: { damage: 1, surge: 1 }, occurrence: 12 },
      { value: { damage: 1, surge: 0 }, occurrence: 14 },
      { value: { damage: 2, surge: 0 }, occurrence: 24 }
    ],
    numberOfFaces: 50
  };
  const damageOdds = oddsForIcon(resultDie, "damage");
  const surgeOdds = oddsForIcon(resultDie, "surge");
  expect(damageOdds).toEqual([
    { value: 1, odds: 26 / 50 },
    { value: 2, odds: 24 / 50 }
  ]);
  expect(surgeOdds).toEqual([
    { value: 0, odds: 38 / 50 },
    { value: 1, odds: 12 / 50 }
  ]);
});

it("compute odds for die", () => {
  const resultDie = {
    faces: [
      { value: { damage: 1, surge: 1 }, occurrence: 12 },
      { value: { damage: 1, surge: 0 }, occurrence: 14 },
      { value: { damage: 2, surge: 0 }, occurrence: 24 }
    ],
    numberOfFaces: 50
  };
  const resultDieOdds = oddsPerIcon(resultDie);
  expect(resultDieOdds).toEqual({
    damage: [{ value: 1, odds: 26 / 50 }, { value: 2, odds: 24 / 50 }],
    surge: [{ value: 0, odds: 38 / 50 }, { value: 1, odds: 12 / 50 }]
  });
});

it("returns distinct faces and sum occurence (no duplicate)", () => {
  expect(
    distinct([
      { value: { damage: 1, surge: 1 }, occurrence: 12 },
      { value: { damage: 1, surge: 0 }, occurrence: 14 },
      { value: { damage: 2, surge: 0 }, occurrence: 24 }
    ])
  ).toEqual([
    { value: { damage: 1, surge: 1 }, occurrence: 12 },
    { value: { damage: 1, surge: 0 }, occurrence: 14 },
    { value: { damage: 2, surge: 0 }, occurrence: 24 }
  ]);
});

it("returns distinct faces and sum occurence (one duplicate)", () => {
  expect(
    distinct([
      { value: { damage: 1, surge: 1 }, occurrence: 12 },
      { value: { damage: 1, surge: 0 }, occurrence: 14 },
      { value: { damage: 2, surge: 0 }, occurrence: 24 },
      { value: { damage: 2, surge: 0 }, occurrence: 24 }
    ])
  ).toEqual([
    { value: { damage: 1, surge: 1 }, occurrence: 12 },
    { value: { damage: 1, surge: 0 }, occurrence: 14 },
    { value: { damage: 2, surge: 0 }, occurrence: 48 }
  ]);
});
it("returns distinct faces and sum occurence (several duplicates)", () => {
  expect(
    distinct([
      { value: { damage: 1, surge: 1 }, occurrence: 12 },
      { value: { damage: 1, surge: 0 }, occurrence: 14 },
      { value: { damage: 1, surge: 0 }, occurrence: 14 },
      { value: { damage: 2, surge: 0 }, occurrence: 24 },
      { value: { damage: 2, surge: 0 }, occurrence: 24 }
    ])
  ).toEqual([
    { value: { damage: 1, surge: 1 }, occurrence: 12 },
    { value: { damage: 1, surge: 0 }, occurrence: 28 },
    { value: { damage: 2, surge: 0 }, occurrence: 48 }
  ]);
});

it("returns distinct faces and sum occurence (all duplicate)", () => {
  expect(
    distinct([
      { value: { damage: 2, surge: 0 }, occurrence: 24 },
      { value: { damage: 2, surge: 0 }, occurrence: 24 }
    ])
  ).toEqual([{ value: { damage: 2, surge: 0 }, occurrence: 48 }]);
});

it("returns distinct faces and sum occurence (empty)", () => {
  expect(distinct([])).toEqual([]);
});

it("create dice count from dice list", () => {
  expect(diceCountToList({ red: 0, green: 3, white: 1 })).toEqual([
    green,
    green,
    green,
    white
  ]);
});

it("create dice count from dice list (empty)", () => {
  expect(diceCountToList({ red: 0, green: 0, white: 0 })).toEqual([]);
});

it("compute odds summarized", () => {
  const die = {
    numberOfFaces: 14,
    faces: [
      { value: { damage: 1, surge: 2, range: 3 }, occurrence: 1 },
      { value: { damage: 1, surge: 3, range: 3 }, occurrence: 2 },
      { value: { damage: 1, surge: 3, range: 3 }, occurrence: 3 },
      { value: { damage: 2, surge: 4, range: 3 }, occurrence: 4 },
      { value: { damage: 2, surge: 5, range: 3 }, occurrence: 4 }
    ]
  };
  expect(oddsSummarized(die)).toEqual([
    {
      value: 1,
      odds: 6 / 14,
      surgeOdds: [{ value: 3, odds: 5 / 6 }, { value: 2, odds: 1 / 6 }]
    },
    {
      value: 2,
      odds: 8 / 14,
      surgeOdds: [{ value: 5, odds: 1 / 2 }, { value: 4, odds: 1 / 2 }]
    }
  ]);
});

it("return cumulative odds", () => {
  expect(
    cumulativeOdds([
      {
        value: 1,
        odds: 6 / 14,
        surgeOdds: [{ value: 3, odds: 5 / 6 }, { value: 2, odds: 1 / 6 }]
      },
      {
        value: 2,
        odds: 8 / 14,
        surgeOdds: [{ value: 5, odds: 1 / 2 }, { value: 4, odds: 1 / 2 }]
      }
    ])
  ).toEqual([
    {
      value: 2,
      odds: 8 / 14,
      surgeOdds: [{ value: 5, odds: 1 / 2 }, { value: 4, odds: 1 / 2 }]
    },
    {
      value: 1,
      odds: 1,
      surgeOdds: [{ value: 3, odds: 5 / 6 }, { value: 2, odds: 1 / 6 }]
    }
  ]);
});

it("return cumulative odds (doesn't cumulate for 0)", () => {
  expect(
    cumulativeOdds([
      {
        value: 1,
        odds: 6 / 20,
        surgeOdds: [{ value: 3, odds: 5 / 6 }, { value: 2, odds: 1 / 6 }]
      },
      {
        value: 0,
        odds: 6 / 20,
        surgeOdds: [{ value: 3, odds: 5 / 6 }, { value: 2, odds: 1 / 6 }]
      },
      {
        value: 2,
        odds: 8 / 20,
        surgeOdds: [{ value: 5, odds: 1 / 2 }, { value: 4, odds: 1 / 2 }]
      }
    ])
  ).toEqual([
    {
      value: 2,
      odds: 8 / 20,
      surgeOdds: [{ value: 5, odds: 1 / 2 }, { value: 4, odds: 1 / 2 }]
    },
    {
      value: 14 / 20,
      odds: 1,
      surgeOdds: [{ value: 3, odds: 5 / 6 }, { value: 2, odds: 1 / 6 }]
    },
    {
      value: 0,
      odds: 6 / 20,
      surgeOdds: [{ value: 3, odds: 5 / 6 }, { value: 2, odds: 1 / 6 }]
    }
  ]);
});
