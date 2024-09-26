import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { inference_socket } from "./socket";
import connectDB from "./app/lib/mongodbConnect";
import MongooseModels from "./app/models";
import { ITaskUpdateData } from "./types";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3005;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const updateTheInferenceInDB = async (
  data: ITaskUpdateData,
  do_not_update_elapsed_time = false
) => {
  try {
    await connectDB();
    await MongooseModels.Inference.updateOne(
      {
        user: data.user_id,
        model: data.model_id,
      },
      {
        status: data.status,
        ...(do_not_update_elapsed_time
          ? {}
          : {
              elapsed_time: data.elapsed_time,
            }),
      }
    );
  } catch (error) {
    console.log(error, "updateTheInferenceInDB");
  }
};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      allowedHeaders: "*",
      methods: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("conected", socket.id);
    socket.on("new_inference_task", (data) =>
      io.emit("broadcast_new_interference", data)
    );
    socket.on("stopped", (data) => io.emit("inference_stopped", data));
  });

  inference_socket.on("queued", (data) => {
    io.emit("inferenence_queued", data);
    updateTheInferenceInDB(data);
  });

  inference_socket.on("start", (data) => {
    io.emit("inference_started", data);
    updateTheInferenceInDB(data);
  });

  inference_socket.on("update", (data) => {
    io.emit("inference_updated", data);
    updateTheInferenceInDB(data);
  });

  inference_socket.on("complete", (data) => {
    io.emit("inference_completed", data);
    updateTheInferenceInDB(data);
  });

  inference_socket.on("pause", (data) => {
    io.emit("inference_paused", data);
    // No Elapsed time for pause is updated stay at previous state
    updateTheInferenceInDB(data, true);
  });

  // v2

  inference_socket.on("v2_queued", (data) =>
    io.emit("v2_inferenence_queued", data)
  );
  inference_socket.on("v2_start", (data) =>
    io.emit("v2_inference_started", data)
  );
  inference_socket.on("v2_update", (data) =>
    io.emit("v2_inference_updated", data)
  );
  inference_socket.on("v2_complete", (data) =>
    io.emit("v2_inference_completed", data)
  );
  inference_socket.on("v2_pause", (data) =>
    io.emit("v2_inference_paused", data)
  );

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
