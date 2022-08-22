import React, { FC, useEffect, useRef } from "react";
import { BaseEmoji, Picker } from "emoji-mart";

interface EmojiPickerProps {
  onSelect: (emoji: BaseEmoji) => void;
}

const EmojiPicker: FC<EmojiPickerProps> = ({ onSelect }) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    const picker = new Picker({
      set: "facebook",
      enableFrequentEmojiSort: true,
      onEmojiSelect: onSelect,
      theme: "dark",
      showPreview: false,
      showSkinTones: false,
      emojiTooltip: true,
      defaultSkin: 1,
      color: "#0F8FF3",
      native: true,
    });
    ref.current?.appendChild(picker);
  }, []);

  return <div ref={ref}></div>;
};

export default EmojiPicker;
