import { useContextMenu } from "@/hooks/useContextMenu";
import { registerShortcut } from "@/utils/globalShortcut";
import { focusWindow, hideWindow, showWindow } from "@/utils/window";
import { CloseButton, createStyles } from "@mantine/core";
import { unregisterAll } from "@tauri-apps/api/globalShortcut";
import { NextPage } from "next";
import { PropsWithChildren, useEffect, useState } from "react";

const useStyles = createStyles((theme) => ({
  close: {
    position: "fixed",
    right: theme.spacing.sm,
    top: theme.spacing.sm,
    zIndex: 1000,
    transition: "color 0.15s linear, background 0.15s linear",
    "&:hover": {
      background: theme.colors.gray[3],
      color: theme.colors.gray[7],
    },
  },
}));

const Tauri: NextPage<PropsWithChildren> = ({ children }) => {
  const { classes } = useStyles();
  const [isRendered, setIsRendered] = useState<boolean>(false);
  useContextMenu();

  function handleKeyboardEvent(e: KeyboardEvent) {
    if (e.key === "Escape") {
      hideWindow();
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardEvent);
    registerShortcut("CmdOrCtrl+Alt+X", async () => {
      await showWindow();
      focusWindow();
    });

    setIsRendered(true);

    return () => {
      window.removeEventListener("keydown", handleKeyboardEvent);
      unregisterAll();
    };
  }, []);

  if (!isRendered) return <></>;

  return (
    <>
      <CloseButton className={classes.close} onClick={hideWindow} />
      {children}
    </>
  );
};

export default Tauri;
