import { ITaskUpdateData } from "@/types";
import { createWriteStream } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { pipeline } from "stream";
import { promisify } from "util";

const Storage_PATH = "./public/temp";

const pump = promisify(pipeline);

const ACCEPTABLE_FILES = [
  "application/msword",
  "application/octet-stream",
  "application/pdf",
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const [file] = formData.getAll("file") as any;

    if (file) {
      if (!ACCEPTABLE_FILES.includes(file?.type))
        return NextResponse.json(
          {
            message: "Invalid file type / accepts doc,docs and pdf only",
          },
          {
            status: 400,
          }
        );

      const saveTo =
        Storage_PATH + "/" + new Date().getTime() + "_" + file.name;

      const ws = createWriteStream(saveTo);

      //@ts-ignore
      await pump(file.stream(), ws);

      return NextResponse.json(
        {
          file: saveTo.replace("./public", ""),
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.log(error, "Error at upload File");
    return NextResponse.json(
      {
        message: "Failed to upload file",
      },
      {
        status: 500,
      }
    );
  }
}
