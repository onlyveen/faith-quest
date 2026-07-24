export type LanguageCode = "te" | "en" | "kn";

export interface Strings {
  appTitle: string;
  home: {
    subtitle: string;
    start: string;
    language: string;
  };
  playerSetup: {
    title: string;
    placeholder: string;
    cta: string;
  };
  ladder: {
    title: string;
    cta: string;
    howToPlayTitle: string;
    howToPlay: string[];
  };
  preQuestion: {
    questionLabel: string;
    of: string;
    earnedSoFar: string;
    complete: string;
    cta: string;
  };
  question: {
    pause: string;
    resume: string;
    timeUp: string;
    quit: string;
    confirmQuitTitle: string;
    confirmQuitYes: string;
    confirmQuitNo: string;
  };
  lifelines: {
    title: string;
    close: string;
    fiftyFifty: string;
    askAudience: string;
    graceGuess: string;
    graceGuessTryAgain: string;
  };
  audience: {
    title: string;
    close: string;
  };
  milestone: {
    title: string;
    lockedInLabel: string;
    ruleChangeIntro: string;
    difficultyLabel: string;
    timeLabel: string;
    unlimitedTime: string;
    continueCta: string;
    exitCta: string;
  };
  results: {
    won: string;
    gameOver: string;
    exited: string;
    finalAmount: string;
    correctCount: string;
    playAgain: string;
    home: string;
  };
}

