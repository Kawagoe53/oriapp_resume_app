export const sampleJobs = {
  cafe: { label: "カフェ", position: "Barista / All-rounder", task: "Prepared espresso-based drinks, adjusted the grinder and cleaned the coffee machine at closing." },
  restaurant: { label: "レストラン", position: "Waiter / Kitchen Hand", task: "Took food orders, checked dietary requirements and helped with food preparation." },
  hotel: { label: "ホテル", position: "Guest Service / Housekeeping", task: "Prepared guest rooms, restocked amenities and reported maintenance issues to the supervisor." },
};

export type SampleJob = keyof typeof sampleJobs;
export type SampleExperience = "customer" | "team";

export default function ResumeSample({ job = "cafe", experience = "customer" }: {
  job?: SampleJob;
  experience?: SampleExperience;
}) {
  return (
    <article className="landing-resume-sample" lang="en" aria-label="架空の人物による英文履歴書の完成見本">
      <div className="sample-sheet">
        <header className="sample-header">
          <div className="sample-name"><h3>HARU TANAKA</h3><p>{sampleJobs[job].position}</p></div>
          <div className="sample-contact">
            <h4>CONTACT</h4>
            <p>04XX XXX XXX</p><p>haru@example.com</p><p>Melbourne, VIC 3000</p>
          </div>
        </header>
        <div className="sample-columns">
          <aside>
            <section>
              <h4>Certificate</h4>
              <p>Barista Training Certificate (2025)<br />Responsible Service of Alcohol (2025)</p>
              <h4>VISA INFORMATION</h4>
              <p><strong>Working Holiday Visa (417)</strong><br />Valid until August 2027</p>
              <h4>Availability</h4>
              <p>Available 7 days a week<br />Immediate start</p>
            </section>
            <section className="sample-ruled">
              <h4>SUMMARY</h4>
              <p>Hospitality worker with four years of experience in cafés and restaurants in Japan. Duties included taking orders, preparing coffee, serving meals and closing the store. Completed barista training before moving to Melbourne. Comfortable taking orders in English and working early mornings, evenings and weekends. Seeking a {sampleJobs[job].position.toLowerCase()} position.</p>
            </section>
            <section className="sample-ruled">
              <h4>EDUCATION</h4>
              <div className="sample-education"><strong>West Osaka University</strong><p>BA in International Studies<br />Osaka, Japan<br />2018 – 2022</p></div>
              <div className="sample-education"><strong>Minato Senior High School</strong><p>Osaka, Japan<br />2015 – 2018</p></div>
            </section>
          </aside>
          <section className="sample-work">
            <h4>WORK EXPERIENCE</h4>
            <div className="sample-job">
              <h5>{sampleJobs[job].position}</h5>
              <p className="sample-company">{job === "hotel" ? "Parkside Hotel" : job === "restaurant" ? "Maple Kitchen" : "Little Lane Café"} · Osaka, Japan<br />Apr 2024 – Aug 2026</p>
              <ul>
                <li>{sampleJobs[job].task}</li>
                <li>{experience === "customer" ? "Answered customer questions, confirmed orders and handled cash and card payments." : "Coordinated tasks with colleagues during busy shifts and handed over unfinished work at shift changes."}</li>
                <li>Checked stock levels and restocked supplies before the next shift.</li>
              </ul>
            </div>
            <div className="sample-job">
              <h5>Waiter / Kitchen Hand</h5>
              <p className="sample-company">Maple Dining · Osaka, Japan<br />Apr 2022 – Mar 2024</p>
              <ul>
                <li>Welcomed customers, took orders and served food and drinks in a 40-seat restaurant.</li>
                <li>Prepared ingredients, washed dishes and kept kitchen work areas clean.</li>
                <li>Worked with kitchen staff to check orders and bring meals to the correct tables.</li>
              </ul>
            </div>
            <div className="sample-job">
              <h5>Part-time Café Assistant</h5>
              <p className="sample-company">River Coffee · Osaka, Japan<br />Jun 2020 – Mar 2022</p>
              <ul>
                <li>Prepared takeaway orders and served cakes and sandwiches.</li>
                <li>Cleared tables, washed equipment and helped close the café after service.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
