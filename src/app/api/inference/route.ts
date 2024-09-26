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
    const infer_time = searchParams.get("infer_time");
    const attachment = searchParams.get("attachment");

    const isAlreadyStarted = await MongooseModels.Inference.findOne({
      user: user_id,
      model: model_id,

      status: {
        $in: ["Requested", "Started", "Queued", "In Progress"],
      },
    });

    if (isAlreadyStarted)
      return NextResponse.json(
        {
          message: "Inference is already in process!",
          isAlreadyStarted,
        },
        {
          status: 400,
        }
      );

    const { lastErrorObject, value } =
      await MongooseModels.Inference.findOneAndUpdate(
        { user: user_id, model: model_id },
        {
          status: "Requested",
          user: user_id,
          model: model_id,
          total_infer_time: infer_time ? +infer_time : 0,
          ...(attachment ? { attachment: attachment } : {}),
        },
        {
          upsert: true,
          returnDocument: "after",
          populate: ["user", "model"],
          includeResultMetadata: true,
        }
      );

    // I am not able to get the populated user and model in the above query
    // That's why refetching

    const task = await MongooseModels.Inference.findById(
      value._id,
      {},
      {
        populate: ["user", "model"],
      }
    );

    const { data } = await axios.get(INFERENCE_BACKEND + "/run", {
      params: {
        model_id,
        infer_time,
        user_id,
        attachment,
        ...(value.status === "Paused"
          ? {
              elapsed_time: value.elapsed_time,
            }
          : {
              elapsed_time: 0,
            }),
      },
    });

    return NextResponse.json(
      {
        ...data,
        task,
        updatedExisting: lastErrorObject?.updatedExisting,
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

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const task = await MongooseModels.Inference.updateOne(
      {
        user: body.user_id,
        model: body.model_id,
      },
      {
        ...body.updates,
      },
      {
        returnDocument: "after",
        populate: ["user", "model"],
      }
    );

    if (body.action === "start") {
      await axios.get(INFERENCE_BACKEND + "/run", {
        params: {
          model_id: body.model_id,
          infer_time: body.infer_time,
          user_id: body.user_id,
        },
      });
    }

    return NextResponse.json(task, {
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
