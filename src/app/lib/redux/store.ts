import { configureStore } from "@reduxjs/toolkit";
import auth_slice from "./features/auth/auth_slice";
import task_slice from "./features/task/task_slice";
import inference_slice from "./features/inference/inference_slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth_slice,
      task_slice,
      inference_slice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];
