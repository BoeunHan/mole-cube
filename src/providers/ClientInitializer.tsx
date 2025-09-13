"use client";

import { useEffect } from "react";
import { createUUID, localStorageUtil } from "@/lib/utils";
import { USERID_KEY } from "@/constants";

export const ClientInitializer = () => {
  const setUUID = () => {
    const userId = localStorageUtil.getValue(USERID_KEY);
    if (!userId) {
      const newUserId = createUUID();
      localStorageUtil.setValue(USERID_KEY, newUserId);
    }
  };

  useEffect(() => {
    setUUID();
  }, []);

  return null;
};
