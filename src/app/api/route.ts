import { NextResponse } from "next/server";

export async function Get() {
  return NextResponse.json({
    message: "success",
    timestamp: new Date().toLocaleDateString(),
  });
}
