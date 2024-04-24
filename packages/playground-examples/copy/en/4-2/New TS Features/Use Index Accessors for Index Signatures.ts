//// { "compiler": { "ts": "4.2.0-beta", "noPropertyAccessFromIndexSignature": true } }
// JavaScript has two ways to access an object on a property, the first is via
// the dot operator x.y, the other is via square brackets x["y"] - the second
// syntax x["y"] is called index accessors.

// This syntax is reflected in the type system, where you can add an index
// signature to a type, meaning any unknown property will have a particular type.

// This type uses an index signature to indicate that you can ask
// for any string and you will either get a string of undefined back.

type ENV = {
  [envVar: string]: string | undefined;
};

// In 4.2, there is a compiler flag to ensure consistency with how the
// syntax for accessing the variable is consistent with how the variable
// was declared.

// For example, we can have a game ratings object, where games are
// given a rank from 1 to 5. There are known games ahead of time,
// but you could get back a lot of different objects

type Rating = 1 | 2 | 3 | 4 | 5;

interface GameRatingLibrary {
  hades: Rating;
  ringFitAdventures: Rating;
  discoElysium: Rating;

  // Unknown properties are covered by this index signature.
  [propName: string]: Rating;
}

declare const getYearRatings: (year: string) => GameRatingLibrary;
const ratings = getYearRatings("2020");

// These are known in above, and so you can safely use
// the dot syntax.
const hadesScore = ratings.hades;
const ringFitScore = ratings.ringFitAdventures;

// This game is not declared above, and the index signature
// is used instead, this means you cannot use the dot
// operator and must access via ratings["oriAndTheBlindForest"]
const nodeEnv = ratings.oriAndTheBlindForest;
