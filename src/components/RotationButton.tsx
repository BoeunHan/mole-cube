"use client";

import { DEFAULT_CUBE_COLORS } from "@/constants/cube-colors";
import { Face } from "@/enums";
import { Fragment } from "react";

export const RotationButtonList = () => {
  return (
    <div className="flex flex-wrap w-46 gap-2">
      {Object.values(Face).map((face, idx) => (
        <Fragment key={idx}>
          <RotationButton face={face} clockwise={true} />
          <RotationButton face={face} clockwise={false} />
        </Fragment>
      ))}
    </div>
  );
};

const RotationButton = ({
  face,
  clockwise,
}: {
  face: Face;
  clockwise: boolean;
}) => {
  const handleClick = () => {
    console.log(face, clockwise);
  };

  return (
    <button
      className="bg-white cursor-pointer rounded-sm shadow w-6 h-6 flex justify-center items-center hover:[background-color:var(--hover-bg)]"
      style={{ "--hover-bg": DEFAULT_CUBE_COLORS[face] } as any}
      onClick={handleClick}
    >
      {clockwise ? face : `${face}'`}
    </button>
  );
};
