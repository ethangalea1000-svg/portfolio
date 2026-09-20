(() => {
  /*
   * EmotionLexicon v2
   * Analyse locale de texte français, sans IA ni API.
   * Le fichier contient :
   * - un lexique FEEL chargé depuis une ressource publique
   * - un moteur local de secours
   * - négations, intensificateurs, atténuateurs et contrastes
   * - analyse par mot, expression et contexte
   * - agrégation des commentaires avec pondération temporelle
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
    ],
    jealousy: [
      "jalousie","jaloux","jalouse","envieux","envieuse","envier",
      "envies","jalousement","jaloux de","jalouse de","je suis jaloux",
      "je suis jalouse","ça me rend jaloux","ca me rend jaloux",
      "ça me rend jalouse","ca me rend jalouse"
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


  const FEEL_URLS = [
    "https://raw.githubusercontent.com/sborms/sentometrics/master/data-raw/lexicons-raw/FEEL_raw.csv",
    "https://raw.githubusercontent.com/sborms/sentometrics/main/data-raw/lexicons-raw/FEEL_raw.csv"
  ];

  const MORE_POSITIVE = [
    "agréable","agreable","amical","amicale","amitié","amitie","apprécier","apprecier",
    "appréciation","appreciation","bienveillant","bienveillante","brillant","brillante",
    "chance","chanceux","chanceuse","confiance","courage","courtois","courtoise","délicieux",
    "delicieux","douceur","émerveillé","emerveille","émerveillée","emerveillee","enthousiasmant",
    "excellent","excellente","fierté","fierte","fier","fière","fiere","formidable","généreux",
    "genereux","généreuse","genereuse","gagnant","gagnante","génialement","genialement","grâce",
    "grace","heureux","heureuse","honneur","joie","joli","jolie","liberté","liberte","magnifique",
    "merveilleux","merveilleuse","optimisme","paix","plaisir","positivement","réussite","reussite",
    "respect","respectueux","respectueuse","sécurité","securite","satisfaisant","satisfaite",
    "sincère","sincere","sourire","succès","succes","sublime","sympa","sympathique","tendre",
    "triomphe","triomphant","triomphante","utile","valorisant","valorisante","victoire","vivant",
    "vivante","volontaire","zen","bien joué","bien joue","bonne idée","bonne idee","bonne nouvelle",
    "c'est bien","c est bien","c'est super","c est super","c'est cool","c est cool"
  ];

  const MORE_NEGATIVE = [
    "absurde","agressif","agressive","agression","amer","amère","amere","anxieux","anxieuse",
    "appréhension","apprehension","atroce","autoritaire","blessant","blessante","brusque",
    "colérique","colerique","cruel","cruelle","culpabilité","culpabilite","danger","dangereux",
    "dangereuse","désastre","desastre","désastreux","desastreux","doute","douteux","douteuse",
    "échec","echec","énerver","enerver","épuisé","epuise","épuisée","epuisee","froid","froide",
    "frayeur","haineux","haineuse","hésitation","hesitation","humiliant","humiliante","honte",
    "hostile","inacceptable","indifférent","indifferente","injustice","insupportable","irrespect",
    "jaloux","jalouse","méchant","mechant","méchante","mechante","mensonge","menteur","menteuse",
    "menace","menaçant","menacant","misérable","miserable","panique","pessimiste","plainte",
    "pleurnicher","regretter","ridicule","risque","sarcastique","sarcasme","souffrance","tension",
    "terrifié","terrifiée","terrifiant","toxique","trahison","traître","traitre","violent",
    "violente","vulgaire","problématique","problematique","déconseillé","deconseille","négatif",
    "negative","mauvaisement","ça craint","ca craint","ça m'énerve","ça m enerve","ça m'enerve",
    "ras le bol","ras-le-bol","marre de","j'en ai marre","j en ai marre"
  ];

  const MORE_PHRASES = {
    "tout va bien": 1.15,
    "tout est bien": 1.0,
    "je suis content": 1.15,
    "je suis contente": 1.15,
    "je suis ravi": 1.25,
    "je suis ravie": 1.25,
    "je suis heureux": 1.25,
    "je suis heureuse": 1.25,
    "j'ai adoré": 1.35,
    "j ai adore": 1.35,
    "j'ai adoré ça": 1.45,
    "j ai adore ca": 1.45,
    "ça me plaît": 1.05,
    "ca me plait": 1.05,
    "ça me fait plaisir": 1.20,
    "ca me fait plaisir": 1.20,
    "bonne surprise": 1.15,
    "super idée": 1.20,
    "super idee": 1.20,
    "très bonne idée": 1.45,
    "tres bonne idee": 1.45,
    "je suis déçu": -1.15,
    "je suis decu": -1.15,
    "je suis déçue": -1.15,
    "je suis decue": -1.15,
    "je suis énervé": -1.25,
    "je suis enerve": -1.25,
    "je suis énervée": -1.25,
    "je suis enervee": -1.25,
    "je suis inquiet": -1.10,
    "je suis inquiète": -1.10,
    "je suis inquiete": -1.10,
    "ça m'inquiète": -1.15,
    "ca m inquiete": -1.15,
    "ça me déçoit": -1.20,
    "ca me decoit": -1.20,
    "ça me déprime": -1.30,
    "ca me deprime": -1.30,
    "ça m'énerve": -1.25,
    "ca m enerve": -1.25,
    "ça m'énerve beaucoup": -1.55,
    "ca m enerve beaucoup": -1.55,
    "c'est une catastrophe": -1.60,
    "c est une catastrophe": -1.60,
    "c'est vraiment nul": -1.65,
    "c est vraiment nul": -1.65,
    "ça ne sert à rien": -1.10,
    "ca ne sert a rien": -1.10,
    "ça sert à rien": -1.10,
    "ca sert a rien": -1.10,
    "aucun souci": 0.80,
    "aucun soucis": 0.80,
    "pas de souci": 0.80,
    "pas de soucis": 0.80,
    "ce n'est pas nul": 0.95,
    "ce n est pas nul": 0.95,
    "ce n'est pas mauvais": 0.90,
    "ce n est pas mauvais": 0.90,
    "je ne déteste pas": 0.90,
    "je ne deteste pas": 0.90,
    "je ne suis pas content": -1.00,
    "je ne suis pas contente": -1.00,
    "je ne suis pas heureux": -1.00,
    "je ne suis pas heureuse": -1.00
  };

  MORE_POSITIVE.forEach(word => EMOTIONS.optimism.push(word));
  MORE_NEGATIVE.forEach(word => EMOTIONS.frustration.push(word));

  const FEEL_LEXICON = new Map();
  const FEEL_PHRASES = [];
  let FEEL_STATE = "fallback";
  let FEEL_COUNT = 0;
  let FEEL_ERROR = "";

  const EMOTION_HEADERS = {
    joy: ["joy", "joie"],
    surprise: ["surprise"],
    anger: ["anger", "colere", "colère"],
    disgust: ["disgust", "degout", "dégoût"],
    sadness: ["sadness", "tristesse"],
    fear: ["fear", "peur"]
  };

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, " ")
      .replace(/[\u2010-\u2015]/g, "-")
      .replace(/[^\p{L}\p{N}\s!?.,;:💙💚❤️🔥✨👍👎😡😠😢😭😊😍🤬🤢🤮😨😰😱👏🎉]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenize(text) {
    return normalize(text).split(" ").filter(Boolean);
  }

  function parseSemicolonCSV(csv) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let i = 0; i < csv.length; i++) {
      const ch = csv[i];

      if (ch === '"') {
        if (quoted && csv[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          quoted = !quoted;
        }
        continue;
      }

      if (ch === ";" && !quoted) {
        row.push(cell);
        cell = "";
        continue;
      }

      if ((ch === "\n" || ch === "\r") && !quoted) {
        if (ch === "\r" && csv[i + 1] === "\n") i++;
        row.push(cell);
        if (row.some(value => String(value).trim() !== "")) rows.push(row);
        row = [];
        cell = "";
        continue;
      }

      cell += ch;
    }

    row.push(cell);
    if (row.some(value => String(value).trim() !== "")) rows.push(row);

    return rows;
  }

  function parseNumber(value) {
    const n = Number(String(value || "").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }

  function headerIndex(header, names) {
    const wanted = names.map(name => normalize(name).replace(/ /g, ""));
    return header.findIndex(cell => {
      const key = normalize(cell).replace(/ /g, "");
      return wanted.includes(key);
    });
  }

  function addFeelEntry(word, polarity, emotionNames) {
    const clean = normalize(word);
    if (!clean) return;

    const target = {
      polarity: polarity > 0 ? 1 : -1,
      emotions: new Set(emotionNames)
    };

    const existing = FEEL_LEXICON.get(clean);
    if (!existing) {
      FEEL_LEXICON.set(clean, target);
    } else {
      if (existing.polarity !== target.polarity) {
        existing.polarity = 0;
      }
      target.emotions.forEach(emotion => existing.emotions.add(emotion));
    }

    if (clean.includes(" ")) {
      FEEL_PHRASES.push([clean, target]);
    }
  }

  async function fetchWithTimeout(url, ms = 7000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);

    try {
      const response = await fetch(url, {
        headers: { "Accept": "text/csv,text/plain;q=0.9,*/*;q=0.8" },
        cache: "no-store",
        signal: controller.signal
      });

      if (!response.ok) throw new Error("HTTP " + response.status);
      return await response.text();
    } finally {
      clearTimeout(timer);
    }
  }

  async function loadFeelLexicon() {
    FEEL_STATE = "loading";

    for (const url of FEEL_URLS) {
      try {
        const csv = await fetchWithTimeout(url);
        const rows = parseSemicolonCSV(csv);
        if (rows.length < 2) throw new Error("CSV vide ou incomplet");

        const header = rows[0];
        const wordIndex = headerIndex(header, ["word", "mot"]);
        const polarityIndex = headerIndex(header, ["polarity", "polarité", "polarity"]);
        if (wordIndex < 0 || polarityIndex < 0) throw new Error("Colonnes FEEL introuvables");

        const emotionIndexes = Object.entries(EMOTION_HEADERS)
          .map(([emotion, names]) => [emotion, headerIndex(header, names)])
          .filter(([, index]) => index >= 0);

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const word = row[wordIndex];
          const polarityText = normalize(row[polarityIndex]);

          let polarity = 0;
          if (polarityText === "positive" || polarityText === "positif") polarity = 1;
          if (polarityText === "negative" || polarityText === "negatif") polarity = -1;
          if (!polarity) continue;

          const emotions = emotionIndexes
            .filter(([, index]) => {
              const value = String(row[index] ?? "").trim().toLowerCase();
              return value === "1" || value === "1.0" || value === "true" || value === "oui";
            })
            .map(([emotion]) => emotion);

          addFeelEntry(word, polarity, emotions);
        }

        FEEL_COUNT = FEEL_LEXICON.size;
        if (FEEL_COUNT < 1000) throw new Error("Lexique chargé mais trop petit");

        FEEL_STATE = "ready";
        FEEL_ERROR = "";
        return true;
      } catch (error) {
        FEEL_ERROR = error?.message || "Erreur de chargement";
      }
    }

    FEEL_STATE = "fallback";
    return false;
  }

  function emotionSign(emotion) {
    return ["joy","surprise","optimism","admiration","gratitude","amusement","love","excitement","relief"]
      .includes(emotion) ? 1 : -1;
  }

  function oppositeEmotion(emotion) {
    const opposites = {
      joy: "sadness",
      sadness: "joy",
      anger: "relief",
      relief: "anger",
      fear: "confidence",
      disgust: "admiration",
      admiration: "disappointment",
      surprise: "confusion",
      confusion: "clarity",
      love: "disappointment",
      excitement: "boredom",
      boredom: "excitement",
      optimism: "disappointment",
      disappointment: "optimism",
      gratitude: "frustration",
      amusement: "sadness"
    };
    return opposites[emotion] || emotion;
  }

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

    const lastNegation = previous.map((token, i) => ({ token, i }))
      .filter(item => NEGATIONS.has(item.token))
      .pop();

    if (!lastNegation) return false;

    const afterNegation = previous.slice(lastNegation.i + 1);
    if (afterNegation.some(token => CONTRAST_WORDS.includes(token))) return false;

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

  function buildSentenceEmotionScores() {
    return {
      joy:0, admiration:0, gratitude:0, amusement:0, love:0, excitement:0,
      optimism:0, relief:0, anger:0, sadness:0, disappointment:0, fear:0,
      disgust:0, frustration:0, confusion:0, boredom:0, jealousy:0, surprise:0,
      positive:0, negative:0
    };
  }

  function addEmotion(scores, emotion, value) {
    scores[emotion] = (scores[emotion] || 0) + value;
  }

  function scorePhraseMap(text, scoreState, matched) {
    const allPhraseMaps = [PHRASES.positive, PHRASES.negative, MORE_PHRASES];

    for (const map of allPhraseMaps) {
      for (const [phrase, value] of Object.entries(map)) {
        const p = normalize(phrase);
        if (!p || !text.includes(p)) continue;

        scoreState.score += value;
        if (value >= 0) addEmotion(scoreState.emotions, "positive", value);
        else addEmotion(scoreState.emotions, "negative", Math.abs(value));

        matched.push({
          phrase,
          score: Number(value.toFixed(3)),
          source: "phrase"
        });
      }
    }

    if (FEEL_STATE === "ready") {
      for (const [phrase, entry] of FEEL_PHRASES) {
        if (!text.includes(phrase)) continue;

        const signed = entry.polarity || 0;
        if (!signed) continue;

        scoreState.score += signed * 0.85;
        addEmotion(scoreState.emotions, signed > 0 ? "positive" : "negative", 0.85);

        for (const emotion of entry.emotions) {
          const value = emotionSign(emotion) * Math.abs(signed) * 0.55;
          addEmotion(scoreState.emotions, emotion, value);
        }

        matched.push({
          phrase,
          score: Number((signed * 0.85).toFixed(3)),
          source: "FEEL"
        });
      }
    }
  }

  function scoreToken(token, index, tokens, scoreState, matched) {
    const negated = isNegated(tokens, index);
    const multiplier = multiplierFromContext(tokens, index);

    const feel = FEEL_STATE === "ready" ? FEEL_LEXICON.get(token) : null;

    if (feel && feel.polarity !== 0) {
      let signed = feel.polarity * 1.0;
      if (negated) signed *= -0.95;
      signed *= multiplier;

      scoreState.score += signed;
      addEmotion(
        scoreState.emotions,
        signed >= 0 ? "positive" : "negative",
        Math.abs(signed)
      );

      for (const emotion of feel.emotions) {
        let value = emotionSign(emotion) * (Math.abs(signed) * 0.72);
        if (negated) {
          value *= -1;
          addEmotion(scoreState.emotions, oppositeEmotion(emotion), Math.abs(value) * 0.65);
        } else {
          addEmotion(scoreState.emotions, emotion, value);
        }
      }

      matched.push({
        word: token,
        score: Number(signed.toFixed(3)),
        negated,
        source: "FEEL",
        emotions: Array.from(feel.emotions)
      });
      return;
    }

    for (const word of EXTRA_POSITIVE.concat(MORE_POSITIVE)) {
      if (normalize(word) !== token) continue;

      let signed = 0.85 * multiplier;
      if (negated) signed *= -0.80;

      scoreState.score += signed;
      addEmotion(scoreState.emotions, signed >= 0 ? "positive" : "negative", Math.abs(signed));
      matched.push({ word:token, score:Number(signed.toFixed(3)), negated, source:"local-positive" });
    }

    for (const word of EXTRA_NEGATIVE.concat(MORE_NEGATIVE)) {
      if (normalize(word) !== token) continue;

      let signed = -0.95 * multiplier;
      if (negated) signed *= -0.75;

      scoreState.score += signed;
      addEmotion(scoreState.emotions, signed >= 0 ? "positive" : "negative", Math.abs(signed));
      matched.push({ word:token, score:Number(signed.toFixed(3)), negated, source:"local-negative" });
    }

    Object.entries(EMOTIONS).forEach(([emotion, words]) => {
      if (!words.some(word => normalize(word) === token)) return;

      let value = emotionSign(emotion) * 0.78 * multiplier;
      if (negated) value *= -1;

      addEmotion(scoreState.emotions, emotion, value);
      scoreState.score += value * 0.50;
      matched.push({
        word:token,
        emotion,
        score:Number(value.toFixed(3)),
        negated,
        source:"local-emotion"
      });
    });
  }

  function sentenceScore(text) {
    const normalized = normalize(text);
    const tokens = tokenize(text);
    const scoreState = {
      score: 0,
      emotions: buildSentenceEmotionScores()
    };
    const matched = [];

    scorePhraseMap(normalized, scoreState, matched);

    tokens.forEach((token, index) => {
      scoreToken(token, index, tokens, scoreState, matched);
    });

    // Ponctuation expressive.
    const exclamations = (String(text).match(/!/g) || []).length;
    const questionMarks = (String(text).match(/\?/g) || []).length;
    if (exclamations >= 2) scoreState.score *= 1.08;
    if (questionMarks >= 2 && Math.abs(scoreState.score) < 0.8) {
      addEmotion(scoreState.emotions, "confusion", 0.45);
    }

    // Lettres en capitales : légère intensification.
    const caps = String(text).match(/\b[A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸ]{3,}\b/g) || [];
    if (caps.length) scoreState.score *= 1.08;

    return { ...scoreState, matched };
  }

  function themeForEmotion(emotion, score = 0) {
    const themeMap = {
      joy: "joy",
      love: "love",
      excitement: "excitement",
      admiration: "admiration",
      gratitude: "gratitude",
      optimism: "optimism",
      relief: "relief",
      sadness: "sadness",
      jealousy: "jealousy",
      anger: "anger",
      fear: "fear",
      disgust: "disgust",
      frustration: "frustration",
      confusion: "confusion",
      boredom: "boredom",
      disappointment: "disappointment",
      surprise: "surprise",
      positive: "positive",
      negative: "negative",
      neutral: "neutral"
    };

    return themeMap[emotion] || (score > 0 ? "positive" : score < 0 ? "negative" : "neutral");
  }

  function analyzeText(input) {
    const original = String(input || "");
    const text = normalize(original);

    if (!text) {
      return {
        polarity:0, score:0, mood:"neutral", dominantEmotion:"neutral",
        confidence:0, matched:[], original, lexiconSource:FEEL_STATE
      };
    }

    // Le contraste fait basculer le poids vers la seconde partie.
    const contrastRegex = /\bmais\b|\bcependant\b|\bpourtant\b|\btoutefois\b|\ben revanche\b|\bpar contre\b|\bnéanmoins\b/g;
    const contrastMatch = contrastRegex.exec(text);

    let core;
    if (contrastMatch) {
      const before = text.slice(0, contrastMatch.index);
      const after = text.slice(contrastMatch.index + contrastMatch[0].length);
      const a = sentenceScore(before);
      const b = sentenceScore(after);

      core = {
        score: a.score * 0.55 + b.score * 1.35,
        emotions: buildSentenceEmotionScores(),
        matched: a.matched.concat(b.matched)
      };

      Object.entries(a.emotions).forEach(([emotion, value]) => {
        core.emotions[emotion] += value * 0.55;
      });

      Object.entries(b.emotions).forEach(([emotion, value]) => {
        core.emotions[emotion] += value * 1.35;
      });
    } else {
      core = sentenceScore(original);
    }

    let polarityMood = "neutral";
    if (core.score >= 0.30) polarityMood = "positive";
    if (core.score <= -0.30) polarityMood = "negative";

    const emotionEntries = Object.entries(core.emotions)
      .filter(([emotion]) => !["positive","negative"].includes(emotion));

    let dominantEmotion = "neutral";
    if (polarityMood === "positive") {
      const ranked = emotionEntries
        .filter(([emotion]) => emotionSign(emotion) > 0)
        .sort((a,b) => Math.abs(b[1]) - Math.abs(a[1]));
      dominantEmotion = ranked[0]?.[0] || "positive";
    } else if (polarityMood === "negative") {
      const ranked = emotionEntries
        .filter(([emotion]) => emotionSign(emotion) < 0)
        .sort((a,b) => Math.abs(b[1]) - Math.abs(a[1]));
      dominantEmotion = ranked[0]?.[0] || "negative";
    }

    const maxEmotion = Math.max(
      ...emotionEntries.map(([,value]) => Math.abs(value)),
      0
    );

    const mood = themeForEmotion(dominantEmotion, core.score);

    const confidence = Math.min(
      1,
      Math.abs(core.score) / 3.5 +
      maxEmotion / 7 +
      Math.min(core.matched.length, 8) / 40
    );

    return {
      polarity:Number(core.score.toFixed(3)),
      score:Number(core.score.toFixed(3)),
      mood,
      polarityMood,
      dominantEmotion,
      confidence:Number(confidence.toFixed(3)),
      matched:core.matched.slice(0, 60),
      original,
      lexiconSource:FEEL_STATE,
      lexiconSize:FEEL_COUNT
    };
  }

  function analyzeSimple(text) {
    return sentenceScore(text).score;
  }

  function analyzeMany(comments) {
    const list = Array.isArray(comments) ? comments : [];
    const recent = list
      .filter(comment => comment && String(comment.body ?? "").trim())
      .slice(0, 10);

    if (!recent.length) {
      return {
        mood:"neutral",
        score:0,
        confidence:0,
        dominantEmotion:"neutral",
        analyzed:0,
        results:[],
        lexiconSource:FEEL_STATE,
        lexiconSize:FEEL_COUNT
      };
    }

    const results = recent.map((comment, index) => {
      const result = analyzeText(comment.body || "");
      const weight = 1 + (recent.length - index - 1) * 0.08;
      return {
        ...result,
        weight,
        author:comment.user?.login || "visiteur",
        createdAt:comment.created_at || ""
      };
    });

    const totalWeight = results.reduce((sum, item) => sum + item.weight, 0);
    const score = results.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight;

    let polarityMood = "neutral";
    if (score >= 0.40) polarityMood = "positive";
    if (score <= -0.40) polarityMood = "negative";

    const emotionTotals = {};
    results.forEach(item => {
      const emotion = item.dominantEmotion || "neutral";
      emotionTotals[emotion] =
        (emotionTotals[emotion] || 0) + Math.max(0.1, item.confidence) * item.weight;
    });

    const dominantEmotion =
      Object.entries(emotionTotals).sort((a,b) => b[1] - a[1])[0]?.[0] || "neutral";

    const mood = themeForEmotion(dominantEmotion, score);

    const confidence =
      results.reduce((sum,item) => sum + item.confidence * item.weight, 0) / totalWeight;

    return {
      mood,
      polarityMood,
      score:Number(score.toFixed(3)),
      confidence:Number(confidence.toFixed(3)),
      dominantEmotion,
      analyzed:results.length,
      results,
      lexiconSource:FEEL_STATE,
      lexiconSize:FEEL_COUNT,
      lexiconError:FEEL_ERROR || null
    };
  }

  function getStatus() {
    return {
      state:FEEL_STATE,
      size:FEEL_COUNT,
      error:FEEL_ERROR || null,
      source:FEEL_URLS[0]
    };
  }

  const ready = loadFeelLexicon();

  window.EmotionLexicon = {
    analyzeText,
    analyzeMany,
    analyzeSimple,
    getStatus,
    ready,
    lexicon: {
      emotions: EMOTIONS,
      positive: EXTRA_POSITIVE.concat(MORE_POSITIVE),
      negative: EXTRA_NEGATIVE.concat(MORE_NEGATIVE),
      phrases: Object.assign({}, PHRASES.positive, PHRASES.negative, MORE_PHRASES),
      negations: Array.from(NEGATIONS),
      intensifiers: INTENSIFIERS,
      diminishers: DIMINISHERS,
      contrast: CONTRAST_WORDS
    }
  };
})();
