"use client";

import { io } from "socket.io-client";

export const socket = io();

export const inference_socket = io("http://127.0.0.1:5001");
