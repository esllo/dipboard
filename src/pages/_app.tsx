import Layout from "@/layout/Layout";
import { MantineProvider, MantineTheme } from "@mantine/core";
import type { AppProps } from "next/app";

const globalStyles = (theme: MantineTheme) => ({
  body: {
    background: "transparent",
    overflow: "hidden",
    "& ::-webkit-scrollbar": {
      width: 2,
      height: 2,
    },
    "& ::-webkit-scrollbar-thumb": {
      background: theme.colors.gray[6],
      borderRadius: 5,
    },
    "& ::webkit-scrollbar-thumb:hover": {
      background: theme.colors.gray[5],
    },
    "& ::webkit-scrollbar-track": {
      background: theme.colors.gray[8],
    },
    height: "100vh",
  },
  "#__next": {
    height: "100%",
    padding: 5,
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ globalStyles, primaryColor: "indigo" }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MantineProvider>
  );
}
