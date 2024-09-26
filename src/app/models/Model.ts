import mongoose, { Schema, model } from "mongoose";

export interface IModel extends Document {
  name: string;
  version: string;
  networkName: string;
  path: string;
  description: string;
  acceptFile: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ModelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    networkName: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    acceptFile: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Model = mongoose.models.Model || model("Model", ModelSchema);
export default Model;
