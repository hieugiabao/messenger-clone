export interface StickerCollection {
  name: string;
  thumbnail: string;
  icon: string;
  id: string;
  stickers: {
    id: string;
    spriteURL: string;
  }[];
}

export type StickerCollections = StickerCollection[];
