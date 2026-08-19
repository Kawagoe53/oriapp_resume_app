export const questions = [
  {
    stepNumber: 1,
    question: "氏名をカタカナでフルネームで教えてください。",
    answerType: "name",
    ui: {
      description:
        "カタカナ入力後、ローマ字表記を自動生成して確認・修正できるようにする。",
    },
  },
  {
    stepNumber: 2,
    question: "連絡の取りやすいメールアドレスを教えてください。",
    answerType: "email",
    ui: {
      description:
        "メールアドレス入力時、gmail.comやicloud.comなどの代表的なドメインを候補表示する。",
    },
  },
  {
    stepNumber: 3,
    question: "現地で使える電話番号を教えてください。",
    answerType: "phone",
    ui: {
      description: "電話番号を入力するフォームを表示する。",
    },
  },
  {
    stepNumber: 4,
    question: "現在お住まいの住所を教えてください。",
    answerType: "address",
    ui: {
      description:
        "住所入力、地図から指定、現在地から取得など複数の入力方法を検討する。",
    },
  },
  {
    stepNumber: 5,
    question:
      "最終学歴について教えてください。学校名、専攻、卒業年を教えてください。",
    answerType: "education",
    ui: {
      description:
        "学校名、専攻、卒業年をそれぞれ入力できるフォームを表示する。",
    },
  },
  {
    stepNumber: 6,
    question:
      "これまでの職歴について教えてください。会社名、職種、勤務期間、主な仕事内容を教えてください。",
    answerType: "workExperience",
    ui: {
      description:
        "会社名、職種、勤務期間、勤務地、主な仕事内容をそれぞれ入力できるフォームを表示する。",
    },
  },
  {
    stepNumber: 7,
    question: "ほかに履歴書に記載したい職歴があれば教えてください。",
    answerType: "additionalWorkExperience",
    ui: {
      description:
        "「あり」「なし」を選択し、「あり」の場合は職歴入力フォームを表示する。入力完了後に次の質問へ進む。",
    },
  },
  {
    stepNumber: 8,
    question: "あなたのスキルや強みを教えてください。",
    answerType: "skillsAndStrengths",
    ui: {
      description:
        "スキルは自由入力フォーム、強みは代表的な候補をボタンで選択できるUIを表示する。",
    },
  },
  {
    stepNumber: 9,
    question:
      "履歴書に記載したい資格・免許・修了コースなどがあれば教えてください。\n\n例：運転免許、White Card、RSA、バリスタコース、その他の資格・講習など",
    answerType: "certificate",
    ui: {
      description: "資格・免許・コースなどを自由入力できるフォームを表示する。",
    },
  },
  {
    stepNumber: 10,
    question:
      "現在のビザの種類と有効期限を教えてください。2年目・3年目など、今後ビザを延長する予定があれば、その予定も教えてください。",
    answerType: "visa",
    ui: {
      description:
        "ワーキングホリデービザ（Subclass 417）、学生ビザ、その他から選択できるようにする。「その他」は自由入力。ビザの有効期限と延長予定も入力できるようにする。",
    },
  },
  {
    stepNumber: 11,
    question:
      "最短でいつから働くことができますか？また、希望する勤務曜日や時間帯があれば教えてください。",
    answerType: "availability",
    ui: {
      description:
        "最短勤務開始日はカレンダーから選択。希望勤務曜日・時間帯を選択できるUIを表示する。掛け持ちの有無も「あり」「なし」から選択する。",
    },
  },
];
