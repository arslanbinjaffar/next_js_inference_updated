"use client";

import {
  initialize,
  updateUserTask,
} from "@/app/lib/redux/features/task/task_slice";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import { TableActions, TableGeneric } from "@/app/components/admin/Table";
import { Progress } from "@/app/components/ui/progress";
import axios, { AxiosError } from "axios";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { startInference } from "../../client/page";
import { socket } from "@/socket";
import { cn } from "@/app/lib/utils";
import { Iinferance } from "@/app/models/Inference";
import { IUser } from "@/app/models/User";
import { IModel } from "@/app/models/Model";
import { Button, ButtonProps } from "@/app/components/ui/button";
import { useAttachFile } from "@/app/hooks/useAttachFile";

const TableHeaders = [
  {
    title: "ID",
    className: "w-[100px]",
  },
  {
    title: "Username",
  },
  {
    title: "Inference Model",
  },
  {
    title: "Last Attached File",
  },
  {
    title: "Attachment",
  },
  {
    title: "Inferenece status",
  },
  {
    title: "Actions",
  },
];

type InferenceWithOptionalAttachment = Iinferance<IUser, IModel>;

type filesList = { [key: string]: File | undefined };

const page = () => {
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector((state) => state.task_slice);

  const [filesList, setFilesList] = useState<filesList>({});

  const fetchTasksData = async () => {
    try {
      const { data } = await axios.get("/api/task");
      dispatch(initialize(data));
    } catch (error) {
      console.log(error, "Error at fetchTasksData");
    }
  };

  const actions = [
    {
      title: "Start",
      onClick: async (inference: InferenceWithOptionalAttachment) => {
        try {
          const File = filesList[inference._id];
          if (inference.model.acceptFile && File) {
            const form = new FormData();
            form.append("file", File);
            const { data } = await axios.post("/api/upload", form);
            startInference(
              inference.model._id,
              inference.user._id,
              +inference.model.expectedInferenceTime.slice(0, -1),
              {
                attachment: data.file,
              }
            );
          } else {
            startInference(
              inference.model._id,
              inference.user._id,
              +inference.model.expectedInferenceTime.slice(0, -1)
            );
          }
        } catch (error) {
          console.log(error, "Error at inference button");
          error instanceof AxiosError
            ? toast.error(error.response?.data.message)
            : "";
        }
      },
      disabled: (inference: InferenceWithOptionalAttachment) => {
        return ["Requested", "In Progress", "Started", "Queued"].includes(
          inference.status
        );
      },
    },
    {
      title: "Pause",
      onClick: async (inference: InferenceWithOptionalAttachment) => {
        try {
          const { data } = await axios.get(`/api/inference/pause`, {
            params: {
              model_id: inference.model._id,
              user_id: inference.user._id,
            },
          });

          dispatch(
            updateUserTask({
              user_id: inference.user._id,
              model_id: inference.model._id,
              status: "Paused",
              total_infer_time: inference.total_infer_time,
              elapsed_time: inference.elapsed_time,
            })
          );

          toast.success(data.message);
        } catch (error) {
          console.log("error at Stop Inference", error);
          // Handle Fallbacks
          toast.error("Failed to stop inference");
        }
      },
      disabled: (inference: InferenceWithOptionalAttachment) => {
        return [
          "Requested",
          "Queued",
          "Paused",
          "Completed",
          "Stopped",
        ].includes(inference.status);
      },
    },
    {
      title: "Stop",
      onClick: async (inference: InferenceWithOptionalAttachment) => {
        try {
          const { data } = await axios.get(`/api/inference/stop`, {
            params: {
              model_id: inference.model._id,
              user_id: inference.user._id,
            },
          });

          socket.emit("stopped", {
            model_id: inference.model._id,
            user_id: inference.user._id,
            elapsed_time: inference.elapsed_time,
            total_infer_time: inference.total_infer_time,
            status: "Stopped",
          });

          toast.success(data.message);
        } catch (error) {
          console.log("error at Stop Inference", error);
          // Handle Fallbacks
          toast.error("Failed to stop inference");
        }
      },
      disabled: (inference: InferenceWithOptionalAttachment) => {
        return ["Stopped", "Completed"].includes(inference.status);
      },
    },
  ];

  useEffect(() => {
    fetchTasksData();
  }, []);

  return (
    <div className="p-5">
      <h1 className="font-semibold text-2xl">User Tasks</h1>
      <TableGeneric
        caption="Users Tasks List"
        headers={TableHeaders}
        rows={tasks.map((inference: InferenceWithOptionalAttachment) => {
          return {
            id: inference._id,
            userName: (data: InferenceWithOptionalAttachment) =>
              data.user.userName,
            modelName: (data: InferenceWithOptionalAttachment) =>
              data.model.name,
            lstAttachedFile: (data: InferenceWithOptionalAttachment) =>
              data.attachment || "N/A",
            attachment: (data: InferenceWithOptionalAttachment) => {
              if (data.model.acceptFile) {
                return (
                  <AttachFileInRow
                    _id={data._id}
                    filesList={filesList}
                    setFilesList={setFilesList}
                  />
                );
              } else return <p className="text-gray-400">N/A</p>;
            },
            status: (data: InferenceWithOptionalAttachment) => {
              if (inference.status === "In Progress") {
                const progressPercentage = Math.floor(
                  (data.elapsed_time / data.total_infer_time) * 100
                );
                return (
                  <section className="flex gap-1">
                    <Progress value={progressPercentage} className="w-[60%]" />
                    <p>{progressPercentage}%</p>
                  </section>
                );
              } else
                return (
                  <p
                    className={cn("", {
                      "text-gray-500": inference.status === "Queued",
                      "text-blue-500": inference.status === "Requested",
                      "text-green-500": inference.status === "Started",
                      "text-yellow-500": inference.status === "In Progress",
                      "text-red-500": inference.status === "Stopped",
                      "text-green-700": inference.status === "Completed",
                      "text-purple-500": inference.status === "Paused", // Added color for Paused status
                      "text-gray-400": !inference.status, // Fallback color if status is not available
                    })}
                  >
                    {inference.status}
                  </p>
                );
            },
            actions: (data: InferenceWithOptionalAttachment) => {
              return <TableActions actions={actions} data={data} />;
            },
            object_raw_data: inference,
          };
        })}
      />
    </div>
  );
};

export default page;

const AttachFileInRow = ({
  _id,
  filesList,
  setFilesList,
}: {
  _id: string;
  filesList: filesList;
  setFilesList: Dispatch<SetStateAction<filesList>>;
}) => {
  const attachFileInputRef = useRef<HTMLInputElement>(null);
  return (
    <section className="flex items-center gap-2">
      <div>
        <Button
          size={"sm"}
          onClick={() => {
            attachFileInputRef.current?.click();
          }}
        >
          {filesList[_id] ? "Update" : "Attach"} File
        </Button>
        <input
          type="file"
          accept=".pdf,.doc,.docs"
          ref={attachFileInputRef}
          id="file_input_for_model_client_side"
          onChange={(e) => {
            setFilesList((prev) => ({
              ...prev,
              [_id]: e.target.files ? e.target.files[0] : undefined,
            }));
          }}
          hidden
        />
      </div>
      <p className="text-teal-600 underline">{filesList[_id]?.name}</p>
    </section>
  );
};
