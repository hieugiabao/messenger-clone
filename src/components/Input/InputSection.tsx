import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, {
  ChangeEvent,
  FC,
  FormEvent,
  KeyboardEvent,
  lazy,
  Suspense,
  useRef,
  useState,
} from "react";
import { Spin } from "react-cssfx-loading/lib";
import { useParams } from "react-router-dom";
import { EMOJI_REPLACEMENT } from "../../constants";
import { db, storage } from "../../firebase";
import { useStore } from "../../store";
import { formatFilename } from "../../utils/formatFilename";
import Alert from "../Alert";
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
  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [fileUploading, setFileUploading] = useState(false);

  const textInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { id: conversationId } = useParams();

  const currentUser = useStore((state) => state.currentUser);

  const updateTimestap = () => {
    updateDoc(doc(db, "conversations", conversationId as string), {
      updatedAt: serverTimestamp(),
    });
  };

  const sendSticker = (url: string) => {
    addDoc(
      collection(db, "conversations", conversationId as string, "messages"),
      {
        sender: currentUser?.uid,
        content: url,
        type: "sticker",
        createdAt: serverTimestamp(),
      }
    );

    updateTimestap();
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    setInputValue("");
    let replacedInput = ` ${inputValue} `;

    Object.entries(EMOJI_REPLACEMENT).map(([key, value]) => {
      value.forEach((item) => {
        replacedInput = replacedInput.split(` ${item} `).join(` ${key} `);
      });
    });

    addDoc(
      collection(db, "conversations", conversationId as string, "messages"),
      {
        sender: currentUser?.uid,
        content: replacedInput.trim(),
        type: "text",
        createdAt: serverTimestamp(),
        replyTo: null,
      }
    );
    updateTimestap();
  };

  const addIconToInput = (value: any) => {
    const start = textInputRef.current?.selectionStart as number;
    const end = textInputRef.current?.selectionEnd as number;
    const splitted = inputValue.split("");
    splitted.splice(start, end - start, value);
    setInputValue(splitted.join(""));
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    try {
      const MAX_FILE_SIZE = 1024 * 1024 * 20;
      if (file.size > MAX_FILE_SIZE) {
        setAlertText("Max file is 20MB");
        setIsAlertOpened(true);
        return;
      }

      setFileUploading(true);

      const fileReference = ref(storage, formatFilename(file.name));

      await uploadBytes(fileReference, file);

      const downloadURL = await getDownloadURL(fileReference);

      addDoc(
        collection(db, "conversations", conversationId as string, "messages"),
        {
          sender: currentUser?.uid,
          content: downloadURL,
          type: file.type.startsWith("image") ? "image" : "file",
          file: file.type.startsWith("image")
            ? null
            : {
                name: file.name,
                size: file.size,
              },
          createdAt: serverTimestamp(),
        }
      );

      setFileUploading(false);
      updateTimestap();
    } catch (e) {
      console.dir(e);
      setFileUploading(false);
    }
  };

  const handleReplaceEmoji = (e: KeyboardEvent<HTMLInputElement>) => {
    let element: HTMLInputElement = e.target as HTMLInputElement;
    if (e.key === " ") {
      if (element.selectionStart !== element.selectionEnd) return;

      const lastWord = inputValue
        .slice(0, element.selectionStart as number)
        .split(" ")
        .slice(-1)[0];

      if (lastWord.length === 0) return;

      Object.entries(EMOJI_REPLACEMENT).map(([key, value]) => {
        value.forEach((item) => {
          if (lastWord === item) {
            const splitted = inputValue.split("");
            splitted.splice(
              (element.selectionStart as number) - lastWord.length,
              lastWord.length,
              key
            );
            setInputValue(splitted.join(""));
            return;
          }
        });
      });
    }
  };

  return (
    <>
      <div
        className={`border-dark-lighten flex items-stretch h-16 gap-1 border-t px-4 ${
          disabled ? "pointer-events-non select-none" : ""
        }`}
      >
        <button
          onClick={() => imageInputRef.current?.click()}
          className="text-primary flex flex-shrink-0 items-center text-2xl"
          title="Image"
        >
          <i className="bx bxs-image-add"></i>
        </button>
        <input
          type="file"
          ref={imageInputRef}
          hidden
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-primary flex flex-shrink-0 items-center text-2xl"
          title="File"
        >
          <i className="bx bx-link-alt"></i>
        </button>
        <input
          type="file"
          className="hidden"
          hidden
          ref={fileInputRef}
          onChange={handleFileInputChange}
        />
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
            title="Sticker"
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
              onKeyDown={handleReplaceEmoji}
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
          {fileUploading ? (
            <div className="ml-1 flex-items-center">
              <Spin width="24px" height="24px" color="#0D90F3" />
            </div>
          ) : (
            <button className="text-primary flex flex-shrink-0 items-center text-2xl">
              <i className="bx bxs-send"></i>
            </button>
          )}
        </form>
      </div>

      <Alert
        isOpened={isAlertOpened}
        setIsOpened={setIsAlertOpened}
        content={alertText}
        isError
      />
    </>
  );
};

export default InputSection;
