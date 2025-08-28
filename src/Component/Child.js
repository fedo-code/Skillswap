import { useState, useEffect } from "react";

function Child({ count }) {
  const [localcount, setLocalcount] = useState(count);

  useEffect(() => {
    setLocalcount(count);
  }, [count]);

  return (
    <div>
      <h2>Child counting: {localcount}</h2>
    </div>
  );
}

export default Child;
