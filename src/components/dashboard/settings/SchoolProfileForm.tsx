"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { schoolProfileSchema, SchoolProfileFormValues } from "@/lib/validators/school-settings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const STANDARD_BOARDS = ["CBSE", "ICSE", "State Board", "IB", "Cambridge"];

interface SchoolProfileFormProps {
  initialData?: Partial<SchoolProfileFormValues> & {
    code?: string;
    logoUrl?: string | null;
  };
  onSubmit: (data: SchoolProfileFormValues) => Promise<void>;
  isLoading: boolean;
}

export function SchoolProfileForm({ initialData, onSubmit, isLoading }: SchoolProfileFormProps) {
  const form = useForm<SchoolProfileFormValues>({
    resolver: zodResolver(schoolProfileSchema) as any,
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      timezone: "Asia/Kolkata",
      academicYearStart: "april",
      estdYear: null,
      board: "",
      affiliationNo: "",
      website: "",
      motto: "",
    },
  });

  const { isSubmitting } = form.formState;

  const schoolInitials = initialData?.name
    ? initialData.name.split(" ").map((w) => w[0]).join("").substring(0, 3).toUpperCase()
    : "SCH";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Logo Section */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold mb-4">School Logo</h3>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={initialData?.logoUrl || "/school-logo.png"} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {schoolInitials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" type="button">
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground">
                Recommended: 200x200px, PNG or JPG
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">Basic Information</h3>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>School Code</FormLabel>
              <FormControl>
                <Input value={initialData?.code || ""} disabled className="bg-muted" />
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Address */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">Address</h3>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Institute Profile */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">Institute Profile</h3>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="estdYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Established Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 1995"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="board"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board / Affiliation</FormLabel>
                  <div className="space-y-2">
                    <Select
                      value={STANDARD_BOARDS.includes(field.value || "") ? field.value || "" : "Other"}
                      onValueChange={(v) => {
                        if (v === "Other") {
                          field.onChange(""); // Clear to allow typing custom board
                        } else {
                          field.onChange(v);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select board" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STANDARD_BOARDS.map((board) => (
                          <SelectItem key={board} value={board}>
                            {board}
                          </SelectItem>
                        ))}
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* Custom Input */}
                    {!STANDARD_BOARDS.includes(field.value || "") && (
                      <Input
                        placeholder="Enter Board Name"
                        value={field.value || ""}
                        onChange={field.onChange}
                        autoFocus
                      />
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="affiliationNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Affiliation Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 3430256" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://myschool.edu.in" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="motto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motto / Tagline</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Knowledge is Power" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting || isLoading}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
