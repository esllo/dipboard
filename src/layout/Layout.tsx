import DragArea from "@/components/DragArea";
import { Paper, createStyles } from "@mantine/core";
import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const useStyles = createStyles((theme) => ({
  root: {
    borderRadius: theme.radius.md,
    height: "100%",
    padding: theme.spacing.xs,
    background: theme.colors.gray[2],
    display: "flex",
    flexDirection: "column",
    boxShadow: "rgba(0, 0, 0, 0.5) 0 1px 5px 1px",
  },
  empty: {
    height: 36,
  },
}));

const TauriDynamic = dynamic(() => import("@/components/Tauri"), {
  ssr: false,
});

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { classes } = useStyles();
  return (
    <TauriDynamic>
      <Paper className={classes.root}>
        <DragArea />
        {children}
      </Paper>
    </TauriDynamic>
  );
};

export default Layout;
