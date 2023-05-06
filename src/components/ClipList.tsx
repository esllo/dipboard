import { createStyles } from "@mantine/core";
import { PropsWithChildren } from "react";

const useStyles = createStyles((theme) => ({
  root: {
    overflow: "auto",
    maxHeight: "100%",
    height: "100%",
    padding: "0 4px 4px",
    "& > div": {
      display: "flex",
      gap: theme.spacing.xs,
      flexDirection: "column",
    },
  },
}));

const ClipList: React.FC<PropsWithChildren> = ({ children }) => {
  const { classes } = useStyles();
  return (
    <div className={classes.root}>
      <div>{children}</div>
    </div>
  );
};

export default ClipList;
