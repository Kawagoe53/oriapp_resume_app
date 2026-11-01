import type { Metadata } from "next";
import Link from "next/link";
import ResumeDemo from "./_components/landing/ResumeDemo";
import ResumeSample from "./_components/landing/ResumeSample";
import { AI_USAGE_MONTHLY_LIMIT } from "./_libs/aiUsage";
import "./landing.css";

export const metadata: Metadata = {
  title: "rereki. | ワーホリ・留学生のための英文Resume作成",
  description: "AIの質問に答えながら、オーストラリアの仕事探しに使う英文履歴書を作成。職種選択から編集、PDF保存まで。完成見本も確認できます。",
};

const steps = [
  { title: "応募したい仕事を選ぶ", text: "仕事に合わせて、履歴書にまとめる経験を整理します。" },
  { title: "質問に答えて、経歴を伝える", text: "これまでの仕事や得意なことを、AIとの会話で一つずつ伝えます。" },
  { title: "英文を確認して、PDFで保存する", text: "作成した内容は自分で編集できます。確認が済んだら、印刷画面からPDFとして保存します。" },
];

function CreateLink() {
  return <Link href="/signup" className="landing-button landing-button--primary">無料でResumeを作る</Link>;
}

export default function Home() {
  return (
    <div className="landing">
      <a href="#main" className="landing-skip">本文へスキップ</a>
      <header className="landing-header landing-container">
        <Link href="/" className="landing-logo" aria-label="rereki. トップ">rereki<span>.</span></Link>
        <nav aria-label="メインナビゲーション">
          <Link href="/contact" className="landing-contact">お問い合わせ</Link>
          <Link href="/login" className="landing-login">ログイン</Link>
        </nav>
      </header>
      <main id="main">
        <section className="landing-hero">
          <div className="landing-container landing-hero-layout">
            <div className="landing-intro">
              <p className="landing-audience">ワーホリ・留学生の英文履歴書づくり</p>
              <h1>オーストラリアで<br />仕事を探す。<br />まず、Resumeから。</h1>
              <p className="landing-lead">何を書けばいいか、英語でどう伝えるか。<br />rereki. は、AIの質問に答えながら<br className="desktop-break" />自分の経験を英文履歴書にまとめるサービスです。</p>
              <div className="landing-actions"><CreateLink /><ResumeDemo /></div>
              <p className="landing-free">AI作成は月{AI_USAGE_MONTHLY_LIMIT}回まで無料。作成には登録が必要です。</p>
            </div>
            <figure id="sample" className="landing-sample-frame">
              <ResumeSample />
              <figcaption>英文Resumeの完成見本（架空の人物・経歴）</figcaption>
            </figure>
          </div>
        </section>

        <section className="landing-example landing-container" aria-labelledby="example-heading">
          <div><h2 id="example-heading">日本での仕事も、<br />書ける経験になります。</h2><p>接客やチームでの仕事など、<br />これまで担当してきたことを伝えてください。</p></div>
          <dl className="landing-translation">
            <div><dt>たとえば、こんな経験</dt><dd>「カフェで接客や注文の対応をしていました」</dd></div>
            <div><dt>英文での表現例</dt><dd lang="en">Provided friendly customer service and handled customer orders.</dd></div>
          </dl>
        </section>

        <section className="landing-how landing-container" aria-labelledby="how-heading">
          <div className="landing-how-heading"><h2 id="how-heading">作成の流れ</h2><p>英文の内容を確認してから、<br />応募に使ってください。</p></div>
          <ol className="landing-steps">{steps.map(({ title, text }) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol>
        </section>

        <section className="landing-bottom" aria-labelledby="start-heading">
          <div className="landing-container landing-bottom-layout">
            <div><h2 id="start-heading">自分の経歴で、作ってみる。</h2><p>渡航前の準備にも、現地での仕事探しにも。</p></div>
            <CreateLink />
          </div>
        </section>
      </main>
      <footer className="landing-footer"><div className="landing-container">
        <Link href="/" className="landing-logo">rereki<span>.</span></Link>
        <nav aria-label="フッターナビゲーション"><Link href="/contact">お問い合わせ</Link><Link href="/login">ログイン</Link><Link href="/signup">新規登録</Link></nav>
        <p>© {new Date().getFullYear()} rereki.</p>
      </div></footer>
    </div>
  );
}
