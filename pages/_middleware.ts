import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  req.nextUrl.searchParams.append("test", "valu");
}
