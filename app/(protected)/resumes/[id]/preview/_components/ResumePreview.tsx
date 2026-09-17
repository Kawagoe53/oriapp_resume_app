"use client";

import type { ResumeShowResponse } from "@/app/_schemas/resumeResponseSchema";
import { useFitToPage } from "../_hooks/useFitToPage";
import Link from "next/link";

export default function ResumePreview({ resume }: { resume: ResumeShowResponse["resume"] }) {
  const { pageRef, contentRef, ready, scale, fit } = useFitToPage(resume);

  return (
    <div className="resume-preview">
      <div className="resume-toolbar print:hidden">
        <div className="flex justify-end gap-3 mb-3">
          <Link href={`/resumes/${resume.id}/edit`} className="px-5 py-2 bg-black text-white rounded">Edit</Link>
          <button type="button" disabled={!ready}
            onClick={() => { fit(); window.print(); }}
            className="px-5 py-2 bg-white border border-black rounded disabled:opacity-50 disabled:cursor-wait">
            {ready ? "印刷・PDF保存" : "レイアウトを調整中…"}
          </button>
        </div>
        <p className="text-sm">印刷画面で「PDFとして保存」、用紙「A4」、倍率「100%」を選び、ヘッダーとフッターをオフにしてください。</p>
        <p aria-live="polite" className="text-sm mt-2 text-amber-800">
          {ready && scale < 0.8 ? "内容が多いため、文字が小さくなっています。職歴の説明を短くすると読みやすくなります。" : ""}
        </p>
      </div>
      <div className="resume-paper" aria-label="履歴書 A4プレビュー" aria-busy={!ready}>
        <div ref={pageRef} className="resume-page-area">
          <div ref={contentRef} className="resume-content" data-job-count={resume.jobExperiences.length}>
        {/* ================= Header ================= */}
        <header className="flex mb-8">
          {/* Left - 60% */}
          <div className="w-[60%] min-w-0 flex flex-col justify-center">
            <h1 className="text-4xl font-normal tracking-wide">
              {resume.fullName}
            </h1>
          </div>

          {/* Right - 40% */}
          <div className="w-[40%] min-w-0">
            <h2 className="text-2xl font-bold mb-4">CONTACT</h2>

            <div className="space-y-3 text-sm">
              <p>☎ {resume.phone}</p>

              <p>✉ {resume.email}</p>

              <p>◎ {resume.address}</p>
            </div>
          </div>
        </header>

        {/* ================= Main ================= */}
        <div className="resume-columns relative flex">
          {/* 中央の縦線 */}
          <div className="absolute left-[40%] top-0 bottom-0 border-l-2 border-black" />

          {/* ================= Left ================= */}
          <section className="w-[40%] min-w-0 pr-6">
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
          <section className="w-[60%] min-w-0 pl-8">
            <h2 className="text-xl font-bold mb-5">WORK EXPERIENCE</h2>

            {resume.jobExperiences.map((experience) => (
              <div
                key={experience.id}
                className="resume-job pb-5 border-b border-dashed border-black mb-5"
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


        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
