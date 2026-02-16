import { z } from "zod";

export const schoolProfileSchema = z.object({
  name: z.string().min(2, "School name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  timezone: z.string().default("Asia/Kolkata"),
  academicYearStart: z.string().default("april"),
  estdYear: z.coerce.number().min(1800).max(new Date().getFullYear()).optional().nullable(),
  board: z.string().optional().nullable(),
  affiliationNo: z.string().optional().nullable(),
  website: z.string().url("Invalid URL").optional().nullable().or(z.literal("")),
  motto: z.string().max(100, "Motto must be less than 100 characters").optional().nullable(),
});

export type SchoolProfileFormValues = z.infer<typeof schoolProfileSchema>;
