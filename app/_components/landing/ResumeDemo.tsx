"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import ResumeSample, {
  sampleJobs,
  type SampleExperience,
  type SampleJob,
} from "./ResumeSample";

const experiences: { value: SampleExperience; label: string }[] = [
  { value: "customer", label: "お客様の接客・注文対応をしていた" },
  { value: "team", label: "チームで協力して仕事を進めていた" },
];
const titles = [
  "応募したい仕事を選ぶ",
  "これまでの経験を選ぶ",
  "英文Resumeの完成見本",
];

export default function ResumeDemo() {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const id = useId();
  const [step, setStep] = useState(0);
  const [job, setJob] = useState<SampleJob>("cafe");
  const [experience, setExperience] = useState<SampleExperience>("customer");

  function openDemo() {
    setStep(0);
    setJob("cafe");
    setExperience("customer");
    dialog.current?.showModal();
  }

  return (
    <>
      <button
        type="button"
        className="landing-button landing-button--outline"
        onClick={openDemo}
      >
        登録せずに体験する
      </button>
      <dialog
        ref={dialog}
        className="resume-demo"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-note`}
      >
        <div className="resume-demo-top">
          <p>サンプル体験 · {step + 1} / 3</p>
          <button
            type="button"
            className="resume-demo-close"
            onClick={() => dialog.current?.close()}
          >
            閉じる
          </button>
        </div>
        <h2 ref={heading} id={`${id}-title`} tabIndex={-1}>
          {titles[step]}
        </h2>
        <p id={`${id}-note`} className="resume-demo-note">
          用意したサンプルを表示する体験です。個人情報の入力は不要で、選んだ内容は保存されません。
        </p>
        {step === 0 && (
          <fieldset className="resume-demo-options">
            <legend className="sr-only">応募したい仕事</legend>
            {Object.entries(sampleJobs).map(
              //sampleJobsオブジェクトを「キーと値のペア」の配列にして、mapでラベルとラジオボタンを生成する
              ([value, item]) => (
                <label key={value}>
                  <input
                    type="radio"
                    name={`${id}-job`}
                    checked={job === value}
                    onChange={() => setJob(value as SampleJob)}
                    //「この value は sampleJobs のキーから取り出したので、職種の3種類のどれかだよ」**と伝えて
                    // //TypeScriptに型を教えてあげる必要があるので、`as SampleJob`で型アサーションしている
                    //型アサーションは、「この値を、この型として扱って」とTypeScriptに伝えること
                  />
                  {item.label}
                </label>
              ),
            )}
          </fieldset>
        )}
        {step === 1 && (
          <fieldset className="resume-demo-options">
            <legend className="sr-only">これまでの経験</legend>
            {experiences.map((item) => (
              <label key={item.value}>
                <input
                  type="radio"
                  name={`${id}-experience`}
                  checked={experience === item.value}
                  onChange={() => setExperience(item.value)}
                />
                {item.label}
              </label>
            ))}
          </fieldset>
        )}
        {step === 2 && (
          <div className="resume-demo-result">
            <p className="resume-demo-note">
              {sampleJobs[job].label} ／{" "}
              {experiences.find((item) => item.value === experience)?.label}
            </p>
            <ResumeSample job={job} experience={experience} />
            <p className="resume-demo-note">
              人物・経歴は架空です。自分の履歴書を作る際は、登録後にAIの質問へ回答します。
            </p>
          </div>
        )}
        <div className="resume-demo-actions">
          {step > 0 && (
            <button
              type="button"
              className="landing-button landing-button--outline"
              onClick={() => setStep(step - 1)}
            >
              戻る
            </button>
          )}
          {step < 2 ? (
            <button
              type="button"
              className="landing-button landing-button--primary"
              onClick={() => setStep(step + 1)}
            >
              {step === 0 ? "次へ" : "完成見本を見る"}
            </button>
          ) : (
            <Link
              href="/signup"
              className="landing-button landing-button--primary"
              onClick={() => dialog.current?.close()}
            >
              登録して自分のResumeを作る
            </Link>
          )}
        </div>
      </dialog>
    </>
  );
}
