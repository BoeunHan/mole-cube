"use client";

import Image from "next/image";
import { Face } from "@/enums";
import { useGameSocket } from "@/providers/GameSocketContext";
import { Fragment } from "react";

export const RotationButtonList = () => {
  return (
    <div className="flex h-24 w-fit flex-col flex-wrap gap-2">
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
      timestamp: Date.now(),
    });
  };

  return (
    <button
      className="font-neodgm relative flex h-10 w-10 cursor-pointer items-center justify-center text-[22px]"
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
