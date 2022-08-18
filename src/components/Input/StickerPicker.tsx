import React, { FC, Fragment, useState } from "react";
import { Spin } from "react-cssfx-loading/lib";
import { STICKERS_URL } from "../../constants";
import { useFetch } from "../../hooks/useFetch";
import { StickerCollections } from "../../types/Sticker";
import ClickListener from "../ClickListener";
import SpriteRenderer from "./SpriteRenderer";

interface StickerPickerProps {
  setIsOpened: (value: boolean) => void;
  onSelect: (value: string) => void;
}

const getRecentStickers = () => {
  const current = localStorage.getItem("recent-stickers") || "[]";
  try {
    const parsed = JSON.parse(current);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    return [];
  }
};

const StickerPicker: FC<StickerPickerProps> = ({ setIsOpened, onSelect }) => {
  const { data, loading, error } = useFetch<StickerCollections>(
    "sticker",
    () => {
      return fetch(STICKERS_URL).then((res) => res.json());
    }
  );

  const [recentStickers, setRecentStickers] = useState(getRecentStickers());

  const addRecentStickers = (url: string) => {
    const added = [...new Set([url, ...recentStickers])];
    localStorage.setItem("recent-stickers", JSON.stringify(added));
    setRecentStickers(added);
  };

  return (
    <ClickListener onClick={() => setIsOpened(false)}>
      {(ref) => (
        <div
          className="border-dark-lighten absolute -left-16 bottom-full h-96 w-96 rounded-lg border-2 shadow-2xl bg-[#222]"
          ref={ref}
        >
          {loading || error ? (
            <div className="flex h-full w-full items-center justify-center">
              <Spin />
            </div>
          ) : (
            <div className="flex h-full w-full flex-col">
              <div className="flex-grow overflow-y-auto p-3 pt-1">
                <>
                  {recentStickers.length > 0 && (
                    <>
                      <h1 className="mt-2" id="recent-stickers">
                        Recent Stickers
                      </h1>
                      <div className="grid w-full grid-cols-5 justify-between">
                        {recentStickers.map((url) => (
                          <SpriteRenderer
                            src={url}
                            size={60}
                            onClick={() => {
                              onSelect(url);
                              addRecentStickers(url);
                              setIsOpened(false);
                            }}
                            className="hover:bg-dark-lighten cursor-pointer"
                            runOnHover
                            key={url}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {data?.map((collection) => (
                    <Fragment key={collection.id}>
                      <h1 className="mt-2" id={`sticker-${collection.id}`}>
                        {collection.name}
                      </h1>
                      <div className="grid w-full grid-cols-5 justify-between">
                        {collection.stickers.map((sticker) => (
                          <SpriteRenderer
                            src={sticker.spriteURL}
                            size={60}
                            onClick={() => {
                              onSelect(sticker.spriteURL);
                              addRecentStickers(sticker.spriteURL);
                              setIsOpened(false);
                            }}
                            className="hover:bg-dark-lighten cursor-pointer"
                            runOnHover
                            key={sticker.spriteURL}
                          />
                        ))}
                      </div>
                    </Fragment>
                  ))}
                </>
              </div>

              <div className="h-18 border-t-dark-lighten flex w-full flex-shrink-0 gap-2 overflow-x-auto border-t p-2">
                {recentStickers.length > 0 && (
                  <button
                    className="flex h-9 w-9 items-center"
                    onClick={() =>
                      document
                        .querySelector("#recent-stickers")
                        ?.scrollIntoView()
                    }
                  >
                    <i className="bx bx-time text-[26px] leading-[26px]"></i>
                  </button>
                )}
                {data?.map((collection) => (
                  <img
                    onClick={() =>
                      document
                        .querySelector(`#sticker-${collection.id}`)
                        ?.scrollIntoView()
                    }
                    className="h-9 w-9 cursor-pointer object-cover"
                    src={collection.icon}
                    alt=""
                    key={collection.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ClickListener>
  );
};

export default StickerPicker;
