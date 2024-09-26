// features/auth/taskSlice.js
import { Iinferance } from "@/app/models/Inference";
import { IModel } from "@/app/models/Model";
import { IUser } from "@/app/models/User";
import { ITaskUpdateData } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  tasks: Iinferance<IUser, IModel>[];
  isInitialized: boolean;
} = {
  tasks: [],
  isInitialized: false,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    initialize: (_, action: PayloadAction<Iinferance<IUser, IModel>[]>) => {
      return {
        tasks: action.payload,
        isInitialized: true,
      };
    },

    updateUserTask: (state, action: PayloadAction<ITaskUpdateData>) => {
      state.tasks = state.tasks.map((task) =>
        task.user._id === action.payload.user_id &&
        task.model._id === action.payload.model_id
          ? {
              ...task,
              status: action.payload.status,
              total_infer_time: action.payload.total_infer_time,
              elapsed_time: action.payload.elapsed_time,
            }
          : task
      );
      return state;
    },

    appendTask: (state, action: PayloadAction<Iinferance<IUser, IModel>>) => {
      state.tasks = state.tasks.concat(action.payload);
      return state;
    },
  },
});

export const { initialize, updateUserTask, appendTask } = taskSlice.actions;
export default taskSlice.reducer;
