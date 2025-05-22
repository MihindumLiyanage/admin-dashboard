import Head from "next/head";
import { Layout } from "../layouts/Layout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta
          name="description"
          content="Admin Dashboard with Carbon Design System"
        />
      </Head>
      <Layout>
        <h1 style={{ fontSize: "2rem" }}>Welcome to the Admin Dashboard</h1>
      </Layout>
    </>
  );
}
