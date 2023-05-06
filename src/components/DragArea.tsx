import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  root: {
    width: "100%",
    height: theme.spacing.sm,
    position: "fixed",
    left: 5,
    right: 5,
    top: 5,
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  bar: {
    width: 40,
    height: 2,
    borderRadius: 2,
    background: theme.colors.gray[5],
    pointerEvents: "none",
  },
}));

const DragArea: React.FC = () => {
  const { classes } = useStyles();
  return (
    <div data-tauri-drag-region className={classes.root}>
      <div className={classes.bar}></div>
    </div>
  );
};

export default DragArea;
