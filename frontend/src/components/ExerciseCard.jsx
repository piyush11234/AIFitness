export default function ExerciseCard({ exercise }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "10px",
      padding: "15px",
      textAlign: "center"
    }}>
      <h3>{exercise.name}</h3>
      <p><strong>Type:</strong> {exercise.type}</p>
      <p><strong>Body Part:</strong> {exercise.focusArea}</p>
      <p><strong>Level:</strong> {exercise.activityLevel}</p>
    </div>
  );
}
