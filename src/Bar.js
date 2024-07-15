import React from "react";
import { Bar as VxBar } from "@vx/shape";
import { Text as VxText } from "@vx/text";

const Bar = ({ color, x, y, width, height, name, value, url }) => {
  const text = `${name} ${value} `;
  return (
    <React.Fragment>
      <VxBar
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        style={{ opacity: 0.8 }}

      />
      <VxText x={x + 10} y={y + height / 2} >
        {text}
      </VxText>
      {url && (
        <image
          x={x + width - 35}  // Adjust the x position to place the image at the end of the bar
          y={y + (height - 20) / 2}  // Center the image vertically
          width="26"
          height="26"
          href={url}
          preserveAspectRatio="xMidYMid slice"
        />
      )}



    </React.Fragment>
  );
};

export default Bar;
