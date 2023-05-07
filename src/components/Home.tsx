import AddButton from "@/components/AddButton";
import Clip from "@/components/Clip";
import ClipList from "@/components/ClipList";
import Bottom from "@/components/Bottom";
import Top from "@/components/TopTab";
import { Clipboard, useClipboard } from "@/hooks/useClipboard";
import ClipAddModal from "@/components/ClipAddModal";
import { useState } from "react";
import { useClipboardChange } from "@/hooks/useClipboardChange";
import { pngToUrl } from "@/utils/image";
import { Image } from "@mantine/core";
import { writeClipboard, writeClipboardImage } from "@/utils/clipboard";

interface useHomeOptions {
  onClipAdd?: (text: string) => void;
}

function useHome({ onClipAdd }: useHomeOptions = {}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleModalOpen() {
    setIsOpen(true);
  }

  function handleModalClose() {
    setIsOpen(false);
  }

  function handleClipAdd(text: string) {
    onClipAdd?.(text);
  }

  return {
    isOpen,
    handleModalOpen,
    handleModalClose,
    handleClipAdd,
  };
}

const tabs = [
  { id: "permanent", text: "저장됨" },
  { id: "session", text: "수집됨" },
];

function getClipContent(clip: Clipboard) {
  if (clip.type === "text") {
    return clip.text;
  }

  if (clip.type === "image") {
    return <Image src={clip.url} alt={clip.id} />;
  }

  return "";
}

function handleClipClick(clip: Clipboard) {
  return () => {
    if (clip.type === "text") {
      writeClipboard(clip.text);
    }

    if (clip.type === "image") {
      writeClipboardImage(clip.image).catch(console.error);
    }
  };
}

const Home: React.FC = () => {
  const permanentClipboard = useClipboard("clipboard");
  const sessionClipboard = useClipboard();

  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const isPermanent = activeTab === tabs[0].id;

  const currentBoard = isPermanent ? permanentClipboard : sessionClipboard;

  const { isOpen, handleModalOpen, handleModalClose, handleClipAdd } = useHome({
    onClipAdd: (text) => {
      permanentClipboard.addClipboard({
        type: "text",
        text,
      });
    },
  });

  useClipboardChange({
    onChange: (clipboard) => {
      if (clipboard.Text) {
        // text
        const text = clipboard.Text;
        if (
          !permanentClipboard.hasContent(text) &&
          !sessionClipboard.hasContent(text)
        ) {
          sessionClipboard.addClipboard({
            type: "text",
            text,
          });
        }
      }

      if (clipboard.Image) {
        // image
        const { hash, image_box } = clipboard.Image;

        const url = pngToUrl(image_box.data);

        sessionClipboard.addClipboard({
          type: "image",
          image: image_box.data,
          url,
          hash,
        });
      }
    },
    deps: [sessionClipboard.clipboard],
  });

  return (
    <>
      <Top tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <ClipList>
        {currentBoard.clipboard
          .slice()
          .reverse()
          .map((clip) => (
            <Clip
              key={clip.id}
              onDelete={() => currentBoard.removeClipboard(clip.id)}
              onClick={handleClipClick(clip)}
            >
              {getClipContent(clip)}
            </Clip>
          ))}
      </ClipList>
      <Bottom />
      <AddButton onClick={handleModalOpen} />
      <ClipAddModal
        isOpen={isOpen}
        onClose={handleModalClose}
        onAdd={handleClipAdd}
      />
    </>
  );
};

export default Home;