export const strings: Record<LanguageCode, Strings> = {
  te: {
    appTitle: "ఫెయిత్ క్వెస్ట్",
    home: {
      subtitle: "బైబిల్ క్విజ్",
      start: "ప్రారంభించండి",
      language: "భాష",
    },
    playerSetup: {
      title: "మీ పేరు ఏమిటి?",
      placeholder: "మీ పేరు టైప్ చేయండి",
      cta: "కొనసాగించు",
    },
    ladder: {
      title: "మీరు ఆడటానికి సిద్ధమేనా?",
      cta: "ప్రారంభించండి !",
      howToPlayTitle: "ఎలా ఆడాలి",
      howToPlay: [
        "అత్యధిక బహుమతిని గెలవడానికి 15 ప్రశ్నలకు సరిగ్గా సమాధానం ఇవ్వండి.",
        "ప్రతి ప్రశ్నకు దాని కఠినతను బట్టి సమయ పరిమితి ఉంటుంది.",
        "ఇబ్బందిలో ఉంటే 3 లైఫ్‌లైన్‌లు ఉపయోగించండి — Wisdom Split, Wise Counsel, Grace Guess.",
        "ప్రశ్న 5 మరియు 10 సురక్షిత చెక్‌పాయింట్‌లు: అక్కడికి చేరితే మీ మన్నాను భద్రపరచుకోవచ్చు లేదా కొనసాగించవచ్చు.",
        "తప్పు సమాధానం మిమ్మల్ని మీ చివరి సురక్షిత చెక్‌పాయింట్‌కు వెనక్కి పంపుతుంది.",
      ],
    },
    preQuestion: {
      questionLabel: "ప్రశ్న",
      of: "/",
      earnedSoFar: "ఇప్పటివరకు పొందుకున్న మన్నా",
      complete: "పూర్తయింది",
      cta: "కొనసాగించు!",
    },
    question: {
      pause: "పాజ్",
      resume: "కొనసాగించు",
      timeUp: "సమయం ముగిసింది!",
      quit: "నిష్క్రమించు",
      confirmQuitTitle: "క్విజ్ నుండి నిష్క్రమించాలి అనుకుంటున్నారా?",
      confirmQuitYes: "అవును, నిష్క్రమించు",
      confirmQuitNo: "కాదు, కొనసాగించు",
    },
    lifelines: {
      title: "లైఫ్‌లైన్‌లు",
      close: "మూసివేయి",
      fiftyFifty: "Wisdom Split",
      askAudience: "Wise Counsel",
      graceGuess: "Grace Guess",
      graceGuessTryAgain: "సరికాదు... మళ్ళీ ప్రయత్నించండి!",
    },
    audience: {
      title: "ప్రేక్షకుల అభిప్రాయం",
      close: "మూసివేయి",
    },
    milestone: {
      title: "మైలురాయి చేరుకున్నారు!",
      lockedInLabel: "మీ గెలుపు కొరకు పొందుపరచబడిన మన్నా:",
      ruleChangeIntro: "తర్వాత రౌండ్:",
      difficultyLabel: "కఠినత",
      timeLabel: "ప్రశ్నకు సమయం",
      unlimitedTime: "అపరిమితం",
      continueCta: "కొనసాగించు",
      exitCta: "నిష్క్రమించి పొందుపరచబడిన మన్నా తీసుకోండి",
    },
    results: {
      won: "మీరు గెలిచారు!",
      gameOver: "ఆట ముగిసింది",
      exited: "మన్నా సురక్షితం చేసారు!",
      finalAmount: "మీ మన్నా",
      correctCount: "సరైన సమాధానాలు",
      playAgain: "మళ్ళీ ఆడండి",
      home: "హోమ్",
    },
  },
  en: {
    appTitle: "FaithQuest",
    home: {
      subtitle: "The Bible Quiz Show",
      start: "Start",
      language: "Language",
    },
    playerSetup: {
      title: "What's your name?",
      placeholder: "Type your name",
      cta: "Continue",
    },
    ladder: {
      title: "Are you ready to play?",
      cta: "Start!",
      howToPlayTitle: "How to Play",
      howToPlay: [
        "Answer 15 questions correctly to win the top prize.",
        "Each question has a time limit based on its difficulty.",
        "Use 3 lifelines if you're stuck — Wisdom Split, Wise Counsel, Grace Guess.",
        "Questions 5 and 10 are safe checkpoints: reach them and you can bank your winnings or keep playing.",
        "A wrong answer sends you back to your last safe checkpoint.",
      ],
    },
    preQuestion: {
      questionLabel: "Question",
      of: "of",
      earnedSoFar: "Manna earned so far",
      complete: "complete",
      cta: "Let's play!",
    },
    question: {
      pause: "Pause",
      resume: "Resume",
      timeUp: "Time's up!",
      quit: "Quit",
      confirmQuitTitle: "Quit the quiz?",
      confirmQuitYes: "Yes, quit",
      confirmQuitNo: "No, keep playing",
    },
    lifelines: {
      title: "Lifelines",
      close: "Close",
      fiftyFifty: "Wisdom Split",
      askAudience: "Wise Counsel",
      graceGuess: "Grace Guess",
      graceGuessTryAgain: "Not quite... try again!",
    },
    audience: {
      title: "Audience Poll",
      close: "Close",
    },
    milestone: {
      title: "Checkpoint Reached!",
      lockedInLabel: "Your winnings are locked in:",
      ruleChangeIntro: "Coming up next:",
      difficultyLabel: "Difficulty",
      timeLabel: "Time per question",
      unlimitedTime: "Unlimited",
      continueCta: "Continue Playing",
      exitCta: "Exit & Bank Winnings",
    },
    results: {
      won: "You Won!",
      gameOver: "Game Over",
      exited: "Winnings Banked!",
      finalAmount: "Your Manna",
      correctCount: "Correct answers",
      playAgain: "Play Again",
      home: "Home",
    },
  },
  kn: {
    appTitle: "ಫೇಯ್ತ್ ಕ್ವೆಸ್ಟ್",
    home: {
      subtitle: "ಬೈಬಲ್ ಕ್ವಿಜ್",
      start: "ಪ್ರಾರಂಭಿಸಿ",
      language: "ಭಾಷೆ",
    },
    playerSetup: {
      title: "ನಿಮ್ಮ ಹೆಸರೇನು?",
      placeholder: "ನಿಮ್ಮ ಹೆಸರನ್ನು ಟೈಪ್ ಮಾಡಿ",
      cta: "ಮುಂದುವರಿಸಿ",
    },
    ladder: {
      title: "ಆಡಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
      cta: "ಪ್ರಾರಂಭ!",
      howToPlayTitle: "ಹೇಗೆ ಆಡುವುದು",
      howToPlay: [
        "ಅತ್ಯುನ್ನತ ಬಹುಮಾನ ಗೆಲ್ಲಲು 15 ಪ್ರಶ್ನೆಗಳಿಗೆ ಸರಿಯಾಗಿ ಉತ್ತರಿಸಿ.",
        "ಪ್ರತಿ ಪ್ರಶ್ನೆಗೆ ಅದರ ಕಠಿಣತೆಗೆ ಅನುಗುಣವಾಗಿ ಸಮಯ ಮಿತಿ ಇರುತ್ತದೆ.",
        "ಸಿಲುಕಿದಾಗ 3 ಲೈಫ್‌ಲೈನ್‌ಗಳನ್ನು ಬಳಸಿ — Wisdom Split, Wise Counsel, Grace Guess.",
        "ಪ್ರಶ್ನೆ 5 ಮತ್ತು 10 ಸುರಕ್ಷಿತ ಚೆಕ್‌ಪಾಯಿಂಟ್‌ಗಳು: ಅಲ್ಲಿಗೆ ತಲುಪಿದರೆ ನಿಮ್ಮ ಮನ್ನಾವನ್ನು ಸುರಕ್ಷಿತಗೊಳಿಸಬಹುದು ಅಥವಾ ಮುಂದುವರಿಸಬಹುದು.",
        "ತಪ್ಪು ಉತ್ತರ ನಿಮ್ಮನ್ನು ಕೊನೆಯ ಸುರಕ್ಷಿತ ಚೆಕ್‌ಪಾಯಿಂಟ್‌ಗೆ ಹಿಂತಿರುಗಿಸುತ್ತದೆ.",
      ],
    },
    preQuestion: {
      questionLabel: "ಪ್ರಶ್ನೆ",
      of: "ರಲ್ಲಿ",
      earnedSoFar: "ಇಲ್ಲಿಯವರೆಗೆ ಮನ್ನಾ",
      complete: "ಪೂರ್ಣಗೊಂಡಿದೆ",
      cta: "ಆಡೋಣ!",
    },
    question: {
      pause: "ವಿರಾಮ",
      resume: "ಮುಂದುವರಿಸಿ",
      timeUp: "ಸಮಯ ಮುಗಿದಿದೆ!",
      quit: "ನಿರ್ಗಮಿಸಿ",
      confirmQuitTitle: "ಕ್ವಿಜ್‌ನಿಂದ ನಿರ್ಗಮಿಸಬೇಕೆ?",
      confirmQuitYes: "ಹೌದು, ನಿರ್ಗಮಿಸಿ",
      confirmQuitNo: "ಇಲ್ಲ, ಮುಂದುವರಿಸಿ",
    },
    lifelines: {
      title: "ಲೈಫ್‌ಲೈನ್‌ಗಳು",
      close: "ಮುಚ್ಚಿ",
      fiftyFifty: "Wisdom Split",
      askAudience: "Wise Counsel",
      graceGuess: "Grace Guess",
      graceGuessTryAgain: "ಸರಿಯಿಲ್ಲ... ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ!",
    },
    audience: {
      title: "ಪ್ರೇಕ್ಷಕರ ಅಭಿಪ್ರಾಯ",
      close: "ಮುಚ್ಚಿ",
    },
    milestone: {
      title: "ಮೈಲಿಗಲ್ಲು ತಲುಪಿದ್ದೀರಿ!",
      lockedInLabel: "ನಿಮ್ಮ ಗೆಲುವಿನ ಮನ್ನಾ ಲಾಕ್ ಆಗಿದೆ:",
      ruleChangeIntro: "ಮುಂದಿನ ಸುತ್ತು:",
      difficultyLabel: "ಕಠಿಣತೆ",
      timeLabel: "ಪ್ರತಿ ಪ್ರಶ್ನೆಗೆ ಸಮಯ",
      unlimitedTime: "ಅಪರಿಮಿತ",
      continueCta: "ಮುಂದುವರಿಸಿ",
      exitCta: "ನಿರ್ಗಮಿಸಿ ಮತ್ತು ಮನ್ನಾ ಪಡೆಯಿರಿ",
    },
    results: {
      won: "ನೀವು ಗೆದ್ದಿದ್ದೀರಿ!",
      gameOver: "ಆಟ ಮುಗಿದಿದೆ",
      exited: "ಮನ್ನಾ ಸುರಕ್ಷಿತವಾಗಿದೆ!",
      finalAmount: "ನಿಮ್ಮ ಮನ್ನಾ",
      correctCount: "ಸರಿಯಾದ ಉತ್ತರಗಳು",
      playAgain: "ಮತ್ತೆ ಆಡಿ",
      home: "ಮುಖಪುಟ",
    },
  },
};
