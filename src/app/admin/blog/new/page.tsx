import { requireUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { PostForm } from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  await requireUser();
  return (
    <AdminShell title="New blog post">
      <PostForm />
    </AdminShell>
  );
}
