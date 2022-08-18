import React, { FC, useState } from "react";
import StickerIcon from "../Icon/StickerIcon";
import StickerPicker from "./StickerPicker";

interface InputSectionProps {
  disabled: boolean;
}

const InputSection: FC<InputSectionProps> = ({ disabled }) => {
  const [isStickerPickerOpened, setIsStickerPickerOpened] = useState(false);

  const sendSticker = (url: string) => {
    console.log("Sticker sent: " + url);
  };

  return (
    <div
      className={`mt-96 border-dark-lighten flex items-stretch h-16 gap-1 border-t px-4 ${
        disabled ? "pointer-events-non select-none" : ""
      }`}
    >
      <div className="relative flex flex-shrink-0 items-center">
        {isStickerPickerOpened && (
          <StickerPicker
            setIsOpened={setIsStickerPickerOpened}
            onSelect={sendSticker}
          />
        )}
        <button
          className="flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            setIsStickerPickerOpened(true);
          }}
        >
          <StickerIcon />
        </button>
      </div>
    </div>
  );
};

export default InputSection;
