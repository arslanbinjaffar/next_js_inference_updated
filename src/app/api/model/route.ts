import connectDB from "@/app/lib/mongodbConnect";
import MongooseModels from "@/app/models";
import { IModel } from "@/app/models/Model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const models = await MongooseModels.Model.find();
    return NextResponse.json(models, {
      status: 200,
    });
  } catch (error) {
    console.log(error, "Error at Get Models");
    return NextResponse.json("Failed to get models", {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body: IModel = await req.json();
    const newModel = new MongooseModels.Model(body);
    await newModel.save();

    return NextResponse.json(newModel, {
      status: 201,
    });
  } catch (error) {
    console.log(error, "Error at Create Model");
    return NextResponse.json("Failed to create model", {
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body: IModel = await req.json();
    const model = await MongooseModels.Model.findByIdAndUpdate(body._id, body, { new: true });
    if (!model) {
      return NextResponse.json("Model not found", { status: 404 });
    }
    return NextResponse.json(model, {
      status: 200,
    });
  } catch (error) {
    console.log(error, "Error at Update Model");
    return NextResponse.json("Failed to update model", {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    const deletedModel = await MongooseModels.Model.findByIdAndDelete(id);

    if (!deletedModel) {
      return NextResponse.json("Model not found", {
        status: 404,
      });
    }

    return NextResponse.json(deletedModel, {
      status: 200,
    });
  } catch (error) {
    console.log(error, "Error at Delete Model");
    return NextResponse.json("Failed to delete model", {
      status: 500,
    });
  }
}
