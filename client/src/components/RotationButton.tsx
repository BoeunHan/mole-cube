"use client";

import Image from "next/image";
import { Face } from "@/enums";
import { useGameSocket } from "@/providers/GameSocketContext";
import { Fragment } from "react";
import { RotateCcwIcon, RotateCwIcon } from "lucide-react";

export const RotationButtonList = () => {
  return (
    <div className="grid grid-flow-col auto-rows-fr grid-rows-2 gap-1">
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
      className="font-neodgm relative flex aspect-square cursor-pointer items-center justify-center text-[18px]"
      title={clockwise ? "시계방향" : "반시계방향"}
      onClick={handleClick}
    >
      <Image
        src="/assets/bt_blank.png"
        alt={`${face} ${clockwise ? "시계방향" : "반시계방향"} 회전 버튼`}
        fill
        className="object-cover"
        unoptimized
        draggable={false}
      />

      <span className="font-neodgm z-10">{face}</span>
      {clockwise ? (
        <RotateCwIcon
          strokeWidth={1.5}
          className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 text-stone-400"
        />
      ) : (
        <RotateCcwIcon
          strokeWidth={1.5}
          className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 text-stone-400"
        />
      )}
    </button>
  );
};
