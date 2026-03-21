"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGameSocket } from "@/providers/GameSocketContext";
import { localStorageUtil } from "@/lib/utils";
import { NICKNAME_KEY } from "@/constants";
import Filter from "badwords-ko";
import { useToast } from "mole-toast";

export const NicknameDialog = () => {
  const { emitJoinGame } = useGameSocket();
  const toast = useToast();

  const [open, setOpen] = useState(true);
  const [nickname, setNickname] = useState(
    localStorageUtil.getValue(NICKNAME_KEY) || "",
  );

  const handleSubmit = () => {
    const error = getError(nickname);
    if (error) {
      toast.shortWarning(error);
      return;
    }
    emitJoinGame(nickname.trim());
    localStorageUtil.setValue(NICKNAME_KEY, nickname);

    setOpen(false);
  };

  const getError = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue.length > 7) return "닉네임은 7글자 이하여야 해요.";
    if (trimmedValue.length === 0) return "닉네임을 입력해주세요.";
    const filter = new Filter();
    filter.addWords(...ADDITIONAL_BAD_WORDS);
    if (filter.isProfane(trimmedValue)) return "사용할 수 없는 닉네임이에요.";
    return false;
  };

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>사용할 닉네임</DialogTitle>
        </DialogHeader>
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="입력"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <Button
          variant="secondary"
          className="mt-4 cursor-pointer"
          onClick={handleSubmit}
        >
          접속
        </Button>
      </DialogContent>
    </Dialog>
  );
};

const ADDITIONAL_BAD_WORDS = [
  "ㅅㅂ",
  "ㅂㅅ",
  "ㅅㅂㅅㄲ",
  "ㅅㄲ",
  "ㅂㅅㅅㄲ",
  "ㅗ",
  "새끼",
];
