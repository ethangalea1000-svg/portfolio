(() => {
  /*
   * EmotionLexicon v1
   * Analyse locale de texte français, sans IA ni API.
   * Le fichier contient :
   * - émotions et polarités
   * - mots d'intensité
   * - atténuateurs
   * - négations
   * - expressions multi-mots
   * - connecteurs de contraste
   * - règles de contexte et de portée de négation
   */

  const EMOTIONS = {
    joy: [
      "joie","joyeux","joyeuse","heureux","heureuse","bonheur","content","contente",
      "satisfait","satisfaite","ravi","ravie","enchanté","enchantée","amusé","amusée",
      "épanoui","épanouie","gai","gaie","souriant","souriante"
    ],
    admiration: [
      "admirable","admiration","magnifique","superbe","incroyable","impressionnant",
      "impressionnante","exceptionnel","exceptionnelle","extraordinaire","bravo",
      "félicitations","felicitation","félicite","féliciter","stylé","stylée","classe",
      "excellent","excellente","parfait","parfaite","génial","géniale","genial"
    ],
    gratitude: [
      "merci","remerciement","reconnaissant","reconnaissante","gratitude",
      "apprécié","appréciée","apprecie","apprécier"
    ],
    amusement: [
      "drôle","drole","marrant","marrante","amusant","amusante","humour","mdr","mdrr",
      "lol","haha","hihi","ahah","rigolo","rigolote","mort de rire","fou rire"
    ],
    love: [
      "amour","aime","aimer","adore","adorer","affection","tendresse","adorable",
      "adoré","adorée","coeur","cœur","sympa","sympathique","chaleureux","chaleureuse"
    ],
    excitement: [
      "enthousiasme","enthousiaste","excité","excitée","impatient","impatiente",
      "hâte","trop bien","ouf","énorme","enorme","🔥","🎉","👏","😍"
    ],
    optimism: [
      "espoir","espère","espere","optimiste","positif","positive","prometteur",
      "prometteuse","encourageant","encourageante","confiant","confiante","possible",
      "progression","progrès","progres","amélioration","amelioration"
    ],
    relief: [
      "soulagement","soulagé","soulagee","rassuré","rassurée","rassurant",
      "rassurante","ouf","enfin","tranquille","serein","sereine"
    ],
    anger: [
      "colère","colere","énervé","enerve","énervée","enervee","furieux","furieuse",
      "rage","rager","agacé","agace","agacée","agacee","irrité","irrite","irritée",
      "irritee","fâché","fache","fâchée","fachee","scandale","inadmissible",
      "révoltant","revoltant","révolte","revolte","haine","déteste","deteste",
      "détester","detester","🤬","😡","😠"
    ],
    sadness: [
      "triste","tristesse","malheureux","malheureuse","déprimé","deprime",
      "déprimée","deprimee","pleurer","pleure","larmes","déçu","decu","déçue",
      "decue","déception","deception","désespoir","desespoir","dégoûté","degoute",
      "😢","😭","😞","😔","💔"
    ],
    disappointment: [
      "déception","deception","décevant","decevant","décevante","decevante",
      "dommage","bof","moyen","moyenne","pas terrible","décevra","déçu","decu",
      "raté","rate","ratée","ratee","regret","regrettable","déplorable","deplorable"
    ],
    fear: [
      "peur","effrayé","effraye","effrayée","effrayee","angoisse","angoissé",
      "angoisse","inquiet","inquiète","inquiete","panique","paniqué","paniquee",
      "stressé","stresse","terrifiant","terrifiant","terrible","crainte","craindre",
      "😨","😰","😱"
    ],
    disgust: [
      "dégoût","degout","dégoûtant","degoutant","dégoûtante","degoutante",
      "écœurant","ecoeurant","répugnant","repugnant","sale","beurk","détestable",
      "horrible","🤢","🤮"
    ],
    frustration: [
      "frustrant","frustré","frustre","frustrée","frustree","pénible","penible",
      "galère","galere","compliqué","complique","bloqué","bloque","bloquée","bloquee",
      "ennuyant","ennuyeux","ennuyeuse","chiant","chiante","relou","marre",
      "ras le bol","ça suffit","ca suffit"
    ],
    confusion: [
      "confus","confuse","confusion","incompréhensible","incomprehensible",
      "incompréhensible","bizarre","étrange","etrange","perdu","perdue","je comprends pas",
      "je ne comprends pas","je comprends rien","je ne comprends rien","??","???"
    ],
    boredom: [
      "ennui","ennuyeux","ennuyeuse","ennuyant","ennuyante","lassant","lassante",
      "fatigant","fatigante","monotone","ennuyé","ennuyee"
    ]
  };

  const EXTRA_POSITIVE = [
    "top","cool","super","génial","genial","nickel","excellent","parfait","parfaite",
    "bien","très bien","tres bien","très bon","tres bon","bonne","bon","réussi",
    "reussi","utile","clair","claire","propre","rapide","fluide","facile","simple",
    "j'adore","jadore","j'aime","jaime","bravo","merci","fort","forte","wow","waouh",
    "waou","yes","yesss","yeah","😍","❤️","💙","💚","👍","✨","🔥"
  ];

  const EXTRA_NEGATIVE = [
    "nul","nulle","nuls","nulles","zéro","zero","mauvais","mauvaise","mauvais",
    "horrible","catastrophique","cassé","casse","cassée","cassee","bug","bugs",
    "erreur","erreurs","problème","probleme","problèmes","problemes","lent","lente",
    "inutile","moche","moisi","raté","rate","ratee","décevant","decevant","dommage",
    "pourri","pourrie","honteux","honteuse","faux","fausse","incorrect","incorrecte",
    "impossible","pire","nul !","bof","😡","😠","😢","😭","🤬","👎","💔"
  ];

  const PHRASES = {
    positive: {
      "pas mal": 1.10,
      "pas mauvais": 0.95,
      "pas mauvaise": 0.95,
      "pas nul": 0.80,
      "pas nulle": 0.80,
      "sans problème": 0.70,
      "sans probleme": 0.70,
      "aucun problème": 0.65,
      "aucun probleme": 0.65,
      "aucune erreur": 0.55,
      "rien à redire": 0.85,
      "rien a redire": 0.85,
      "je recommande": 1.15,
      "je recommande vraiment": 1.35,
      "j'adore": 1.35,
      "j aime": 1.15,
      "ça fonctionne": 0.65,
      "ca fonctionne": 0.65,
      "ça marche": 0.65,
      "ca marche": 0.65,
      "très bien": 1.00,
      "tres bien": 1.00,
      "super bien": 1.20,
      "trop bien": 1.25,
      "vraiment bien": 1.15,
      "franchement bien": 1.10,
      "merci beaucoup": 1.20,
      "bravo pour": 1.10
    },
    negative: {
      "pas bien": -0.90,
      "pas bon": -0.75,
      "pas bonne": -0.75,
      "pas top": -0.75,
      "pas génial": -0.70,
      "pas genial": -0.70,
      "pas super": -0.65,
      "pas terrible": -0.75,
      "pas du tout": -0.60,
      "vraiment mauvais": -1.30,
      "très mauvais": -1.20,
      "tres mauvais": -1.20,
      "très nul": -1.45,
      "tres nul": -1.45,
      "complètement nul": -1.55,
      "completement nul": -1.55,
      "vraiment nul": -1.40,
      "aucun intérêt": -0.85,
      "aucun interet": -0.85,
      "aucune utilité": -0.75,
      "aucune utilite": -0.75,
      "ça ne marche pas": -1.05,
      "ca ne marche pas": -1.05,
      "ça ne fonctionne pas": -1.05,
      "ca ne fonctionne pas": -1.05,
      "je déteste": -1.35,
      "je deteste": -1.35,
      "je regrette": -0.85,
      "gros problème": -1.15,
      "gros probleme": -1.15,
      "plein de problèmes": -1.20,
      "plein de problemes": -1.20
    }
  };

  const NEGATIONS = new Set([
    "ne","n","pas","jamais","aucun","aucune","aucuns","aucunes","sans",
    "nullement","guère","guere","personne","rien","ni","point","plus",
    "peu","rarement"
  ]);

  const NEGATION_EXCEPTIONS = new Set([
    "pas mal","pas mauvais","pas mauvaise","pas nul","pas nulle",
    "pas terrible","pas trop","pas vraiment"
  ]);

  const INTENSIFIERS = {
    "très":1.60,"tres":1.60,"vraiment":1.45,"extrêmement":1.85,"extremement":1.85,
    "absolument":1.70,"complètement":1.75,"completement":1.75,"totalement":1.70,
    "super":1.45,"trop":1.35,"ultra":1.65,"grave":1.30,"particulièrement":1.35,
    "particulierement":1.35,"énormément":1.55,"enormement":1.55,"tellement":1.45,
    "franchement":1.15,"clairement":1.15,"vraiment":1.45
  };

  const DIMINISHERS = {
    "un peu":0.55,"un peu de":0.55,"assez":0.70,"plutôt":0.78,"plutot":0.78,
    "presque":0.65,"légèrement":0.55,"legerement":0.55,"à peine":0.45,"a peine":0.45,
    "bof":0.55,"relativement":0.75,"quelque peu":0.60
  };

  const CONTRAST_WORDS = [
    "mais","cependant","pourtant","toutefois","par contre","en revanche",
    "néanmoins","neanmoins","quoique","même si","meme si"
  ];

  const NEGATION_WINDOW = 4;
  const INTENSITY_WINDOW = 2;

  const normalize = text => String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2019']/g, "'")
    .replace(/[^\p{L}\p{N}\s!?.,;:'’🔥✨❤️💙💚👍👎😡😠😢😭😊😍🤬🤢🤮😨😰😱👏🎉]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  const tokenize = text => normalize(text).split(" ").filter(Boolean);

  function hasPhrase(text, phrase) {
    return text.includes(normalize(phrase));
  }

  function isNegated(tokens, index) {
    const start = Math.max(0, index - NEGATION_WINDOW);
    const previous = tokens.slice(start, index);

    const joined = previous.join(" ");
    for (const exception of NEGATION_EXCEPTIONS) {
      if (joined.endsWith(normalize(exception))) return false;
    }

    const lastNegation = previous.map((token, i) => ({token, i}))
      .filter(item => NEGATIONS.has(item.token))
      .pop();

    if (!lastNegation) return false;

    // "ne ... mais" / "ne ... cependant" coupe la portée.
    const afterNegation = previous.slice(lastNegation.i + 1);
    if (afterNegation.some(t => CONTRAST_WORDS.includes(t))) return false;

    return true;
  }

  function multiplierFromContext(tokens, index) {
    let multiplier = 1;
    const start = Math.max(0, index - INTENSITY_WINDOW);
    const previous = tokens.slice(start, index).join(" ");

    for (const [phrase, factor] of Object.entries(INTENSIFIERS)) {
      if (previous.includes(normalize(phrase))) multiplier = Math.max(multiplier, factor);
    }

    for (const [phrase, factor] of Object.entries(DIMINISHERS)) {
      if (previous.includes(normalize(phrase))) multiplier = Math.min(multiplier, factor);
    }

    return multiplier;
  }

  function contrastWeight(text, sentenceIndex) {
    const sentences = text.split(/(?<=[.!?])/u);
    if (sentences.length < 2) return 1;

    const current = sentences[sentenceIndex] || "";
    const hasContrast = CONTRAST_WORDS.some(word => current.includes(normalize(word)));
    return hasContrast || sentenceIndex > 0 ? 1.18 : 0.82;
  }

  function addEmotion(map, emotion, value) {
    map[emotion] = (map[emotion] || 0) + value;
  }

  function scoreWordList(text, tokens, list, baseScore, emotion, emotions, matched) {
    for (const word of list) {
      const normalWord = normalize(word);
      if (!normalWord || normalWord.includes(" ")) continue;

      tokens.forEach((token, index) => {
        if (token !== normalWord) return;

        let score = baseScore;
        const negated = isNegated(tokens, index);

        if (negated) {
          score = score > 0 ? -Math.max(0.82, score * 0.95) : Math.abs(score) * 0.82;
        }

        score *= multiplierFromContext(tokens, index);

        addEmotion(emotions, emotion, score);
        matched.push({word: normalWord, emotion, score, negated});
      });
    }
  }

  function analyzeText(input) {
    const original = String(input || "");
    const text = normalize(original);
    const tokens = tokenize(original);

    if (!text) {
      return {
        polarity: 0,
        mood: "neutral",
        dominantEmotion: "neutral",
        confidence: 0,
        score: 0,
        matched: [],
        original
      };
    }

    const emotions = {};
    const matched = [];
    let score = 0;

    // Expressions multi-mots : elles passent avant les mots isolés.
    for (const [phrase, value] of Object.entries(PHRASES.positive)) {
      const p = normalize(phrase);
      if (text.includes(p)) {
        score += value;
        addEmotion(emotions, value > 0 ? "positive" : "disappointment", Math.abs(value));
        matched.push({phrase, score:value, negated:false, source:"phrase"});
      }
    }

    for (const [phrase, value] of Object.entries(PHRASES.negative)) {
      const p = normalize(phrase);
      if (text.includes(p)) {
        score += value;
        addEmotion(emotions, "negative", Math.abs(value));
        matched.push({phrase, score:value, negated:false, source:"phrase"});
      }
    }

    // Mots positifs / négatifs généraux.
    for (const word of EXTRA_POSITIVE) {
      const w = normalize(word);
      if (!w || w.includes(" ")) continue;

      tokens.forEach((token, index) => {
        if (token !== w) return;

        let local = 0.85;
        if (isNegated(tokens, index)) local = -0.65;
        local *= multiplierFromContext(tokens, index);

        score += local;
        matched.push({word:w, score:local, negated:isNegated(tokens,index), source:"positive"});
      });
    }

    for (const word of EXTRA_NEGATIVE) {
      const w = normalize(word);
      if (!w || w.includes(" ")) continue;

      tokens.forEach((token, index) => {
        if (token !== w) return;

        let local = -0.95;
        if (isNegated(tokens, index)) local = 0.62;
        local *= multiplierFromContext(tokens, index);

        score += local;
        matched.push({word:w, score:local, negated:isNegated(tokens,index), source:"negative"});
      });
    }

    // Emotions fines.
    const emotionScores = {
      joy:0, admiration:0, gratitude:0, amusement:0, love:0, excitement:0,
      optimism:0, relief:0, anger:0, sadness:0, disappointment:0, fear:0,
      disgust:0, frustration:0, confusion:0, boredom:0
    };

    const positiveEmotions = new Set(["joy","admiration","gratitude","amusement","love","excitement","optimism","relief"]);
    const negativeEmotions = new Set(["anger","sadness","disappointment","fear","disgust","frustration","confusion","boredom"]);

    Object.entries(EMOTIONS).forEach(([emotion, words]) => {
      words.forEach(word => {
        const normalWord = normalize(word);
        if (!normalWord || normalWord.includes(" ")) return;

        tokens.forEach((token, index) => {
          if (token !== normalWord) return;

          let value = positiveEmotions.has(emotion) ? 0.80 : -0.82;
          const negated = isNegated(tokens, index);

          if (negated) value = value > 0 ? -0.88 : 0.72;
          value *= multiplierFromContext(tokens, index);

          addEmotion(emotionScores, emotion, value);
          score += value * 0.45;
          matched.push({word:normalWord, emotion, score:value, negated, source:"emotion"});
        });
      });
    });

    // Phrases ultra-explicites : priorité forte.
    const explicitNegative = [
      "tout sauf bien","tout sauf bon","tout sauf genial","tout sauf génial",
      "complètement nul","completement nul","vraiment nul","c'est nul",
      "c est nul","c'est mauvais","c est mauvais","je deteste","je déteste"
    ];
    const explicitPositive = [
      "tout sauf mauvais","tout sauf nul","c'est génial","c est genial",
      "c'est parfait","c est parfait","je recommande","j'adore","j'aime"
    ];

    explicitNegative.forEach(phrase => {
      if (hasPhrase(text, phrase)) {
        score -= 2.0;
        addEmotion(emotionScores, "anger", 1.4);
        addEmotion(emotionScores, "disappointment", 1.2);
        matched.push({phrase, score:-2, source:"explicit"});
      }
    });

    explicitPositive.forEach(phrase => {
      if (hasPhrase(text, phrase)) {
        score += 2.0;
        addEmotion(emotionScores, "joy", 1.4);
        addEmotion(emotionScores, "admiration", 1.1);
        matched.push({phrase, score:2, source:"explicit"});
      }
    });

    // Contraste : la seconde partie compte davantage.
    const lowerText = text;
    const contrastPositions = CONTRAST_WORDS
      .map(word => lowerText.indexOf(normalize(word)))
      .filter(position => position >= 0);

    if (contrastPositions.length) {
      const pivot = Math.min(...contrastPositions);
      const before = lowerText.slice(0, pivot);
      const after = lowerText.slice(pivot);

      const beforeResult = before === text ? 0 : analyzeSimple(before);
      const afterResult = analyzeSimple(after);

      score = (beforeResult * 0.55) + (afterResult * 1.35);
    }

    const capsCount = (original.match(/\b[A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸ][A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸ!-]{2,}\b/g) || []).length;
    if (capsCount > 0) score *= 1.08;

    const exclamations = (original.match(/!/g) || []).length;
    if (exclamations >= 2) score *= 1.08;

    const maxAbs = Math.max(...Object.values(emotionScores).map(v => Math.abs(v)), 0);
    let dominant = Object.entries(emotionScores)
      .sort((a,b) => Math.abs(b[1]) - Math.abs(a[1]))[0];

    if (!maxAbs || Math.abs(score) < 0.05) {
      dominant = ["neutral", 0];
    } else if (Math.abs(dominant?.[1] || 0) < 0.08) {
      dominant = [score > 0 ? "positive" : score < 0 ? "negative" : "neutral", score];
    }

    const confidence = Math.min(1, Math.abs(score) / 3 + maxAbs / 5);

    let mood = "neutral";
    if (score >= 0.55) mood = "positive";
    if (score <= -0.55) mood = "negative";

    return {
      polarity: score,
      score,
      mood,
      dominantEmotion: dominant ? dominant[0] : "neutral",
      confidence: Number(confidence.toFixed(3)),
      matched: matched.slice(0, 40),
      original
    };
  }

  function analyzeSimple(text) {
    const tokens = tokenize(text);
    let score = 0;

    tokens.forEach((token, index) => {
      if (EXTRA_POSITIVE.some(w => normalize(w) === token)) {
        score += isNegated(tokens,index) ? -0.65 : 0.85;
      }
      if (EXTRA_NEGATIVE.some(w => normalize(w) === token)) {
        score += isNegated(tokens,index) ? 0.62 : -0.95;
      }
    });

    return score;
  }

  function analyzeMany(comments) {
    const recent = comments
      .slice(0, 10)
      .map((comment, index) => ({
        ...analyzeText(comment?.body || ""),
        weight: Math.max(0.45, 1 - index * 0.07)
      }));

    const usable = recent.filter(item => item.original.trim());
    if (!usable.length) {
      return {
        mood:"neutral",
        score:0,
        confidence:0,
        dominantEmotion:"neutral",
        analyzed:0,
        results:[]
      };
    }

    const weighted = usable.reduce((sum,item) => sum + item.score * item.weight, 0);
    const totalWeight = usable.reduce((sum,item) => sum + item.weight, 0);
    const score = weighted / totalWeight;

    let mood = "neutral";
    if (score >= 0.55) mood = "positive";
    else if (score <= -0.55) mood = "negative";

    const emotionTotals = {};
    usable.forEach(item => {
      emotionTotals[item.dominantEmotion] =
        (emotionTotals[item.dominantEmotion] || 0) + Math.max(0.1, item.confidence) * item.weight;
    });

    const dominantEmotion =
      Object.entries(emotionTotals).sort((a,b) => b[1] - a[1])[0]?.[0] || "neutral";

    const confidence =
      usable.reduce((sum,item) => sum + item.confidence * item.weight, 0) / totalWeight;

    return {
      mood,
      score:Number(score.toFixed(3)),
      confidence:Number(confidence.toFixed(3)),
      dominantEmotion,
      analyzed:usable.length,
      results:recent
    };
  }

  window.EmotionLexicon = {
    analyzeText,
    analyzeMany,
    lexicon: {
      emotions: EMOTIONS,
      positive: EXTRA_POSITIVE,
      negative: EXTRA_NEGATIVE,
      phrases: PHRASES,
      negations: Array.from(NEGATIONS),
      intensifiers: INTENSIFIERS,
      diminishers: DIMINISHERS,
      contrast: CONTRAST_WORDS
    }
  };
})();