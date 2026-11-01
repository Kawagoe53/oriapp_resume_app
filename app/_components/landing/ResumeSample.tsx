export const sampleJobs = {
  cafe: { label: "カフェ", position: "CAFE ALL-ROUNDER", task: "Prepared drinks and supported the team during busy service periods." },
  restaurant: { label: "レストラン", position: "RESTAURANT TEAM MEMBER", task: "Served food and worked with kitchen staff to keep service running smoothly." },
  hotel: { label: "ホテル", position: "HOTEL TEAM MEMBER", task: "Welcomed guests and helped maintain a clean, comfortable environment." },
};

export type SampleJob = keyof typeof sampleJobs;
export type SampleExperience = "customer" | "team";

export default function ResumeSample({ job = "cafe", experience = "customer" }: {
  job?: SampleJob;
  experience?: SampleExperience;
}) {
  return (
    <article className="landing-resume-sample" lang="en" aria-label="架空の人物による英文履歴書の完成見本">
      <header>
        <div><h3>HARU TANAKA</h3><p>{sampleJobs[job].position}</p></div>
        <div className="sample-contact">Melbourne, VIC<br />haru@example.com<br />04XX XXX XXX</div>
      </header>
      <div className="sample-columns">
        <aside>
          <h4>SKILLS</h4>
          <p>Customer service<br />Teamwork<br />Time management<br />Conversational English</p>
          <h4>AVAILABILITY</h4>
          <p>Monday – Friday<br />Immediate start</p>
          <h4>EDUCATION</h4>
          <p>Sample University<br />Bachelor of Arts</p>
        </aside>
        <div>
          <h4>PROFILE</h4>
          <p>A friendly and reliable team member with experience in hospitality. Eager to bring a positive attitude and attention to detail to a new role.</p>
          <h4>WORK EXPERIENCE</h4>
          <strong>{sampleJobs[job].position}</strong>
          <p className="sample-company">Sample Company · Japan<br />2023 – 2025</p>
          <ul>
            <li>{experience === "customer" ? "Assisted customers with orders and provided friendly, attentive service." : "Collaborated with colleagues and supported daily operations as part of a team."}</li>
            <li>{sampleJobs[job].task}</li>
            <li>Maintained a clean and organised workspace.</li>
          </ul>
          <h4>REFERENCES</h4>
          <p>Available upon request.</p>
        </div>
      </div>
    </article>
  );
}
