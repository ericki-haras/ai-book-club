import { notFound } from "next/navigation";
import { getSessionBySlug } from "@/lib/sessions";
import { EditSessionForm } from "@/components/edit-session-form";

export default async function EditSessionPage(
  props: PageProps<"/sessions/[slug]/edit">
) {
  const { slug } = await props.params;
  const session = await getSessionBySlug(slug);

  if (!session) notFound();

  return <EditSessionForm session={session} />;
}
