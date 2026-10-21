
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { State } from "country-state-city";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { saveJobPost } from "@/utils/localDb";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MDEditor from "@uiw/react-md-editor";

const schema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Select a location"),
  requirements: z.string().min(1, "Requirements are required"),
});

const inputClass =
  "w-full border-slate-300 bg-white text-slate-900 " +
  "placeholder:text-slate-500 " +
  "focus-visible:ring-blue-500 " +
  "dark:border-slate-600 dark:bg-slate-800 " +
  "dark:text-white dark:placeholder:text-slate-400";

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      company: "",
      title: "",
      description: "",
      location: "",
      requirements: "",
    },
  });

  const onSubmit = (data) => {
    if (!user || user.role !== "recruiter") {
      return;
    }

    const newJob = {
      id: crypto.randomUUID(),
      ...data,
      recruiter_id: user.id,
      isOpen: true,
      createdAt: new Date().toISOString(),
    };

    const saved = saveJobPost(newJob);

    if (saved) {
      navigate("/my-jobs");
    } else {
      alert("Unable to save the job. Please try again.");
    }
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="gradient-title pb-3 text-4xl font-extrabold sm:text-5xl">
          Post a Job
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 sm:text-base">
          Create a job opportunity and find the right candidate.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-lg dark:border-slate-700 dark:bg-slate-900/95 sm:p-8"
      >
        {/* Company */}
        <div className="space-y-2">
          <label
            htmlFor="company"
            className="text-sm font-semibold text-slate-800 dark:text-slate-100"
          >
            Company Name
          </label>

          <Input
            id="company"
            placeholder="Enter company name"
            className={inputClass}
            {...register("company")}
          />

          {errors.company && (
            <p className="text-sm text-red-500">
              {errors.company.message}
            </p>
          )}
        </div>

        {/* Job Title */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-semibold text-slate-800 dark:text-slate-100"
          >
            Job Title
          </label>

          <Input
            id="title"
            placeholder="Enter job title"
            className={inputClass}
            {...register("title")}
          />

          {errors.title && (
            <p className="text-sm text-red-500">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-semibold text-slate-800 dark:text-slate-100"
          >
            Job Description
          </label>

          <Textarea
            id="description"
            placeholder="Describe the role, responsibilities, and expectations..."
            rows={5}
            className={`${inputClass} min-h-32 resize-y`}
            {...register("description")}
          />

          {errors.description && (
            <p className="text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label
            htmlFor="job-location"
            className="text-sm font-semibold text-slate-800 dark:text-slate-100"
          >
            Job Location
          </label>

          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="job-location"
                  className="w-full border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                >
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  className="z-50 max-h-64 overflow-y-auto border-slate-200 bg-white text-slate-900 shadow-xl dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                >
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map(
                      ({ name }) => (
                        <SelectItem
                          key={name}
                          value={name}
                          className="cursor-pointer text-slate-900 outline-none focus:bg-blue-100 focus:text-blue-900 data-[state=checked]:font-semibold dark:text-slate-100 dark:focus:bg-slate-700 dark:focus:text-white"
                        >
                          {name}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          {errors.location && (
            <p className="text-sm text-red-500">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Requirements */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Job Requirements
          </label>

          <Controller
            name="requirements"
            control={control}
            render={({ field }) => (
              <div
                className="overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600"
                data-color-mode={
                  document.documentElement.classList.contains("dark")
                    ? "dark"
                    : "light"
                }
              >
                <MDEditor
                  value={field.value}
                  onChange={(value) =>
                    field.onChange(value || "")
                  }
                  height={250}
                  preview="edit"
                />
              </div>
            )}
          />

          {errors.requirements && (
            <p className="text-sm text-red-500">
              {errors.requirements.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-3">
          <Button
            type="submit"
            variant="blue"
            size="lg"
            disabled={isSubmitting}
            className="min-w-44"
          >
            {isSubmitting ? "Posting..." : "Post Job"}
          </Button>
        </div>
      </form>
    </main>
  );
};

export default PostJob;
