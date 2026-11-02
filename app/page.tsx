import type { Metadata } from "next";
import Link from "next/link";
import ResumeDemo from "./_components/landing/ResumeDemo";
import ResumeSample from "./_components/landing/ResumeSample";
import { actionButtonVariants } from "./_components/ui/actionButtonVariants";
import { AI_USAGE_MONTHLY_LIMIT } from "./_libs/aiUsage";

export const metadata: Metadata = {
  title: "rireki. | ワーホリ・留学生のための英文Resume作成",
  description:
    "AIの質問に答えながら、オーストラリアの仕事探しに使う英文履歴書を作成。職種選択から編集、PDF保存まで。完成見本も確認できます。",
};

const container =
  "mx-auto w-[min(1120px,calc(100%_-_80px))] max-[760px]:w-[calc(100%_-_40px)]";
const sectionHeading =
  "text-[26px] font-semibold leading-[1.7] tracking-[-.035em] max-[760px]:text-[23px]";
const logo =
  "text-[29px] font-extrabold tracking-[-1.8px] no-underline max-[760px]:text-[25px]";
const steps = [
  {
    title: "応募したい仕事を選ぶ",
    text: "仕事に合わせて、履歴書にまとめる経験を整理します。",
  },
  {
    title: "質問に答えて、経歴を伝える",
    text: "これまでの仕事や得意なことを、AIとの会話で一つずつ伝えます。",
  },
  {
    title: "英文を確認して、PDFで保存する",
    text: "作成した内容は自分で編集できます。確認が済んだら、印刷画面からPDFとして保存します。",
  },
];

function CreateLink({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link
      href="/signup"
      className={actionButtonVariants({
        variant: inverted ? "inverted" : "primary",
        size: "landing",
      })}
    >
      無料でResumeを作る
    </Link>
  );
}

