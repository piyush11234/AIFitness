const bodyParts = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Full Body", "Core"];

export default function FilterSidebar({ onFilter }) {
  return (
    <div style={{
      width: "200px",
      borderRight: "1px solid #ddd",
      paddingRight: "10px"
    }}>
      <h3>Body Part</h3>
      {bodyParts.map((part) => (
        <div key={part}>
          <input
            type="radio"
            name="bodyPart"
            value={part}
            onChange={() => onFilter(part)}
          />{" "}
          {part}
        </div>
      ))}

      <button onClick={() => onFilter("")} style={{ marginTop: "10px" }}>
        Clear Filter
      </button>
    </div>
  );
}
