import _ from "lodash";
export const red = {
  numberOfFaces: 6,
  faces: [
    { value: { damage: 1, surge: 0, range: 1 }, occurrence: 1 },
    { value: { damage: 2, surge: 2, range: 1 }, occurrence: 2 },
    { value: { damage: 2, surge: 1, range: 1 }, occurrence: 1 },
    { value: { damage: 3, surge: 0, range: 1 }, occurrence: 2 }
  ]
};

export const green = {
  numberOfFaces: 6,
  faces: [
    { value: { damage: 0, surge: 1, range: 1 }, occurrence: 1 },
    { value: { damage: 1, surge: 1, range: 1 }, occurrence: 1 },
    { value: { damage: 2, surge: 0, range: 1 }, occurrence: 1 },
    { value: { damage: 1, surge: 1, range: 2 }, occurrence: 1 },
    { value: { damage: 2, surge: 0, range: 2 }, occurrence: 1 },
    { value: { damage: 2, surge: 0, range: 3 }, occurrence: 1 }
  ]
};

export const blue = {
  numberOfFaces: 6,
  faces: [
    { value: { damage: 0, surge: 1, range: 2 }, occurrence: 1 },
    { value: { damage: 1, surge: 0, range: 2 }, occurrence: 1 },
    { value: { damage: 2, surge: 0, range: 3 }, occurrence: 1 },
    { value: { damage: 1, surge: 1, range: 3 }, occurrence: 1 },
    { value: { damage: 2, surge: 0, range: 4 }, occurrence: 1 },
    { value: { damage: 1, surge: 0, range: 5 }, occurrence: 1 }
  ]
};

export const yellow = {
  numberOfFaces: 6,
  faces: [
    { value: { damage: 0, surge: 1, range: 0 }, occurrence: 1 },
    { value: { damage: 1, surge: 2, range: 0 }, occurrence: 1 },
    { value: { damage: 2, surge: 0, range: 1 }, occurrence: 1 },
    { value: { damage: 1, surge: 1, range: 1 }, occurrence: 1 },
    { value: { damage: 0, surge: 1, range: 2 }, occurrence: 1 },
    { value: { damage: 1, surge: 0, range: 2 }, occurrence: 1 }
  ]
};

export const black = {
  numberOfFaces: 6,
  faces: [
    { value: { block: 1, evade: 0, dodge: 0 }, occurrence: 2 },
    { value: { block: 2, evade: 0, dodge: 0 }, occurrence: 2 },
    { value: { block: 3, evade: 0, dodge: 0 }, occurrence: 1 },
    { value: { block: 0, evade: 1, dodge: 0 }, occurrence: 1 }
  ]
};

export const white = {
  numberOfFaces: 6,
  faces: [
    { value: { block: 0, evade: 0, dodge: 0 }, occurrence: 1 },
    { value: { block: 1, evade: 0, dodge: 0 }, occurrence: 1 },
    { value: { block: 0, evade: 1, dodge: 0 }, occurrence: 1 },
    { value: { block: 1, evade: 1, dodge: 0 }, occurrence: 2 },
    { value: { block: 0, evade: 0, dodge: 1 }, occurrence: 1 }
  ]
};

export const dices = { red, green, blue, yellow, black, white };

const between = (min, v, max) => Math.max(0, Math.min(max, v));

export function result(attackDice, defenseDice, range, hp) {
  const attackDie = combineAttackDice(attackDice);
  const defenseDie = combineDefenseDice(defenseDice);
  return combineAttackAndDefense(attackDie, defenseDie, range, hp);
}

export function diceCountToList(diceCount) {
  return _.flatMap(_.toPairs(diceCount), ([name, count]) =>
    _.range(count).map(() => dices[name])
  );
}

function attackDiceCountToList({ red, green, blue, yellow }) {
  return diceCountToList({ red, green, blue, yellow });
}

function defenseDiceCountToList({ white, black }) {
  return diceCountToList({ white, black });
}

export function oddsSummarizedForDiceCount(diceCount, range, hp) {
  const attackDice = attackDiceCountToList(diceCount);
  const defenseDice = defenseDiceCountToList(diceCount);
  const resultDie = result(attackDice, defenseDice, range, hp);
  return oddsSummarized(resultDie);
}

export function oddsSummarized(die) {
  const faces = die.faces;
  const faceByDamage = _.groupBy(faces, f => f.value.damage);
  return cumulativeOdds(
    _.entries(faceByDamage).map(([damage, faces]) => {
      const numberOfFaces = _.sum(faces.map(face => face.occurrence));
      const surgeOdds = oddsForIcon({ faces, numberOfFaces }, "surge");
      return {
        value: Number.parseInt(damage, 10),
        odds: numberOfFaces / die.numberOfFaces,
        surgeOdds
      };
    })
  );
}