export default function Home() {
  return (
    <div className="bg-background text-foreground [&_a]:[-webkit-tap-highlight-color:transparent] [&_button]:[-webkit-tap-highlight-color:transparent] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-[5px] [&_a:focus-visible]:outline-primary [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-[5px] [&_button:focus-visible]:outline-primary [&_input:focus-visible]:outline-2 [&_input:focus-visible]:outline-offset-[5px] [&_input:focus-visible]:outline-primary">
      <a
        href="#main"
        className="fixed top-[-100px] left-4 z-100 bg-background p-3 focus:top-3"
      >
        本文へスキップ
      </a>
      <header
        className={`${container} flex h-[88px] items-center justify-between max-[760px]:h-[74px]`}
      >
        <Link
          href="/"
          className={`${logo} text-foreground`}
          aria-label="rireki. トップ"
        >
          rireki<span className="text-primary">.</span>
        </Link>
        <nav
          aria-label="メインナビゲーション"
          className="flex items-center gap-8 text-[13px] font-semibold max-[760px]:gap-[14px] max-[760px]:text-[11px]"
        >
          <Link href="/contact" className="max-[760px]:hidden">
            お問い合わせ
          </Link>
          <Link
            href="/login"
            className={actionButtonVariants({
              variant: "outline",
              className: "max-[760px]:px-3 max-[760px]:text-xs",
            })}
          >
            ログイン
          </Link>
          <Link
            href="/signup"
            className={actionButtonVariants({
              className: "max-[760px]:px-3 max-[760px]:text-xs",
            })}
          >
            新規登録
          </Link>
        </nav>
      </header>
      <main id="main">
        <section className="bg-secondary py-16 max-[760px]:py-[38px]">
          <div
            className={`${container} grid grid-cols-2 items-center gap-16 max-[760px]:grid-cols-1 max-[760px]:gap-9`}
          >
            <div>
              <p className="text-[13px] text-primary">
                ワーホリ・留学生の英文履歴書づくり
              </p>
              <h1 className="my-6 text-[clamp(32px,3.4vw,46px)] font-[650] leading-[1.55] tracking-[-.045em] max-[760px]:my-5 max-[760px]:text-[clamp(30px,7.8vw,44px)]">
                オーストラリアで
                <br />
                仕事を探す。
                <br />
                まず、Resumeから。
              </h1>
              <p className="text-sm leading-[2.1] text-muted-foreground max-[760px]:text-[13px]">
                何を書けばいいか、英語でどう伝えるか。
                <br />
                rireki. は、AIの質問に答えながら
                <br className="max-[760px]:hidden" />
                自分の経験を英文履歴書にまとめるサービスです。
              </p>
              <div className="mt-[30px] flex flex-wrap items-center gap-4 max-[760px]:gap-3">
                <CreateLink />
                <ResumeDemo />
              </div>
              <p className="mt-4 text-[11px] leading-[1.9] text-muted-foreground">
                AI作成は月{AI_USAGE_MONTHLY_LIMIT}
                回まで無料。作成には登録が必要です。
              </p>
            </div>
            <figure
              id="sample"
              className="m-0 scroll-mt-6 max-[760px]:mx-auto max-[760px]:w-full max-[760px]:max-w-[480px]"
            >
              <ResumeSample />
              <figcaption className="mt-[14px] text-[11px] text-muted-foreground">
                英文Resumeの完成見本（架空の人物・経歴）
              </figcaption>
            </figure>
          </div>
        </section>

        <section
          className={`${container} grid grid-cols-[1fr_1.3fr] gap-20 py-[72px] max-[760px]:grid-cols-1 max-[760px]:gap-[25px] max-[760px]:py-[42px]`}
          aria-labelledby="example-heading"
        >
          <div>
            <h2 id="example-heading" className={sectionHeading}>
              日本での仕事も、
              <br />
              書ける経験になります。
            </h2>
            <p className="mt-[15px] text-[13px] leading-8 text-muted-foreground">
              接客やチームでの仕事など、
              <br />
              これまで担当してきたことを伝えてください。
            </p>
          </div>
          <dl>
            <div className="py-[19px]">
              <dt className="mb-[11px] text-xs text-muted-foreground">
                たとえば、こんな経験
              </dt>
              <dd className="text-base leading-[1.9] max-[760px]:text-sm">
                「カフェで接客や注文の対応をしていました」
              </dd>
            </div>
            <div className="border-t py-[19px]">
              <dt className="mb-[11px] text-xs text-muted-foreground">
                英文での表現例
              </dt>
              <dd
                lang="en"
                className="text-[21px] leading-[1.65] text-primary max-[760px]:text-[19px]"
              >
                Provided friendly customer service and handled customer orders.
              </dd>
            </div>
          </dl>
        </section>

        <section
          className={`${container} grid grid-cols-[1fr_1.3fr] gap-20 border-t pt-[55px] pb-20 max-[760px]:grid-cols-1 max-[760px]:gap-[25px] max-[760px]:py-[42px]`}
          aria-labelledby="how-heading"
        >
          <div>
            <h2 id="how-heading" className={sectionHeading}>
              作成の流れ
            </h2>
            <p className="mt-[15px] text-[13px] leading-8 text-muted-foreground">
              英文の内容を確認してから、
              <br />
              応募に使ってください。
            </p>
          </div>
          <ol className="list-decimal pl-[23px] marker:text-[15px] marker:text-primary">
            {steps.map(({ title, text }) => (
              <li
                key={title}
                className="pt-[5px] pb-6 pl-2.5 not-first:border-t not-first:pt-6"
              >
                <h3 className="mb-2.5 text-[17px] font-semibold">{title}</h3>
                <p className="text-[13px] leading-[1.95] text-muted-foreground">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="bg-primary py-[45px] text-white"
          aria-labelledby="start-heading"
        >
          <div
            className={`${container} flex items-center justify-between gap-[30px] max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-[22px]`}
          >
            <div>
              <h2 id="start-heading" className={sectionHeading}>
                自分の経歴で、作ってみる。
              </h2>
              <p className="mt-2.5 text-[13px] text-accent">
                渡航前の準備にも、現地での仕事探しにも。
              </p>
            </div>
            <CreateLink inverted />
          </div>
        </section>
      </main>
      <footer className="bg-footer py-8">
        <div className={`${container} flex flex-wrap items-center gap-[26px]`}>
          <Link href="/" className={`${logo} text-primary`}>
            rireki.
          </Link>
          <nav
            aria-label="フッターナビゲーション"
            className="ml-auto flex gap-6 text-xs max-[760px]:gap-[14px] max-[760px]:text-[11px]"
          >
            <Link href="/contact">お問い合わせ</Link>
            <Link href="/login">ログイン</Link>
            <Link href="/signup">新規登録</Link>
          </nav>
          <p className="w-full text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} rireki.
          </p>
        </div>
      </footer>
    </div>
  );
}
