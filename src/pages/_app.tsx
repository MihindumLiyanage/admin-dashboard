import type { AppProps } from "next/app";
import "@carbon/styles/css/styles.css";
import "../styles/global.scss";
import { AppProviders } from "../contexts/AppProviders";
import { Layout } from "./Layout";

type NextPageWithTitle = AppProps["Component"] & {
  title?: string;
};

export default function MyApp({ Component, pageProps }: AppProps) {
  const ComponentWithTitle = Component as NextPageWithTitle;

  return (
    <AppProviders>
      <Layout title={ComponentWithTitle.title}>
        <Component {...pageProps} />
      </Layout>
    </AppProviders>
  );
}
