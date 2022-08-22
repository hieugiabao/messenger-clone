import React, { FC, FormEvent, lazy, Suspense, useRef, useState } from "react";
import { Spin } from "react-cssfx-loading/lib";
import ClickListener from "../ClickListener";
import StickerIcon from "../Icon/StickerIcon";
import StickerPicker from "./StickerPicker";

const Picker = lazy(() => import("./EmojiPicker"));

interface InputSectionProps {
  disabled: boolean;
}

const InputSection: FC<InputSectionProps> = ({ disabled }) => {
  const [isStickerPickerOpened, setIsStickerPickerOpened] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isEmojiPickerOpened, setIsEmojiPickerOpened] = useState(false);

  const textInputRef = useRef<HTMLInputElement>(null);

  const sendSticker = (url: string) => {
    console.log("Sticker sent: " + url);
  };

  const handleFormSubmit = (e: FormEvent) => {
    console.log("submit");
  };

  const addIconToInput = (value: any) => {
    const start = textInputRef.current?.selectionStart as number;
    const end = textInputRef.current?.selectionEnd as number;
    const splitted = inputValue.split("");
    splitted.splice(start, end - start, value);
    setInputValue(splitted.join(""));
  };

  return (
    <div
      className={`border-dark-lighten flex items-stretch h-16 gap-1 border-t px-4 ${
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

      <form
        className="flex flex-grow items-stretch gap-1"
        onSubmit={handleFormSubmit}
      >
        <div className="relative flex flex-grow items-center">
          <input
            type="text"
            ref={textInputRef}
            maxLength={1000}
            disabled={disabled}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-dark-lighten h-9 w-full rounded-full pl-3 pr-10 outline-none"
            placeholder="Message..."
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={(e) => {
              e.stopPropagation();
              setIsEmojiPickerOpened(true);
            }}
          >
            <i className="bx bxs-smile text-primary text-2xl"></i>
          </button>
          {isEmojiPickerOpened && (
            <ClickListener onClick={() => setIsEmojiPickerOpened(false)}>
              {(ref) => (
                <div className="absolute bottom-full right-0" ref={ref}>
                  <Suspense
                    fallback={
                      <div className="flex h-[357px] w-[348px] items-center justify-center rounded-lg border-2 border-[#555453] bg-[#222]">
                        <Spin />
                      </div>
                    }
                  >
                    <Picker
                      onSelect={(emoji) => addIconToInput(emoji.native)}
                    />
                  </Suspense>
                </div>
              )}
            </ClickListener>
          )}
        </div>
        <button className="text-primary flex flex-shrink-0 items-center text-2xl">
          <i className="bx bxs-send"></i>
        </button>
      </form>
    </div>
  );
};

export default InputSection;
