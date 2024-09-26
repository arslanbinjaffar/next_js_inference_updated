"use client";

import { initialize } from "@/app/lib/redux/features/inference/inference_slice";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import { IModel } from "@/app/models/Model";
import SelectionModel from "@/app/components/selectionModel";
import { socket } from "@/socket";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const startInference = async (
  model_id: string,
  user_id: string,
  infer_time = 30,
  params = {}
) => {
  try {
    const { data } = await axios.get(`/api/inference`, {
      params: {
        model_id: model_id,
        infer_time: infer_time,
        user_id: user_id,
        ...params,
      },
    });

    if (data.updatedExisting === false)
      socket.emit("new_inference_task", data.task);

    toast.success(data.message);
  } catch (error) {
    console.log("error at startInference", error);
    // Handle Fallbacks
    toast.error("Failed to start inference");
  }
};

export default function Home() {
  const [models, setModels] = useState<IModel[]>([]);

  const { inferences } = useAppSelector((state) => state.inference_slice);
  const { userInfo } = useAppSelector((state) => state.auth_slice);

  const dispatch = useAppDispatch();

  const getUserInference = async (user_id: string) => {
    try {
      const { data } = await axios.get(`/api/inference/user/${user_id}`);
      dispatch(initialize(data));
    } catch (error) {
      console.log("error at getUserInference", error);
      // Handle Fallbacks
      toast.error("Failed to get inference");
    }
  };

  useEffect(() => {
    if (userInfo._id) getUserInference(userInfo._id);
  }, [userInfo]);

  const fetchModelsData = async () => {
    try {
      const { data } = await axios.get("/api/model");
      setModels(data);
    } catch (error) {
      console.log(error, "Error at fetchUsersData");
      toast.error("Failed to retreive models");
    }
  };

  useEffect(() => {
    fetchModelsData();
  }, []);

  return (
    <main className="flex gap-5 min-h-screen justify-evenly items-center flex-wrap p-24">
      {models.map((model) => {
        const inference = inferences.find((inf) => inf.model === model._id);
        return (
          <SelectionModel
            key={model._id}
            model={model}
            buttonAction={startInference}
            inference={inference}
          />
        );
      })}
    </main>
  );
}
