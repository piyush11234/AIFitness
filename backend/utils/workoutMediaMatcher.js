import { exercisesLibrary } from "./exerciseLibrary.js";


const normalize = (str) =>
  str.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();

const similarity = (a, b) => {
  const aWords = new Set(a.split(" "));
  const bWords = new Set(b.split(" "));
  let match = 0;

  aWords.forEach(w => bWords.has(w) && match++);
  return match / Math.max(aWords.size, bWords.size);
};

export const findClosestExercise = (name) => {
  let best = null;
  let score = 0;

  exercisesLibrary.forEach(ex => {
    const s = similarity(normalize(ex.name), normalize(name));
    if (s > score) {
      score = s;
      best = ex;
    }
  });

  return score >= 0.6 ? best : null;
};
