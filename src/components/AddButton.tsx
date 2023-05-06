import {
  UnstyledButton,
  UnstyledButtonProps,
  createStyles,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { HTMLAttributes } from "react";

const useStyles = createStyles((theme) => ({
  root: {
    position: "fixed",
    right: theme.spacing.xs,
    bottom: theme.spacing.xs,
    zIndex: 1000,
    width: 30,
    height: 30,
    borderRadius: theme.spacing.xs,
    background: theme.colors.indigo[6],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: theme.shadows.md,
    transition: "background 0.15s linear",
    opacity: 0.8,
    "&:hover": {
      background: theme.colors.indigo[8],
      boxShadow: theme.shadows.lg,
    },
    "&:active": {
      boxShadow: theme.shadows.lg,
      transform: "translate(0, 1px)",
    },
    "& > svg": {
      color: theme.white,
    },
  },
}));

type AddButtonProps = HTMLAttributes<HTMLButtonElement> & UnstyledButtonProps;

const AddButton: React.FC<AddButtonProps> = (props) => {
  const { classes } = useStyles();

  return (
    <UnstyledButton className={classes.root} {...props}>
      <IconPlus size={18} />
    </UnstyledButton>
  );
};

export default AddButton;
