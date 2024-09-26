import { type ClassValue, clsx } from "clsx";
import { NextRequest } from "next/server";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSearchParams(req: NextRequest) {
  return req.nextUrl.searchParams;
}

export function handleOnChangeBasedOnName(
  event: ChangeEvent<any>,
  setState: SetStateAction<Dispatch<any>>
) {
  setState((prev) => ({ ...prev, [event.target.name]: event.target.value }));
}
