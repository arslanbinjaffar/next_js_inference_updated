import connectDB from "@/app/lib/mongodbConnect";
import User from "@/app/models/User";
import Model from "@/app/models/Model";
import Inference from "@/app/models/Inference";
import Resource from "@/app/models/Resource";
import { createInterface } from "node:readline/promises";

const ModelsData = [
  {
    name: "Basic Data Model",
    description: "A simple model for basic data processing and analysis.",
    expectedInferenceTime: "30s",
    acceptFile: false,
  },
  {
    name: "Advanced Data Model",
    description:
      "An advanced model designed for complex data processing tasks.",
    expectedInferenceTime: "45s",
    acceptFile: true,
  },
  {
    name: "Real-Time Data Model",
    description:
      "A model optimized for real-time data analysis and processing.",
    expectedInferenceTime: "15s",
    acceptFile: false,
  },
  {
    name: "Batch Data Model",
    description: "A model suitable for batch data processing and analysis.",
    expectedInferenceTime: "60s",
    acceptFile: true,
  },
  {
    name: "Predictive Data Model",
    description: "A model focused on predictive analytics and forecasting.",
    expectedInferenceTime: "40s",
    acceptFile: true,
  },
];
const UsersData = [
  {
    userName: "Admin User",
    isAdmin: true,
  },
  {
    userName: "Thomas Edison",
    isAdmin: false,
  },
  {
    userName: "Nikola Tesla",
    isAdmin: false,
  },
  {
    userName: "Marie Curie",
    isAdmin: false,
  },
  {
    userName: "Albert Einstein",
    isAdmin: false,
  },
  {
    userName: "Isaac Newton",
    isAdmin: false,
  },
  {
    userName: "Galileo Galilei",
    isAdmin: false,
  },
  {
    userName: "Leonardo da Vinci",
    isAdmin: false,
  },
  {
    userName: "Charles Darwin",
    isAdmin: false,
  },
  {
    userName: "Alexander Graham Bell",
    isAdmin: false,
  },
  {
    userName: "Stephen Hawking",
    isAdmin: false,
  },
];

const ResourceData = [
  {
    ip: "192.168.1.1",
    cpu: "Intel Core i7",
    gpu: "NVIDIA GTX 1080",
    ram: "16GB",
    status: "ACTIVE",
  },
  {
    ip: "192.168.1.2",
    cpu: "Intel Core i5",
    gpu: "NVIDIA GTX 1060",
    ram: "8GB",
    status: "INACTIVE",
  },
  {
    ip: "192.168.1.3",
    cpu: "AMD Ryzen 5",
    gpu: "NVIDIA RTX 2060",
    ram: "16GB",
    status: "ACTIVE",
  },
  {
    ip: "192.168.1.4",
    cpu: "Intel Core i3",
    gpu: "AMD Radeon RX 580",
    ram: "8GB",
    status: "INACTIVE",
  },
  {
    ip: "192.168.1.5",
    cpu: "AMD Ryzen 7",
    gpu: "NVIDIA RTX 2080",
    ram: "32GB",
    status: "ACTIVE",
  },
];

const seed = async () => {
  await connectDB();

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Warning:");
  const answer = await rl.question(
    "This would reset the wholde database, are you sure you want to continue? (Y/N)\n"
  );
  if (["yes", "y"].includes(answer.toLowerCase())) {
    await Inference.deleteMany();
    await Model.deleteMany();
    await Model.insertMany(ModelsData);
    await User.deleteMany();
    await User.insertMany(UsersData);
    await Resource.deleteMany();
    await Resource.insertMany(ResourceData);
    console.log("Seeded data successfully");
  } else console.log("Aborted");
};

(async () => {
  await seed();
  process.exit();
})();
