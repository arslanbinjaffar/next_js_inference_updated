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
    const model_name = searchParams.get("model_name");
    const version_id = searchParams.get("version_id");
    const data_id = searchParams.get("data_id");

    axios.get(INFERENCE_BACKEND + "/v2/run", {
      params: {
        model_name,
        version_id,
        data_id,
      },
    });

    return NextResponse.json(
      {
        model_name,
        version_id,
        data_id,
        status: "Started",
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
