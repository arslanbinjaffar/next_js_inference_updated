import connectDB from "@/app/lib/mongodbConnect";
import MongooseModels from "@/app/models";
import { ResourceValidationSchema } from "@/app/validation_schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const resources = await MongooseModels.Resource.find();
    return NextResponse.json(resources, {
      status: 200,
    });
  } catch (error) {
    console.log("Error at Get Resoure", error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { success, error } = ResourceValidationSchema.safeParse(body.updates);
    if (success) {
      const update = await MongooseModels.Resource.updateOne(
        { _id: body.resource_id },
        { ...body.updates }
      );
      return NextResponse.json(update, {
        status: 200,
      });
    } else {
      const serverError = Object.fromEntries(
        error.issues.map((issue) => [issue.path[0], issue.message])
      );

      return NextResponse.json(
        {
          message: "Validation Failed",
          error: {
            serverError,
            fieldError: error.formErrors.fieldErrors,
          },
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.log("Error at Get Resoure", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error,
      },
      {
        status: 500,
      }
    );
  }
}
