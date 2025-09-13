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

export const NicknameDialog = () => {
  const { setNickname: emitNickname } = useGameSocket();

  const [open, setOpen] = useState(true);
  const [nickname, setNickname] = useState(
    localStorageUtil.getValue(NICKNAME_KEY) || ""
  );

  const handleSubmit = () => {
    // TODO: 닉네임 경고 toast
    if (!nickname.trim()) return;
    emitNickname(nickname.trim());
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>사용할 닉네임:</DialogTitle>
        </DialogHeader>
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="입력"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <Button className="mt-4" onClick={handleSubmit}>
          접속
        </Button>
      </DialogContent>
    </Dialog>
  );
};
