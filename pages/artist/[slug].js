import fs from "fs";
import path from "path";
import ListeningRoom from "../../components/ListeningRoom";

export default function ArtistPage({ slug, artistName, storeName }) {
  return (
    <ListeningRoom
      artistSlug={slug}
      pageTitle={`${artistName} — ${storeName}`}
      sidebarTitle={`${artistName}'s tracks`}
    />
  );
}

export async function getStaticPaths() {
  const file = path.join(process.cwd(), "public", "platform.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const paths = (raw.artists ?? [])
    .filter((a) => a.status === "approved")
    .map((a) => ({ params: { slug: a.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const file = path.join(process.cwd(), "public", "platform.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const artist = (raw.artists ?? []).find((a) => a.slug === params.slug);
  if (!artist) return { notFound: true };
  return {
    props: {
      slug: params.slug,
      artistName: artist.name,
      storeName: artist.storeName,
    },
  };
}
