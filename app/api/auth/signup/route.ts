import { NextRequest, NextResponse } from "next/server";
import { addUser, findUserByEmail } from "@/lib/db";
import { hashPassword, signSession, SESSION_COOKIE } from "@/lib/auth";
import { User } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, childName } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    if (findUserByEmail(email)) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash,
      childName: childName || "",
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);

    const token = signSession(newUser.id);
    const res = NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        childName: newUser.childName,
        createdAt: newUser.createdAt,
      },
    });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
