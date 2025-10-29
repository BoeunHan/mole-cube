"use client";

import Image from "next/image";
import { Face } from "@/enums";
import { useGameSocket } from "@/providers/GameSocketContext";
import { Fragment } from "react";

export const RotationButtonList = () => {
  return (
    <div className="grid w-full max-w-60 grid-flow-col auto-rows-fr grid-rows-2 gap-2">
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
  const { emitRotateCube } = useGameSocket();

  const handleClick = () => {
    emitRotateCube({
      face,
      clockwise,
    });
  };

  return (
    <button
      className="font-neodgm relative flex aspect-square items-center justify-center text-[18px]"
      title={clockwise ? "시계방향" : "반시계방향"}
      onClick={handleClick}
    >
      <Image
        src="/assets/bt_blank.png"
        alt="이미지 버튼"
        fill
        className="object-cover"
      />
      <span className="z-10">{clockwise ? face : `${face}'`}</span>
    </button>
  );
};
