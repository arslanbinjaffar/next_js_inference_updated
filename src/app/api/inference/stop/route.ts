import MongooseModels from "@/app/models";
import connectDB from "@/app/lib/mongodbConnect";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getSearchParams } from "@/app/lib/utils";

export const INFERENCE_BACKEND = "http://127.0.0.1:5001";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const searchParams = getSearchParams(req);
    const model_id = searchParams.get("model_id");
    const user_id = searchParams.get("user_id");

    const inference = await MongooseModels.Inference.findOneAndUpdate(
      { user: user_id, model: model_id },
      {
        status: "Stopped",
      }
    );
    const { data } = await axios.get(INFERENCE_BACKEND + "/stop", {
      params: {
        model_id,
        user_id,
      },
    });

    return NextResponse.json(
      {
        ...data,
        task: inference,
      },
      {
        status: 200,
      }
    );
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
