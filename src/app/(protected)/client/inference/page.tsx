"use client";

import { useAppSelector } from "@/app/lib/redux/hooks";
import { socket } from "@/socket";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils";
import { useSearchParams } from "next/navigation";
import { Progress } from "@/app/components/ui/progress";

export const startInference_v2 = async (
  model_name: string = "",
  version_id: string = "",
  data_id: string = "",
  infer_time = 30,
  params = {}
) => {
  try {
    const { data } = await axios.get(`/api/inference/v2`, {
      params: {
        model_name,
        version_id,
        data_id,
        infer_time,
        ...params,
      },
    });

    toast.success("Inference has been started!");
    return data;
  } catch (error) {
    console.log("error at startInference", error);
    // Handle Fallbacks
    toast.error("Failed to start inference");
  }
};

export default function Home() {
  const { userInfo } = useAppSelector((state) => state.auth_slice);

  const [inference, setInference] = useState({
    model_name: "",
    version_id: "",
    data_id: "",
    total_infer_time: 30,
    elapsed_time: 0,
    status: "unknown",
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    function handleInferenceStatusUpdatesEvent(data: unknown) {
      //@ts-ignore
      setInference((prev) => ({ ...prev, ...data }));
    }

    socket.on("v2_inferenence_queued", handleInferenceStatusUpdatesEvent);
    socket.on("v2_inference_started", handleInferenceStatusUpdatesEvent);
    socket.on("v2_inference_updated", handleInferenceStatusUpdatesEvent);
    socket.on("v2_inference_completed", handleInferenceStatusUpdatesEvent);
    socket.on("v2_inference_stopped", handleInferenceStatusUpdatesEvent);
    socket.on("v2_inference_paused", handleInferenceStatusUpdatesEvent);

    return () => {
      socket.off("v2_inferenence_queued", handleInferenceStatusUpdatesEvent);
      socket.off("v2_inference_started", handleInferenceStatusUpdatesEvent);
      socket.off("v2_inference_updated", handleInferenceStatusUpdatesEvent);
      socket.off("v2_inference_stopped", handleInferenceStatusUpdatesEvent);
      socket.off("v2_inference_paused", handleInferenceStatusUpdatesEvent);
      socket.off("v2_inference_completed", handleInferenceStatusUpdatesEvent);
    };
  }, []);

  useEffect(() => {
    setInference((prev: any) => ({
      ...prev,
      model_name: searchParams.get("model_name") || "Unknown",
      version_id: searchParams.get("version_id") || "Unknown",
      data_id: searchParams.get("data_id") || "Unknown",
    }));
    startInference_v2(
      searchParams.get("model_name") || "Unknown",
      searchParams.get("version_id") || "Unknown",
      searchParams.get("data_id") || "Unknown"
    ).then((data) => {
      setInference((prev) => ({ ...prev, ...data }));
    });
  }, [searchParams]);

  return (
    <main className="flex gap-5 min-h-screen justify-evenly items-center flex-wrap p-24">
      <Card
        className={cn(
          "flex flex-col gap-6 p-6 max-w-[400px] min-h-[300px] bg-white rounded-lg shadow-md"
        )}
      >
        <h3 className="text-center font-semibold text-lg text-gray-800">
          {searchParams.get("model_name")}
        </h3>
        <section className="flex flex-col items-center bg-gray-50 p-4 rounded-md shadow-inner">
          <h2 className="text-center text-sm font-medium text-gray-600 mb-2">
            Params
          </h2>
          <div className="space-y-1">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Model Name:</span>{" "}
              {inference.model_name}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Version ID:</span>{" "}
              {inference.version_id}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Data ID:</span>{" "}
              {inference.data_id}
            </p>
          </div>
        </section>
        {inference.status === "In Progress" && (
          <section className="flex items-center justify-center gap-2">
            <Progress
              value={Math.floor(
                (inference.elapsed_time / inference.total_infer_time) * 100
              )}
              className="w-[60%]"
            />
            <p>
              {Math.floor(
                (inference.elapsed_time / inference.total_infer_time) * 100
              )}
              %
            </p>
          </section>
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
            {inference.status}
          </span>
        </small>
      </Card>
    </main>
  );
}
