import React from "react";

const ResponsiveContainer = ({ children }) => (
  <div
    style={{
      maxWidth: 900,
      margin: "0 auto",
      padding: "24px 16px",
      width: "100%",
      boxSizing: "border-box",
       minWidth: 0, // 👈 Add this line
      overflowWrap: "break-word", 
    }}
  >
    {children}
  </div>
);

export default ResponsiveContainer;