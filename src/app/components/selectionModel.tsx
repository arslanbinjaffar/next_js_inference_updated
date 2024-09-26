import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useAppSelector } from "@/app/lib/redux/hooks";
import { Iinferance } from "@/app/models/Inference";
import { Progress } from "./ui/progress";
import { cn } from "@/app/lib/utils";
import { IModel } from "../models/Model";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAttachFile } from "../hooks/useAttachFile";

type Props = {
  model: IModel;
  buttonAction: (
    model_id: string,
    user_id: string,
    infer_time: number,
    params?: Record<string, any>
  ) => Promise<void>;
  inference: Iinferance | undefined;
};

const SelectionModel = ({
  //@ts-ignore
  model = {},
  buttonAction,
  inference = {
    _id: "",
    status: "",
    model: "",
    user: "",
    attachment: "",
    elapsed_time: 0,
    total_infer_time: 0,
  },
}: Props) => {
  const { userInfo } = useAppSelector((state) => state.auth_slice);
  const [_file, _setFile] = useState<File>();

  const { Component, selectedFile } = useAttachFile({
    selectedFile: _file,
    setSelectedFile: _setFile,
  });

  const progressPercentage = Math.floor(
    (inference.elapsed_time / inference.total_infer_time) * 100
  );
  return (
    <Card className={cn("flex flex-col gap-5 p-5 max-w-[400px] min-h-[300px]")}>
      <h3 className="text-center font-semibold">{model.name}</h3>
      <p>{model.description}</p>
      {inference.status === "In Progress" ? (
        <section className="flex items-center justify-center gap-2">
          <Progress value={progressPercentage} className="w-[60%]" />
          <p>{progressPercentage}%</p>
        </section>
      ) : (
        <Button
          disabled={["Queued", "Requested", "Started", "In Progress"].includes(
            inference.status
          )}
          onClick={async () => {
            try {
              if (model.acceptFile && selectedFile) {
                const form = new FormData();
                form.append("file", selectedFile);
                const { data } = await axios.post("/api/upload", form);
                buttonAction(
                  model._id,
                  userInfo._id,
                  +model?.expectedInferenceTime?.slice(0, -1),
                  {
                    attachment: data.file,
                  }
                );
              } else {
                buttonAction(
                  model._id,
                  userInfo._id,
                  +model?.expectedInferenceTime?.slice(0, -1)
                );
              }
            } catch (error) {
              console.log(error, "Error at inference button");
              error instanceof AxiosError
                ? toast.error(error.response?.data.message)
                : "";
            }
          }}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <div>Start Inference on {model.name}</div>
        </Button>
      )}
      <small className="text-right font-semibold">
        Status:{" "}
        <span
          className={cn("", {
            "text-gray-500": inference.status === "Queued",
            "text-blue-500": inference.status === "Requested",
            "text-green-500": inference.status === "Started",
            "text-yellow-500": inference.status === "In Progress",
            "text-red-500": inference.status === "Stopped",
            "text-green-700": inference.status === "Completed",
            "text-purple-500": inference.status === "Paused",
            "text-gray-400": !inference.status, // Fallback color if status is not available
          })}
        >
          {inference.status || "N/A"}
        </span>
      </small>
      {model.acceptFile && <Component />}
    </Card>
  );
};

export default SelectionModel;
