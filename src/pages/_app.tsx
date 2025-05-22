import type { AppProps } from "next/app";
import "@carbon/styles/css/styles.css";
import "../styles/global.scss";
import { AppProviders } from "../contexts/AppProviders";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
      <Component {...pageProps} />
    </AppProviders>
  );
}
