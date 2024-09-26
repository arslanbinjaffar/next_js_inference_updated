"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { updateUserTask, appendTask } from "./redux/features/task/task_slice";
import { socket } from "@/socket";
import {
  appendInference,
  updateInference,
} from "./redux/features/inference/inference_slice";
import { Iinferance } from "../models/Inference";
import { ITaskUpdateData } from "@/types";
import { IModel } from "../models/Model";
import { IUser } from "../models/User";

// Todo: Only update the tasks for the admin User
/**
 *
 * can use the socketId and save it with the user
 *
 * and can use a middleware io.use
 */

const Event_listener = () => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth_slice);
  useEffect(() => {
    function handleInferenceStatusUpdatesEvent(data: ITaskUpdateData) {
      if (userInfo.isAdmin) dispatch(updateUserTask(data));
      else if (userInfo._id === data.user_id && !userInfo.isAdmin)
        dispatch(updateInference(data));
    }

    function handleNewInterferenceTask(data: Iinferance<IUser, IModel>) {
      if (userInfo.isAdmin) dispatch(appendTask(data));
      else if (userInfo._id === data.user._id && !userInfo.isAdmin)
        dispatch(
          appendInference({
            ...data,
            user: data.user._id,
            model: data.model._id,
          })
        );
    }

    socket.on("broadcast_new_interference", handleNewInterferenceTask);
    socket.on("inferenence_queued", handleInferenceStatusUpdatesEvent);
    socket.on("inference_started", handleInferenceStatusUpdatesEvent);
    socket.on("inference_updated", handleInferenceStatusUpdatesEvent);
    socket.on("inference_completed", handleInferenceStatusUpdatesEvent);
    socket.on("inference_stopped", handleInferenceStatusUpdatesEvent);
    socket.on("inference_paused", handleInferenceStatusUpdatesEvent);

    return () => {
      socket.off("broadcast_new_interference", handleNewInterferenceTask);
      socket.off("inferenence_queued", handleInferenceStatusUpdatesEvent);
      socket.off("inference_started", handleInferenceStatusUpdatesEvent);
      socket.off("inference_updated", handleInferenceStatusUpdatesEvent);
      socket.off("inference_stopped", handleInferenceStatusUpdatesEvent);
      socket.off("inference_paused", handleInferenceStatusUpdatesEvent);
      socket.off("inference_completed", handleInferenceStatusUpdatesEvent);
    };
  }, [dispatch, userInfo]);

  return <div></div>;
};

export default Event_listener;
