"use client";
import React, { useState } from "react";
import { Button } from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import { useSearchContext } from "@/context/search-context.jsx";

export default function ReplyButton() {
  const { isReplying, setIsReplying } = useSearchContext();
  return (
    <Button
      onClick={() => setIsReplying(!isReplying)}
      startIcon={<ReplyIcon />}
    >
      Reply
    </Button>
  );
}
