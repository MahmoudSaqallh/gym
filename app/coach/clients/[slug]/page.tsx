import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ClientDetails } from "@/components/dashboard/coach/client-details";
import { CLIENTS, clientBySlug } from "@/components/dashboard/coach/data";

type Props = PageProps<"/coach/clients/[slug]">;

export function generateStaticParams() {
  return CLIENTS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: `${clientBySlug(slug)?.name ?? "Client"} – Kinora` };
}

async function Details({ params }: Pick<Props, "params">) {
  const { slug } = await params;
  const client = clientBySlug(slug);
  if (!client) notFound();
  return <ClientDetails client={client} />;
}

export default function ClientDetailsPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-[420px] animate-pulse rounded-[20px] bg-track" />}>
      <Details params={params} />
    </Suspense>
  );
}
