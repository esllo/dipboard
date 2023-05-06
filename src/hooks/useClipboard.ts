import { readAppData, writeAppData } from "@/utils/storage";
import { useEffect, useRef, useState } from "react";
import uuid from "short-uuid";

export type TextClipbaord = {
  id: string;
  type: "text";
  text: string;
};

export type ImageClipbaord = {
  id: string;
  type: "image";
  image: string;
};

export type Clipboard = TextClipbaord;

const idGen = uuid(uuid.constants.cookieBase90);

function writeToStorage(storage: false | string) {
  if (storage) {
    return (data: Clipboard[]) =>
      writeAppData(storage, data).catch(console.error);
  }

  return () => Promise.resolve();
}

export function useClipboard(storage: false | string = false) {
  const [clipboard, setClipboard] = useState<Clipboard[]>([]);
  const write = useRef(writeToStorage(storage));

  useEffect(() => {
    if (storage) {
      readAppData(storage, [])
        .then((data) => {
          if (data) {
            try {
              setClipboard(data);
            } catch (e) {
              console.error(e);
            }
          }
        })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addNewClipboard(clip: Omit<Clipboard, "id">) {
    setClipboard((prev) => {
      const newClips = [
        ...prev,
        {
          ...clip,
          id: idGen.new(),
        },
      ];
      write.current(newClips);
      return newClips;
    });
  }

  function addExistsClipboard(id: string) {
    setClipboard((prev) => {
      const clipIndex = prev.findIndex(({ id: _id }) => _id === id);
      const newClips = [...prev];
      const clip = newClips.splice(clipIndex, 1)[0];
      newClips.push(clip);
      write.current(newClips);
      return newClips;
    });
  }

  function addClipboard(clip: Omit<Clipboard, "id">) {
    const existId = findTextId(clip.text);

    if (existId) {
      addExistsClipboard(existId);
    } else {
      addNewClipboard(clip);
    }
  }

  function removeClipboard(id: string) {
    setClipboard((prev) => {
      const newClips = prev.filter((clip) => clip.id !== id);
      write.current(newClips);
      return newClips;
    });
  }

  function hasText(findText: string) {
    return findTextId(findText) !== null;
  }

  function findTextId(findText: string): string | null {
    const clip = clipboard.find(({ text }) => text === findText);
    return clip ? clip.id : null;
  }

  return {
    clipboard,
    addClipboard,
    removeClipboard,
    hasText,
  };
}
