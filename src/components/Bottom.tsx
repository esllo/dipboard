import { Text, Tooltip, createStyles } from "@mantine/core";
import IconGithub from "./IconGithub";
import { shell } from "@tauri-apps/api";

const useStyles = createStyles((theme) => ({
  root: {
    padding: "6px 0 0",
    height: 36,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    position: "relative",
    gap: 12,
  },
  icon: {
    cursor: "pointer",
    position: "absolute",
    left: 0,
  },
  author: {
    justifySelf: "center",
    userSelect: "none",
    cursor: "pointer",
    color: theme.colors.gray[6],
    fontStyle: "italic",
  },
}));

const Bottom: React.FC = () => {
  const { classes } = useStyles();

  function handleGithubClick() {
    shell.open("https://github.com/esllo/dipboard");
  }

  function handleNameClick() {
    shell.open("https://github.com/esllo");
  }

  return (
    <>
      <div className={classes.root}>
        <Tooltip label="dipboard">
          <IconGithub
            className={classes.icon}
            width={20}
            height={20}
            onClick={handleGithubClick}
          />
        </Tooltip>
        <Text size={"sm"} onClick={handleNameClick} className={classes.author}>
          esllo
        </Text>
      </div>
    </>
  );
};

export default Bottom;
