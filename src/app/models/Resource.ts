import mongoose, { Document, Schema, model } from "mongoose";

export interface IResource extends Document {
  ip: string;
  cpu: string;
  gpu: string;
  ram: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const Resource = new Schema<IResource>(
  {
    ip: {
      type: String,
      required: true,
    },
    cpu: {
      type: String,
      required: true,
    },
    gpu: {
      type: String,
      required: true,
    },
    ram: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Model = mongoose.models.Resource || model("Resource", Resource);
export default Model;
