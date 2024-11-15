"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import * as z from "zod";
import { RegisterSchema } from "../schemas";
import { getUserByEmail } from "../data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "../src/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // Validate input fields
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields provided." };
  }

  const { email, password, name, number, role, govId, location } =
    validatedFields.data;

  // Define acceptable roles and validate the provided role
  if (
    role.toLocaleLowerCase() !== "admin" &&
    role.toLocaleLowerCase() !== "user" &&
    role.toLocaleLowerCase() !== "incharge"
  ) {
    return { error: "Role should be entered properly" };
  }
  const caseRole = role.toLowerCase();

  // Check if email already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already exists." };
  }

  // Hash the password and create the user
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone: number,
      role: caseRole, // Use normalized role
      govId,
      location,
    },
  });

  // Generate a verification token and send verification email
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(email, verificationToken.token);

  return { success: "Confirmation email sent!" };
};
