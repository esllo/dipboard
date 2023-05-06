import AddButton from "@/components/AddButton";
import Clip from "@/components/Clip";
import ClipList from "@/components/ClipList";
import Bottom from "@/components/Bottom";
import Top from "@/components/TopTab";
import { useClipboard } from "@/hooks/useClipboard";
import ClipAddModal from "@/components/ClipAddModal";
import { useState } from "react";
import { useClipboardChange } from "@/hooks/useClipboardChange";

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
      if (
        clipboard &&
        clipboard !== "" &&
        !permanentClipboard.hasText(clipboard) &&
        !sessionClipboard.hasText(clipboard)
      ) {
        sessionClipboard.addClipboard({
          type: "text",
          text: clipboard,
        });
      }
    },
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
            >
              {clip.type === "text" && clip.text}
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
