"use client";

import { JobType } from "@/app/generated/prisma/enums";

type Props = {
  onSelectJobType: (jobType: JobType) => void;
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

export default function SelectJobType({ onSelectJobType }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold">
        希望する業種を選択してください
      </h1>

      <p className="mb-8 text-gray-500">選択すると履歴書の作成が始まります。</p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {jobTypes.map((job) => (
          <button
            key={job.jobType}
            type="button"
            onClick={() => onSelectJobType(job.jobType)}
            className="text-black rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
          >
            <div className="mb-4 text-5xl">{job.icon}</div>

            <div className="text-lg font-semibold">{job.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
