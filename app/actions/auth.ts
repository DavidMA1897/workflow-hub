"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/validations/auth";

export type LoginState = { errors?: { email?: string[]; password?: string[] }; message?: string };
const DUMMY_PASSWORD_HASH = "$2b$12$pUPFhgnZcV5C8h/ARitYl.bYfgNXEKXFKqo5Drw3U6zzq2zOzQvLy";

export async function login(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  const result = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!result.success) return { errors: result.error.flatten().fieldErrors };
  const user = await prisma.user.findUnique({
    where: { email: result.data.email },
    select: { id: true, password: true, role: true },
  });
  const passwordMatches = await bcrypt.compare(result.data.password, user?.password ?? DUMMY_PASSWORD_HASH);
  if (!user || !passwordMatches) return { message: "Invalid email or password." };
  await createSession({ userId: user.id, role: user.role });
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
