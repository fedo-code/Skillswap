import Child from "./Child"; // correct path
import { useState } from "react";

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Counting: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Click</button>
      <Child count={count} />
    </div>
  );
}

export default Parent;
