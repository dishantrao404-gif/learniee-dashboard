import { NextRequest, NextResponse } from "next/server";
import { findUserById } from "@/lib/db";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const session = verifySession(token);
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = findUserById(session.userId);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      childName: user.childName,
      createdAt: user.createdAt,
    },
  });
}
