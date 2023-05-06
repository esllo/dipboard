import { writeClipboard } from "@/utils/clipboard";
import {
  ActionIcon,
  Text,
  UnstyledButton,
  UnstyledButtonProps,
  createStyles,
} from "@mantine/core";
import { IconCornerDownLeft, IconTrash, IconTrashX } from "@tabler/icons-react";
import { HTMLAttributes, useRef, useState } from "react";
import { generate } from "short-uuid";

const useStyles = createStyles((theme) => ({
  root: {
    borderRadius: theme.spacing.xs,
    background: theme.white,
    boxShadow: theme.shadows.sm,
    textAlign: "left",
    transition: "background 0.15s linear",
    position: "relative",
    userSelect: "none",
    "&:hover": {
      background: theme.colors.gray[1],
      boxShadow: theme.shadows.lg,
    },
    "&:active": {
      boxShadow: theme.shadows.lg,
      transform: "translate(0, 1px)",
    },
  },
  trash: {
    position: "absolute",
    right: theme.spacing.xs,
    top: theme.spacing.xs,
    bottom: theme.spacing.xs,
    transition: "transform .15s linear",
    "&:hover": {
      transform: "scale(1.1)",
    },
    "&:active": {
      transform: "scale(1.2)",
    },
  },
  text: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginRight: theme.spacing.xl,
    display: "flex",
    alignItems: "center",
  },
}));

function parseText(text: string) {
  const id = generate();
  const splitted = text.split("\n");
  return splitted.flatMap((line, index) => {
    if (index < splitted.length - 1) {
      return [
        line,
        <IconCornerDownLeft key={`${id}-${index}`} size={14} stroke={1} />,
      ];
    }
    return [line];
  });
}

type ClipProps = HTMLAttributes<HTMLDivElement> &
  UnstyledButtonProps & {
    onDelete?: () => void;
  };

const Clip: React.FC<ClipProps> = ({ children, onDelete, ...props }) => {
  const { classes } = useStyles();
  const [confirm, setConfirm] = useState<boolean>(false);
  const handler = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleDeleteClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (handler.current) {
      handler.current = null;
    }
    if (confirm) {
      onDelete?.();
      setConfirm(false);
    } else {
      setConfirm(true);
      handler.current = setTimeout(() => {
        if (handler.current) {
          setConfirm(false);
          handler.current = null;
        }
      }, 2000);
    }
  }

  return (
    <UnstyledButton
      component="div"
      role="button"
      onClick={() => writeClipboard((children || "").toString())}
      className={classes.root}
      p={"xs"}
      {...props}
    >
      <Text className={classes.text}>
        {parseText(children?.toString() || "")}
      </Text>
      <ActionIcon
        variant=""
        className={classes.trash}
        size={24}
        onClick={handleDeleteClick}
      >
        {confirm ? (
          <IconTrashX size={20} stroke={1.5} color="red" />
        ) : (
          <IconTrash size={20} stroke={1.5} />
        )}
      </ActionIcon>
    </UnstyledButton>
  );
};

export default Clip;
