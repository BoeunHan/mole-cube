import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { localStorageUtil } from "@/lib/utils";
import { NICKNAME_KEY } from "@/constants";

export const NicknameDialog = () => {
  const [open, setOpen] = useState(true);
  const [nickname, setNickname] = useState("");

  const savedNickname = localStorageUtil.getValue(NICKNAME_KEY);

  const handleSubmit = () => {
    if (!nickname.trim()) return;
    localStorageUtil.setValue(NICKNAME_KEY, nickname);
    setOpen(false);
  };

  return (
    <Dialog open={!savedNickname && open}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>사용할 닉네임:</DialogTitle>
        </DialogHeader>
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="두더지"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <Button className="mt-4" onClick={handleSubmit}>
          접속
        </Button>
      </DialogContent>
    </Dialog>
  );
};
