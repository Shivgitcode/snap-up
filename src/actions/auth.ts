"use server";

import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import bcrypt from "bcryptjs";

export type User = {
  name: string;
  email: string;
  password: string;
};

export const register = async (user: User) => {
  try {
    console.log(user);
    const hashPass = await bcrypt.hash(user.password, 12);
    await db.insert(users).values({ ...user, password: hashPass });

    return "user registered";
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return String(err);
  }
};
