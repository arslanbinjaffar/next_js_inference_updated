import mongoose, { Schema, model, Types, Document } from "mongoose";
import { IModel } from "./Model";

export interface Iinference<m = string> extends Document {
  status: string;
  total_infer_time: number;
  elapsed_time: number;
  attachment: string;
  user: Number;
  _model: m;
}

const Inference = new Schema<Iinference<IModel>>(
  {
    status: {
      type: String,
      required: true,
    },
    total_infer_time: {
      type: Number,
      required: true,
    },
    elapsed_time: {
      type: Number,
      default: 0,
    },
    attachment: {
      type: String,
      default: "",
    },
    _model: {
      type: Types.ObjectId,
      ref: "Model",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Model = mongoose.models.Inference || model("Inference", Inference);

export default Model;
