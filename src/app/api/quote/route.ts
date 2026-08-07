import { type NextRequest, NextResponse } from "next/server";
import { createAnonServerClient } from "@/lib/supabase/anon";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isBackblazeConfigured, uploadToB2 } from "@/lib/backblaze";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const model = String(form.get("model") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (!name || !email || !phone || !model) {
      return NextResponse.json(
        { error: "Please fill in your name, email, phone and model." },
        { status: 400 }
      );
    }

    // Upload any attached photos to Backblaze (shared bucket, prefixed folder).
    const photoUrls: string[] = [];
    if (isBackblazeConfigured) {
      const files = form
        .getAll("photos")
        .filter((f): f is File => f instanceof File && f.size > 0);
      for (const file of files.slice(0, 8)) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const safe = slugify(file.name.replace(/\.[^.]+$/, ""));
        const ext = file.name.split(".").pop() ?? "bin";
        const key = `quotes/${Date.now()}-${safe}.${ext}`;
        try {
          const url = await uploadToB2(
            key,
            buffer,
            file.type || "application/octet-stream"
          );
          photoUrls.push(url);
        } catch (e) {
          console.error("B2 upload failed:", e);
        }
      }
    }

    // Persist the submission (anon INSERT is allowed by RLS).
    if (isSupabaseConfigured) {
      const supabase = createAnonServerClient();
      const { error } = await supabase.from("quote_submissions").insert({
        name,
        email,
        phone,
        model,
        message,
        photo_urls: photoUrls,
        status: "new",
      });
      if (error) {
        console.error("Supabase insert failed:", error);
        return NextResponse.json(
          { error: "We couldn't save your request. Please call us instead." },
          { status: 500 }
        );
      }
    } else {
      console.warn("Quote received (no DB configured):", { name, email, model });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("Quote route error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
