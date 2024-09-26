import MongooseModels from "@/app/models";
import connectDB from "@/app/lib/mongodbConnect";
import { NextRequest, NextResponse } from "next/server";

export const INFERENCE_BACKEND = "http://127.0.0.1:5001";

interface RouteParams {
  params: {
    user_id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const userInferences = await MongooseModels.Inference.find({
      user: params.user_id,
    });

    return NextResponse.json(userInferences, {
      status: 200,
    });
  } catch (error) {
    console.log(error, "Error at GET");
    return NextResponse.json(
      { message: "Failed to get data" },
      {
        status: 500,
      }
    );
  }
}
