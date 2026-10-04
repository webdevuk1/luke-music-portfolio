import Head from "next/head";
import ListeningRoom from "../components/ListeningRoom";

export default function Home() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Discover approved demos from creators — search, listen, and download."
        />
      </Head>
      <ListeningRoom sidebarTitle="All approved tracks" />
    </>
  );
}
