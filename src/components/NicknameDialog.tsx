"use client";

import { useState } from "react";
import { useGameSocket } from "@/providers/GameSocketContext";
import { localStorageUtil } from "@/lib/utils";
import { NICKNAME_KEY } from "@/constants";
import { Button, Modal, Post, TextField } from "@toss/tds-mobile";

export const NicknameDialog = () => {
  const { emitJoinGame } = useGameSocket();

  const [open, setOpen] = useState(true);
  const [nickname, setNickname] = useState(
    localStorageUtil.getValue(NICKNAME_KEY) || "",
  );

  const handleSubmit = () => {
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) return;
    if (handleError(trimmedNickname)) return;

    emitJoinGame(trimmedNickname);
    localStorageUtil.setValue(NICKNAME_KEY, nickname);

    setOpen(false);
  };

  const handleError = (value: string) => {
    return value.trim().length > 7
      ? "exceed"
      : value.trim().length === 0
        ? "blank"
        : false;
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Overlay />
      <Modal.Content
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <Post.H4>사용할 닉네임</Post.H4>
        <TextField
          variant={"box"}
          placeholder="닉네임 입력"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          help={
            handleError(nickname) === "exceed"
              ? "닉네임은 7글자 이하여야 해요."
              : handleError(nickname) === "blank"
                ? "닉네임을 입력해주세요."
                : null
          }
          hasError={!!handleError(nickname)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <Button
          size="medium"
          display="block"
          color="primary"
          onClick={handleSubmit}
        >
          접속하기
        </Button>
      </Modal.Content>
    </Modal>
  );
};
