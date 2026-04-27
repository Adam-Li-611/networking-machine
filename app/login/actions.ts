"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const password = formData.get("password");
  const next = formData.get("next");

  if (typeof password !== "string" || password !== process.env.APP_PASSWORD) {
    redirect(`/login?error=1${typeof next === "string" ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  const cookieStore = await cookies();
  cookieStore.set("networking_machine_auth", "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  redirect(typeof next === "string" && next.startsWith("/") ? next : "/");
}
