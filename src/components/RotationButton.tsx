"use client";

import { DEFAULT_CUBE_COLORS } from "@/cube-colors";
import { Face } from "@/enums";
import { useCubeControl } from "@/hooks/useCubeControl";
import { useGameSocket } from "@/providers/GameSocketContext";
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
  const { rotateCube } = useCubeControl();
  const { emitRotateCube } = useGameSocket();

  const handleClick = () => {
    rotateCube(face, clockwise);
    emitRotateCube({
      face,
      clockwise,
      timestamp: Date.now(),
    });
  };

  return (
    <button
      className="bg-white cursor-pointer rounded-sm shadow w-6 h-6 flex justify-center items-center hover:[background-color:var(--hover-bg)]"
      style={{ "--hover-bg": DEFAULT_CUBE_COLORS[face] } as any}
      title={clockwise ? "시계방향" : "반시계방향"}
      onClick={handleClick}
    >
      {clockwise ? face : `${face}'`}
    </button>
  );
};
