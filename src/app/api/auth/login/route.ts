import connectDB from "@/app/lib/mongodbConnect";
import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const user = await User.findOne({
      userName: body.userName,
    });
    if (user) {
      return NextResponse.json(user, {
        status: 200,
      });
    } else {
      return NextResponse.json("User not found", {
        status: 400,
      });
    }
  } catch (error) {
    console.log(error, "Error at Put Model");
    return NextResponse.json("Failed to update model", {
      status: 500,
    });
  }
}
