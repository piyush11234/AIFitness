import { yogaLibrary } from "./YogaLibrary.js";


export const yogaMediaMap = yogaLibrary.reduce((acc, pose) => {
  acc[pose.name.toLowerCase()] = pose.media;
  return acc;
}, {});
