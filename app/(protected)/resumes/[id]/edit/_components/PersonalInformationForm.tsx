import { ResumeEditFormData } from "@/app/_schemas/resumeEditSchema";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<ResumeEditFormData>;
  errors: FieldErrors<ResumeEditFormData>;
  isSubmitting: boolean;
};

export default function PersonalInformationForm({
  register,
  errors,
  isSubmitting,
}: Props) {
  return (
    <form className="mb-8">
      <h2 className="text-xl font-bold mb-4">Personal Information</h2>

      <div className="space-y-4">
        <div>
          <label>Full Name</label>
          <input
            type="text"
            {...register("fullName")}
            className="w-full border p-2"
            disabled={isSubmitting}
          />

          {errors.fullName && (
            <p className="text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border p-2"
            disabled={isSubmitting}
          />

          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label>Phone</label>
          <input
            type="text"
            {...register("phone")}
            className="w-full border p-2"
            disabled={isSubmitting}
          />

          {errors.phone && (
            <p className="text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label>Address</label>
          <input
            type="text"
            {...register("address")}
            className="w-full border p-2"
            disabled={isSubmitting}
          />

          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label>Visa Information</label>
          <input
            type="text"
            {...register("visaInfo")}
            className="w-full border p-2"
            disabled={isSubmitting}
          />

          {errors.visaInfo && (
            <p className="text-red-500">{errors.visaInfo.message}</p>
          )}
        </div>

        <div>
          <label>Availability</label>
          <input
            type="text"
            {...register("availability")}
            className="w-full border p-2"
            disabled={isSubmitting}
          />

          {errors.availability && (
            <p className="text-red-500">{errors.availability.message}</p>
          )}
        </div>
      </div>
    </form>
  );
}
