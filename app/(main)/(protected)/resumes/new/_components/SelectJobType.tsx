"use client";

import { JobType } from "@/app/generated/prisma/enums";

type Props = {
  onSelectJobType: (jobType: JobType) => void;
  selectedJobType: JobType | null;
};

const jobTypes = [
  {
    jobType: JobType.CAFE,
    label: "カフェ・飲食",
    icon: "☕️",
  },
  {
    jobType: JobType.FARM,
    label: "農業",
    icon: "🌾",
  },
  {
    jobType: JobType.HOTEL,
    label: "ホテル",
    icon: "🏨",
  },
];

export default function SelectJobType({
  onSelectJobType,
  selectedJobType,
}: Props) {
  return (
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-bold">
        希望する業種を選択してください
      </h1>

      <p className="mb-8 text-gray-500">
        業種を選び、タイトルを入力して作成を始めましょう。
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {jobTypes.map((job) => (
          <button
            key={job.jobType}
            type="button"
            onClick={() => onSelectJobType(job.jobType)}
            className={`text-black rounded-xl border p-8 shadow-sm transition hover:border-blue-500 ${selectedJobType === job.jobType ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600" : "border-gray-200 bg-white"}`}
          >
            <div className="mb-4 text-5xl">{job.icon}</div>

            <div className="text-lg font-semibold">{job.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
