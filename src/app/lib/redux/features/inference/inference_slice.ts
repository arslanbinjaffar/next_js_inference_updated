// features/auth/taskSlice.js
import { Iinferance } from "@/app/models/Inference";
import { ITaskUpdateData } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  inferences: Iinferance[];
  isInitialized: boolean;
} = {
  inferences: [],
  isInitialized: false,
};

const inferenceSlice = createSlice({
  name: "inference",
  initialState,
  reducers: {
    initialize: (_, action: PayloadAction<Iinferance[]>) => {
      return {
        inferences: action.payload,
        isInitialized: true,
      };
    },

    updateInference: (state, action: PayloadAction<ITaskUpdateData>) => {
      state.inferences = state.inferences.map((interference) =>
        interference.user === action.payload.user_id &&
        interference.model === action.payload.model_id
          ? {
              ...interference,
              status: action.payload.status,
              total_infer_time: action.payload.total_infer_time,
              elapsed_time: action.payload.elapsed_time,
            }
          : interference
      );
      return state;
    },

    appendInference: (state, action: PayloadAction<Iinferance>) => {
      state.inferences = state.inferences.concat(action.payload);
      return state;
    },
  },
});

export const { initialize, updateInference, appendInference } =
  inferenceSlice.actions;
export default inferenceSlice.reducer;
