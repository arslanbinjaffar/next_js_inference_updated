import { z } from "zod";

export const ResourceValidationSchema = z.object({
  ip: z
    .string()
    .refine((ip) => ip.split(".").length === 4, {
      message: "Invalid Ip address",
    })
    .optional(),
  cpu: z.string().optional(),
  gpu: z.string().optional(),
  ram: z
    .string()
    // .refine(
    //   (ram) => {
    //     const value = ram.slice(0, -2);
    //     const number = Number(value);
    //     return isNaN(number) || number <= 0;
    //   },
    //   {
    //     message: "Invalid specified Ram",
    //   }
    // )
    .optional(),
  status: z
    .enum(["ACTIVE", "INACTIVE"], {
      message: "Please specify a status between ACTIVE or INACTIVE",
    })
    .optional(),
});
