"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

export function useFitToPage(content: unknown) {
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState({ content, ready: false, scale: 1 });

  const fit = useCallback(() => {
    const page = pageRef.current; //pageRefが指しているA4のdivをpageという変数に入れる
    const element = contentRef.current; //Resume本体
    if (!page || !element) return; //どちらかのDOMがまだ取れていないなら、今回はfit()を終了

    //前回のサイズ計算があるかもなんで一度「元のサイズ」に戻す
    element.style.transform = "none";
    element.style.width = "100%";
    element.removeAttribute("data-compact"); //まず余白などをコンパクトにして入らないか試す
    const available = page.clientHeight - 2;
    // A4の高さから2px引いた値をavailableに入れる/A4の「使える高さ」を取得
    //印刷時の小数点・丸め誤差などでギリギリはみ出すのを防ぐため、2pxだけ安全マージンを取っている

    //ここまでがまずResume本来のサイズを正しく測って、はみ出しているならコンパクト表示にする

    if (element.scrollHeight > available) element.dataset.compact = "true"; //A4の高さをResumeの高さが超えていた場合はdata-compact属性をtrueにすることで、余白などをコンパクトにして入るか試す
    let scale = 1; //「A4に収まるなら、そのまま100%で使う」という初期値
    if (element.scrollHeight > available) {
      let low = Math.min(1, available / Math.max(1, element.scrollHeight));
      let high = 1;

      for (let attempt = 0; attempt < 20; attempt++) {
        const candidate = (low + high) / 2; //「A4に収まるかどうか」を二分探索で調べる candidateは「A4に収まるかどうか」を調べるための倍率
        element.style.width = `${100 / candidate}%`;
        if (element.scrollHeight * candidate <= available) low = candidate;
        else high = candidate;
      }
      scale = low;
    }
    element.style.width = `${100 / scale}%`;
    element.style.transform = `scale(${scale})`;
    setResult(
      (
        previous, //今回の計算結果が前回と同じならstateを更新しない。違うなら新しい結果で更新する
      ) =>
        previous.content === content &&
        previous.ready &&
        previous.scale === scale
          ? previous
          : { content, ready: true, scale },
    );
  }, [content]);

  useLayoutEffect(() => {
    let cancelled = false; //useLayoutEffectがすでに終了したかどうかを示すフラグ
    let frame = 0; //requestAnimationFrameの予約IDを保存する変数
    const schedule = () => {
      //fit()の予約が複数あれば、前の予約をキャンセルして最新の予約だけを残す
      cancelAnimationFrame(frame); //前の予約をキャンセル
      frame = requestAnimationFrame(() => {
        //次のアニメーションフレームでfit()を実行するように予約
        if (!cancelled) fit(); //まだこの処理が有効ならfit()してね
      });
    };
    const observer = new ResizeObserver(schedule); //(監視役)監視しているDOMのサイズが変わったら、渡された関数を実行する
    void document.fonts.ready.then(() => {
      //フォントの読み込みが完了したら
      if (cancelled) return; //Resume画面を離れているのに、遅れてfit()したりResizeObserverを登録したりするのを防いでいる
      fit();
      if (pageRef.current) observer.observe(pageRef.current);
      if (contentRef.current) observer.observe(contentRef.current);
    });
    document.fonts.addEventListener("loadingdone", schedule);
    window.addEventListener("beforeprint", fit); //念のため、印刷前に現在のDOMサイズでもう一度scaleを合わせておく
    return () => {
      //useLayoutEffectが終了する時の処理→useLayoutEffectが終了するときに、今まで作った予約・監視・イベント登録を全部片付ける処理
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", schedule);
      window.removeEventListener("beforeprint", fit); //
    };
  }, [fit]);

  return {
    pageRef,
    contentRef,
    fit,
    ready: result.content === content && result.ready,
    scale: result.scale,
  };
}