export function cumulativeOdds(odds) {
  const sortedByDamage = _.reverse(_.sortBy(odds, "value"));
  let acc = 0;
  return sortedByDamage.map(odd => {
    if (odd.value === 0) return { ...odd, exact: odd.odds };
    acc += odd.odds;
    return { ...odd, odds: acc, exact: odd.odds };
  });
}

export function oddsPerIconForDiceCount(diceCount, range, hp) {
  const attackDice = attackDiceCountToList(diceCount);
  const defenseDice = defenseDiceCountToList(diceCount);
  const resultDie = result(attackDice, defenseDice, range, hp);
  return oddsPerIcon(resultDie);
}

export function oddsPerIcon(die) {
  const odds = {};
  for (let icon of icons(die)) {
    odds[icon] = oddsForIcon(die, icon);
  }
  return odds;
}

const icons = die => _.keys(die.faces[0].value);

export function oddsForIcon(die, icon) {
  const faces = filterIcon(die, icon);
  let iconOdds = distinct(faces).map(face => ({
    value: face.value[icon],
    odds: face.occurrence / die.numberOfFaces
  }));
  return _.reverse(_.sortBy(iconOdds, o => o.odds));
}

function filterIcon(die, iconToKeep) {
  return die.faces.map(face => ({
    value: { [iconToKeep]: face.value[iconToKeep] },
    occurrence: face.occurrence
  }));
}

export function combineAttackAndDefense(attackDie, defenseDie, range, hp) {
  let faces = _.flatMap(attackDie.faces, face1 =>
    defenseDie.faces.map(face2 =>
      combineAttackAndDefenseFaces(face1, face2, range, hp)
    )
  );
  faces = distinct(faces);
  return {
    numberOfFaces: attackDie.numberOfFaces * defenseDie.numberOfFaces,
    faces
  };
}

function combineAttackAndDefenseFaces(attackFace, defenseFace, range, hp) {
  const occurrence = attackFace.occurrence * defenseFace.occurrence;
  const die0 = {
    value: { damage: 0, surge: 0 },
    occurrence
  };
  if (defenseFace.value.dodge === 1) {
    return die0;
  } else if (attackFace.value.range < range) {
    return die0;
  } else {
    return {
      value: {
        damage: between(
          0,
          attackFace.value.damage - defenseFace.value.block,
          hp
        ),
        surge: Math.max(0, attackFace.value.surge - defenseFace.value.evade)
      },
      occurrence
    };
  }
}

export function combineDefenseDice(dice) {
  if (dice.length === 0) return [];
  return dice.reduce((d1, d2) => combine2DefenseDice(d1, d2));
}

export function combineAttackDice(dice) {
  if (dice.length === 0) return [];
  return dice.reduce((d1, d2) => combine2AttackDice(d1, d2));
}

function combine2AttackDice(d1, d2) {
  let faces = _.flatMap(d1.faces, face1 =>
    d2.faces.map(face2 => combineAttackFaces(face1, face2))
  );
  faces = distinct(faces);
  return { numberOfFaces: d1.numberOfFaces * d2.numberOfFaces, faces };
}

function combine2DefenseDice(d1, d2) {
  let faces = _.flatMap(d1.faces, face1 =>
    d2.faces.map(face2 => combineDefenseFaces(face1, face2))
  );
  faces = distinct(faces);
  return { numberOfFaces: d1.numberOfFaces * d2.numberOfFaces, faces };
}

function combineAttackFaces(f1, f2) {
  return {
    value: {
      damage: f1.value.damage + f2.value.damage,
      surge: f1.value.surge + f2.value.surge,
      range: f1.value.range + f2.value.range
    },
    occurrence: f1.occurrence * f2.occurrence
  };
}

export function combineDefenseFaces(f1, f2) {
  return {
    value: {
      block: f1.value.block + f2.value.block,
      evade: f1.value.evade + f2.value.evade,
      dodge: Math.min(1, f1.value.dodge + f2.value.dodge)
    },
    occurrence: f1.occurrence * f2.occurrence
  };
}

export function distinct(faces) {
  const duplicateFaceGroups = _.values(
    _.groupBy(faces, ({ value }) => _.values(value).join("-"))
  );
  return duplicateFaceGroups.map(faceGroup =>
    faceGroup.reduce((f1, { occurrence }) => ({
      value: f1.value,
      occurrence: f1.occurrence + occurrence
    }))
  );
}
