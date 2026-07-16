import { NextResponse } from "next/server";

export default function buildError(error: unknown) {
  if (error instanceof Error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json(
    { message: "Internal Server Error" },
    { status: 500 },
  );
}
