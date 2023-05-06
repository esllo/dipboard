import {
  Button,
  Modal,
  Textarea,
  TextareaProps,
  createStyles,
} from "@mantine/core";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

const useStyles = createStyles((theme) => ({
  overlay: {
    margin: 5,
    borderRadius: theme.radius.md,
  },
}));

interface TextAreaProps extends TextareaProps {
  onCtrlEnter?: () => void;
}

const TextArea: React.FC<TextAreaProps> = ({ onCtrlEnter, ...props }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    setTimeout(() => {
      ref.current?.focus();
    }, 100);
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      onCtrlEnter?.();
    }
  }

  return <Textarea onKeyDown={handleKeyDown} ref={ref} {...props} />;
};

interface ClipAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (text: string) => void;
}

const ClipAddModal: React.FC<ClipAddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const { classes } = useStyles();
  const [text, setText] = useState<string>("");

  function handleTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
  }

  function handleAddClick() {
    if (isOpen && text) {
      onAdd?.(text);
    }
    setText("");
    onClose();
  }

  function handleCloseClick() {
    setText("");
    onClose();
  }

  return (
    <Modal
      title={"텍스트 추가"}
      opened={isOpen}
      onClose={handleCloseClick}
      centered
      classNames={classes}
      zIndex={1000}
    >
      <TextArea
        minRows={5}
        value={text}
        onChange={handleTextChange}
        onCtrlEnter={handleAddClick}
      />
      <Button mt={"md"} onClick={handleAddClick}>
        추가
      </Button>
    </Modal>
  );
};

export default ClipAddModal;
