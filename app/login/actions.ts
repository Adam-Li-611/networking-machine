"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthCookieValue, getAuthCookieMaxAge } from "@/lib/auth-cookie";

function safeNext(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function loginAction(formData: FormData) {
  const password = formData.get("password");
  const next = safeNext(formData.get("next"));

  if (typeof password !== "string" || password !== process.env.APP_PASSWORD) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set("networking_machine_auth", await createAuthCookieValue(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getAuthCookieMaxAge()
  });

  redirect(next);
}
