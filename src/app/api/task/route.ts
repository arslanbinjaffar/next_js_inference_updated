import connectDB from "@/app/lib/mongodbConnect";
import MongooseModels from "@/app/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const inferences = await MongooseModels.Inference.find()
      .populate("user")
      .populate("model");

    return NextResponse.json(inferences, {
      status: 200,
    });
  } catch (error) {
    console.log(error, "Error at Get Inferences");
    return NextResponse.json("Failed to Get Inferences", {
      status: 500,
    });
  }
}
