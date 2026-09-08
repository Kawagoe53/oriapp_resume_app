"use client";

import useFetch from "@/app/_hooks/useFetch";
import { ResumeShowResponse } from "@/app/_schemas/resumeResponseSchema";
import { useParams, useRouter } from "next/navigation";

export default function PreviewPage() {
  const { id } = useParams();
  const router = useRouter();

  const {
    data: resumeResponse,
    error,
    isLoading,
  } = useFetch<ResumeShowResponse>(`/api/resumes/${id}`);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !resumeResponse) {
    return <div>履歴書の取得に失敗しました</div>;
  }

  const resume = resumeResponse.resume;

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-8">
      {/* Buttons */}
      <div className="w-[210mm] flex justify-end gap-3 mb-4 print:hidden">
        <button
          type="button"
          onClick={() => router.push(`/resumes/${id}/edit`)}
          className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="px-5 py-2 bg-white border border-black rounded hover:bg-gray-100"
        >
          Download PDF
        </button>
      </div>

      {/* A4 */}
      <div className="w-[210mm] h-[297mm] bg-white p-[20mm] shadow-lg print:shadow-none print:m-0 box-border overflow-hidden">
        {/* ================= Header ================= */}
        <header className="flex mb-8">
          {/* Left - 60% */}
          <div className="w-[60%] flex flex-col justify-center">
            <h1 className="text-4xl font-normal tracking-wide">
              {resume.fullName}
            </h1>
          </div>

          {/* Right - 40% */}
          <div className="w-[40%]">
            <h2 className="text-2xl font-bold mb-4">CONTACT</h2>

            <div className="space-y-3 text-sm">
              <p>☎ {resume.phone}</p>

              <p>✉ {resume.email}</p>

              <p>◎ {resume.address}</p>
            </div>
          </div>
        </header>

        {/* ================= Main ================= */}
        <main className="relative flex">
          {/* 中央の縦線 */}
          <div className="absolute left-[40%] top-0 bottom-0 border-l-2 border-black" />

          {/* ================= Left ================= */}
          <section className="w-[40%] pr-6">
            {/* Certificate */}
            <div className="mb-2">
              <h2 className="text-xl font-bold">Certificate</h2>

              {resume.certificate?.map((certificate, index) => (
                <p key={index} className="text-sm">
                  -{certificate}
                </p>
              ))}
            </div>

            {/* Visa */}
            <div className="mb-2">
              <h2 className="text-xl font-bold">VISA INFORMATION</h2>

              <p className="font-bold text-sm">{resume.visaInfo}</p>
            </div>

            {/* Availability */}
            <div className="mb-2">
              <h2 className="text-xl font-bold">Availability</h2>

              <p className="text-sm">- {resume.availability}</p>
            </div>

            {/* Summary */}
            <div className="border-t-2 border-black pt-2 mb-2">
              <h2 className="text-xl font-bold">SUMMARY</h2>

              <p className="text-sm leading-6">{resume.summary}</p>
            </div>

            {/* Education */}
            <div className="border-t-2 border-black pt-2">
              <h2 className="text-xl font-bold mb-2">EDUCATION</h2>

              <div className="text-sm mb-5">
                <p className="font-bold">{resume.educationSchool}</p>

                <p>{resume.educationMajor}</p>

                {resume.educationYear && <p>{resume.educationYear}</p>}
              </div>
            </div>
          </section>

          {/* ================= Right ================= */}
          <section className="w-[60%] pl-8">
            <h2 className="text-xl font-bold mb-5">WORK EXPERIENCE</h2>

            {resume.jobExperiences.map((experience) => (
              <div
                key={experience.id}
                className="pb-5 border-b border-dashed border-black mb-5"
              >
                <h3 className="text-lg font-bold">-{experience.position}</h3>

                <p className="text-sm mb-2">
                  {experience.companyName} (
                  {new Date(experience.startDate).getFullYear()}
                  {experience.endDate &&
                    ` - ${new Date(experience.endDate).getFullYear()}`}
                  )
                </p>

                <p className="text-sm mb-2">{experience.jobType}</p>

                {/* Description */}
                <ul className="list-disc pl-5 text-sm leading-6">
                  {Array.isArray(experience.description) &&
                    experience.description.map((description, index) => (
                      <li key={index}>{description}</li>
                    ))}
                </ul>
              </div>
            ))}
          </section>

          {/* ================= Diamonds ================= */}

          {/* Diamond 1 */}
          <div className="absolute left-[40.1%] top-[238px] -translate-x-1/2 w-5 h-5 bg-black rotate-45" />

          {/* Diamond 2 */}
          <div className="absolute left-[40.1%] top-[620px] -translate-x-1/2 w-5 h-5 bg-black rotate-45" />
        </main>
      </div>
    </div>
  );
}
