import { exercisesLibrary } from "../utils/exerciseLibrary.js";
import { meditationLibrary } from "../utils/meditationLibrary.js";
import { yogaLibrary } from "../utils/YogaLibrary.js";


export const getExercises = (req, res) => {
  const { search, bodyPart } = req.query;

  let results = [...exercisesLibrary];

  // Search by exercise name
  if (search) {
    const keyword = search.toLowerCase();
    results = results.filter(ex =>
      ex.name.toLowerCase().includes(keyword)
    );
  }

  // Filter by body part / focusArea
  if (bodyPart) {
    results = results.filter(ex =>
      ex.focusArea.toLowerCase().includes(bodyPart.toLowerCase())
    );
  }

  res.json({
    success: true,
    count: results.length,
    exercises: results,
  });
};




export const getYoga = (req, res) => {
  const { search, category } = req.query;

  let results = [...yogaLibrary];

  // Search by yoga name
  if (search) {
    const keyword = search.toLowerCase();
    results = results.filter(y =>
      y.name.toLowerCase().includes(keyword)
    );
  }

  // Filter by category (Beginner, Flexibility, Stress Relief, etc.)
  if (category) {
    results = results.filter(y =>
      y.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  res.json({
    success: true,
    count: results.length,
    yoga: results
  });
};




export const getMeditations = (req, res) => {
  const { search, category } = req.query;

  let results = [...meditationLibrary];

  // Search by meditation name
  if (search) {
    const keyword = search.toLowerCase();
    results = results.filter(m =>
      m.name.toLowerCase().includes(keyword)
    );
  }

  // Filter by category (Relaxation, Sleep, Focus, etc.)
  if (category) {
    results = results.filter(m =>
      m.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  res.json({
    success: true,
    count: results.length,
    meditation: results
  });
};

