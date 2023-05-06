import { Tabs, createStyles } from "@mantine/core";

const useStyles = createStyles(() => ({
  root: {
    height: 40,
    boxSizing: "border-box",
    margin: "18px 4px 8px",
  },
}));

type Tab = {
  id: string;
  text: string;
};

type TopTabProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (tab: string) => void;
};

const TopTab: React.FC<TopTabProps> = ({ tabs, activeTab, onChange }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <Tabs value={activeTab} onTabChange={onChange}>
        <Tabs.List>
          {tabs.map(({ text, id }) => (
            <Tabs.Tab value={id} key={id}>
              {text}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    </div>
  );
};

export default TopTab;
