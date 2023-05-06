import { NextPage } from "next";
import dynamic from "next/dynamic";

const HomeDynamic = dynamic(() => import("@/components/Home"), { ssr: false });

const Home: NextPage = () => {
  return <HomeDynamic />;
};

export default Home;
