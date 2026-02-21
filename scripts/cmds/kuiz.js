const axios = require('axios');

const BASE_URL = 'https://qizapi.onrender.com/api';

// Fonction pour traduire les question
async function translateQuestion(questionData, targetLang = 'fr') {
  try {
    // Ne pas traduire si c'est déjà en français ou si c'est une question d'image (flag)
    if (questionData.category === 'flag' || questionData.question.includes('http')) {
      return questionData;
    }

    // Traduire la question
    const questionRes = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(questionData.question)}`);
    const translatedQuestion = questionRes.data[0][0][0];

    // Traduire les options si elles existent
    let translatedOptions = [];
    if (questionData.options && Array.isArray(questionData.options)) {
      for (const opt of questionData.options) {
        const optRes = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(opt)}`);
        translatedOptions.push(optRes.data[0][0][0]);
      }
    }

    // Traduire la catégorie
    const categoryRes = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(questionData.category || '')}`);
    const translatedCategory = categoryRes.data[0][0][0];

    // Traduire la difficulté
    const difficultyRes = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(questionData.difficulty || '')}`);
    const translatedDifficulty = difficultyRes.data[0][0][0];

    return {
      ...questionData,
      question: translatedQuestion || questionData.question,
      options: translatedOptions.length > 0 ? translatedOptions : questionData.options,
      category: translatedCategory || questionData.category,
      difficulty: translatedDifficulty || questionData.difficulty,
      originalAnswer: questionData.answer // Garder la réponse originale pour la vérification
    };
  } catch (error) {
    console.error("Translation error:", error);
    return questionData; // Retourner les données originales en cas d'erreur
  }
}

module.exports = {
  config: {
    name: "quiz",
    aliases: ["q"],
    version: "3.0",
    author: "Christus", // Nom de l'auteur changé
    countDown: 0, 
    role: 0,
    longDescription: { 
      en: "Advanced quiz game with social features, multiplayer, achievements, and comprehensive analytics",
      fr: "Jeu de quiz avancé avec fonctionnalités sociales, multijoueur, réalisations et analyses complètes"
    },
    category: "game",
    guide: {
      en: `{pn} <category>`,
      fr: `{pn} <catégorie>`
    }
  },

  langs: {
    en: {
      reply: "🎯 𝗤𝘂𝗶𝘇 𝗖𝗵𝗮𝗹𝗹𝗲𝗻𝗴𝗲\n━━━━━━━━━━\n\n📚 𝖢𝖺𝗍𝖾𝗀𝗈𝗋𝗒: {category}\n🎚️ 𝖣𝗂𝖿𝖿𝗂𝖼𝗎𝗅𝗍𝗒: {difficulty}\n❓ 𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: {question}\n\n{options}\n\n⏰ 𝖸𝗈𝗎 𝗁𝖺𝗏𝖾 30 𝗌𝖾𝖼𝗈𝗇𝖽𝗌 𝗍𝗈 𝖺𝗇𝗌𝗐𝖾𝗋 (A/B/C/D):",
      torfReply: "⚙ 𝗤𝘂𝗶𝘇 ( True/False )\n━━━━━━━━━━\n\n💭 𝗤𝘂𝖾𝗌𝗍𝗂𝗈𝗇: {question}\n\n😆: True\n😮: False\n\nReact with emojis\n⏰ 30 seconds to answer",
      correctMessage: "🎉 𝗖𝗼𝗿𝗿𝗲𝗰𝘁 𝗔𝗻𝘀𝘄𝗲𝗿!\n━━━━━━━━━━\n\n✅ 𝖲𝖼𝗈𝗋𝖾: {correct}/{total}\n🏆 𝖠𝖼𝖼𝗎𝗋𝖺𝖼𝗒: {accuracy}%\n🔥 𝖢𝗎𝗋𝗋𝖾𝗇𝗍 𝖲𝗍𝗋𝖾𝖺𝗄: {streak}\n⚡ 𝖱𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖳𝗂𝗆𝖾: {time}s\n🎯 𝖷𝖯 𝖦𝖺𝗂𝗇𝖾𝖽: +{xp}\n💰 𝖬𝗈𝗇𝖾𝗒 𝖤𝖺𝗋𝗇𝖾𝖽: +{money}",
      wrongMessage: "❌ 𝗜𝗻𝗰𝗼𝗿𝗿𝗲𝗰𝘁 𝗔𝗻𝘀𝘄𝗲𝗿\n━━━━━━━━━━\n\n🎯 𝖢𝗈𝗋𝗋𝖾𝖼𝗍: {correctAnswer}\n📊 𝖲𝖼𝗈𝗋𝖾: {correct}/{total}\n📈 𝖠𝖼𝖼𝗎𝗋𝖺𝖼𝗒: {accuracy}%\n💔 𝖲𝗍𝗋𝖾𝖺𝗄 𝖱𝖾𝗌𝖾𝗍",
      timeoutMessage: "⏰ 𝖳𝗂𝗆𝖾'𝗌 𝖴𝗉! 𝖢𝗈𝗋𝗋𝖾𝖼𝗍 𝖺𝗇𝗌𝗐𝖾𝗋: {correctAnswer}",
      achievementUnlocked: "🏆 𝗔𝗰𝗵𝗶𝗲𝘃𝗲𝗺𝗲𝗻𝘁 𝗨𝗻𝗹𝗼𝗰𝗸𝗲𝗱!\n{achievement}\n💰 +{bonus} bonus coins!"
    },
    fr: {
      reply: "🎯 𝗗𝗲́𝗳𝗶 𝗤𝘂𝗶𝘇\n━━━━━━━━━━\n\n📚 𝖢𝖺𝗍𝖾́𝗀𝗈𝗋𝗂𝖾: {category}\n🎚️ 𝖣𝗂𝖿𝖿𝗂𝖼𝗎𝗅𝗍𝖾́: {difficulty}\n❓ 𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: {question}\n\n{options}\n\n⏰ 𝖵𝗈𝗎𝗌 𝖺𝗏𝖾𝗓 30 𝗌𝖾𝖼𝗈𝗇𝖽𝖾𝗌 𝗉𝗈𝗎𝗋 𝗋épondre (A/B/C/D):",
      torfReply: "⚙ 𝗤𝘂𝗶𝘇 ( Vrai/Faux )\n━━━━━━━━━━\n\n💭 𝗤𝘂𝖾𝗌𝗍𝗂𝗈𝗇: {question}\n\n😆: Vrai\n😮: Faux\n\nRéagissez avec les émojis\n⏰ 30 secondes pour répondre",
      correctMessage: "🎉 𝗕𝗼𝗻𝗻𝗲 𝗿𝗲́𝗽𝗼𝗻𝘀𝗲 !\n━━━━━━━━━━\n\n✅ 𝖲𝖼𝗈𝗋𝖾: {correct}/{total}\n🏆 𝖯𝗋𝖾́𝖼𝗂𝗌𝗂𝗈𝗇: {accuracy}%\n🔥 𝖲𝖾́𝗋𝗂𝖾 𝖺𝖼𝗍𝗎𝖾𝗅𝗅𝖾: {streak}\n⚡ 𝖳𝖾𝗆𝗉𝗌 𝖽𝖾 𝗋𝖾́𝗉𝗈𝗇𝗌𝖾: {time}s\n🎯 𝖷𝖯 𝖦𝖺𝗀𝗇é: +{xp}\n💰 𝖠𝗋𝗀𝖾𝗇𝗍 𝖦𝖺𝗀𝗇é: +{money}",
      wrongMessage: "❌ 𝗠𝗮𝘂𝘃𝗮𝗶𝘀𝗲 𝗿𝗲́𝗽𝗼𝗻𝘀𝗲\n━━━━━━━━━━\n\n🎯 𝖡𝗈𝗇𝗇𝖾 𝗋𝖾́𝗉𝗈𝗇𝗌𝖾: {correctAnswer}\n📊 𝖲𝖼𝗈𝗋𝖾: {correct}/{total}\n📈 𝖯𝗋𝖾́𝖼𝗂𝗌𝗂𝗈𝗇: {accuracy}%\n💔 𝖲𝖾́𝗋𝗂𝖾 𝗋𝖾́𝗂𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗌ée",
      timeoutMessage: "⏰ 𝖳𝖾𝗆𝗉s 𝖾́𝖼𝗈𝗎𝗅é ! 𝖡𝗈𝗇𝗇𝖾 𝗋𝖾́𝗉𝗈𝗇𝗌𝖾: {correctAnswer}",
      achievementUnlocked: "🏆 𝗦𝘂𝗰𝗰𝗲̀𝘀 𝗱𝗲́𝗯𝗹𝗼𝗾𝘂é !\n{achievement}\n💰 +{bonus} pièces bonus !"
    }
  },

  generateProgressBar(percentile) {
    const filled = Math.round(percentile / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  },

  getUserTitle(correct) {
    if (correct >= 50000) return '🌟 Quiz Omniscient';
    if (correct >= 25000) return '👑 Quiz Divin';
    if (correct >= 15000) return '⚡ Quiz Titan';
    if (correct >= 10000) return '🏆 Quiz Légende';
    if (correct >= 7500) return '🎓 Grand Maître';
    if (correct >= 5000) return '👨‍🎓 Maître du Quiz';
    if (correct >= 2500) return '🔥 Expert en Quiz';
    if (correct >= 1500) return '📚 Savant du Quiz';
    if (correct >= 1000) return '🎯 Apprenti Quiz';
    if (correct >= 750) return '🌟 Chercheur de Savoir';
    if (correct >= 500) return '📖 Apprenant Rapide';
    if (correct >= 250) return '🚀 Étoile Montante';
    if (correct >= 100) return '💡 Débutant';
    if (correct >= 50) return '🎪 Premiers Pas';
    if (correct >= 25) return '🌱 Nouveau Venu';
    if (correct >= 10) return '🔰 Débutant';
    if (correct >= 1) return '👶 Recrue';
    return '🆕 Nouveau Joueur';
  },

  async getUserName(api, userId) {
    try {
      const userInfo = await api.getUserInfo(userId);
      return userInfo[userId]?.name || 'Joueur Anonyme';
    } catch (error) {
      console.warn("User info fetch failed for", userId, error);
      return 'Joueur Anonyme';
    }
  },

  async getAvailableCategories() {
    try {
      const res = await axios.get(`${BASE_URL}/categories`);
      return res.data.map(cat => cat.toLowerCase());
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  onStart: async function ({ message, event, args, commandName, getLang, api, usersData }) {
    try {
      const command = args[0]?.toLowerCase();

      if (!args[0] || command === "help") {
        return await this.handleDefaultView(message, getLang);
      }

      switch (command) {
        case "rank":
        case "profile":
        case "rang":
        case "profil":
          return await this.handleRank(message, event, getLang, api, usersData);
        case "leaderboard":
        case "lb":
        case "classement":
          return await this.handleLeaderboard(message, getLang, args.slice(1), api);
        case "category":
        case "categorie":
          if (args.length > 1) {
            return await this.handleCategoryLeaderboard(message, getLang, args.slice(1), api);
          }
          return await this.handleCategories(message, getLang);
        case "daily":
        case "quotidien":
          return await this.handleDailyChallenge(message, event, commandName, api);
        case "torf":
        case "vrai/faux":
          return await this.handleTrueOrFalse(message, event, commandName, api);
        case "flag":
        case "drapeau":
          return await this.handleFlagQuiz(message, event, commandName, api);
        case "anime":
          return await this.handleAnimeQuiz(message, event, commandName, api);
        case "hard":
        case "difficile":
          return await this.handleQuiz(message, event, ["general"], commandName, getLang, api, usersData, "hard");
        case "medium":
        case "moyen":
          return await this.handleQuiz(message, event, ["general"], commandName, getLang, api, usersData, "medium");
        case "easy":
        case "facile":
          return await this.handleQuiz(message, event, ["general"], commandName, getLang, api, usersData, "easy");
        case "random":
        case "aleatoire":
          return await this.handleQuiz(message, event, [], commandName, getLang, api, usersData);
        default:
          const categories = await this.getAvailableCategories();
          if (categories.includes(command)) {
            return await this.handleQuiz(message, event, [command], commandName, getLang, api, usersData);
          } else {
            return await this.handleDefaultView(message, getLang);
          }
      }
    } catch (err) {
      console.error("Quiz start error:", err);
      return message.reply("⚠️ Erreur, réessayez plus tard.");
    }
  },

  async handleDefaultView(message, getLang) {
    try {
      const res = await axios.get(`${BASE_URL}/categories`);
      const categories = res.data;

      const catText = categories.map(c => `📍 ${c.charAt(0).toUpperCase() + c.slice(1)}`).join("\n");

      return message.reply(
        `🎯 𝗤𝘂𝗶𝘇\n━━━━━━━━\n\n` +
        `📚 𝗖𝗮𝘁𝗲́𝗴𝗼𝗿𝗶𝗲𝘀\n\n${catText}\n\n` +
        `━━━━━━━━━\n\n` +
        `🏆 𝗨𝘁𝗶𝗹𝗶𝘀𝗮𝘁𝗶𝗼𝗻\n` +
        `• quiz rang - Voir votre rang\n` +
        `• quiz classement - Voir le classement\n` +
        `• quiz vrai/faux - Jouer au quiz Vrai/Faux\n` +
        `• quiz drapeau - Jouer au quiz de drapeaux\n` +
        `• quiz anime - Jouer au quiz de personnages anime\n\n` +
        `🎮 Utilisez: quiz <catégorie> pour commencer`
      );
    } catch (err) {
      console.error("Default view error:", err);
      return message.reply("⚠️ Impossible de récupérer les catégories. Essayez 'quiz help' pour les commandes.");
    }
  },

  async handleRank(message, event, getLang, api, usersData) {
    try {
      const userName = await this.getUserName(api, event.senderID);

      await axios.post(`${BASE_URL}/user/update`, {
        userId: event.senderID,
        name: userName
      });

      const res = await axios.get(`${BASE_URL}/user/${event.senderID}`);
      const user = res.data;

      if (!user || user.total === 0) {
        return message.reply(`❌ Vous n'avez pas encore joué au quiz ! Utilisez 'quiz aléatoire' pour commencer.\n👤 Bienvenue, ${userName}!`);
      }

      const position = user.position ?? "N/A";
      const totalUser = user.totalUsers ?? "N/A";
      const progressBar = this.generateProgressBar(user.percentile ?? 0);
      const title = this.getUserTitle(user.correct || 0);

      const streakInfo = user.currentStreak > 0 ? 
        `🔥 𝖲𝖾́𝗋𝗂𝖾 𝖺𝖼𝗍𝗎𝖾𝗅𝗅𝖾: ${user.currentStreak}${user.currentStreak >= 5 ? ' 🚀' : ''}` :
        `🔥 𝖲𝖾́𝗋𝗂𝖾 𝖺𝖼𝗍𝗎𝖾𝗅𝗅𝖾: 0`;

      const bestStreakInfo = user.bestStreak > 0 ?
        `🏅 𝖬𝖾𝗂𝗅𝗅𝖾𝗎𝗋𝖾 𝗌𝖾́𝗋𝗂𝖾: ${user.bestStreak}${user.bestStreak >= 10 ? ' 👑' : user.bestStreak >= 5 ? ' ⭐' : ''}` :
        `🏅 𝖬𝖾𝗂𝗅𝗅𝖾𝗎𝗋𝖾 𝗌𝖾́𝗋𝗂𝖾: 0`;

      const userData = await usersData.get(event.senderID) || {};
      const userMoney = userData.money || 0;

      const currentXP = user.xp ?? 0;
      const xpTo1000 = Math.max(0, 1000 - currentXP);
      const xpProgress = Math.min(100, (currentXP / 1000) * 100);
      const xpProgressBar = this.generateProgressBar(xpProgress);

      return message.reply(
        `🎮 𝗣𝗿𝗼𝗳𝗶𝗹 𝗤𝘂𝗶𝘇\n━━━━━━━━━\n\n` +
        `👤 ${userName}\n` +
        `🎖️ ${title}\n` +
        `🏆 𝖱𝖺𝗇𝗀 𝗀𝗅𝗈𝖻𝖺𝗅: #${position}/${totalUser}\n` +
        `📈 𝖯𝖾𝗋𝖼𝖾𝗇𝗍𝗂𝗅𝖾: ${progressBar} ${user.percentile ?? 0}%\n\n` +
        `📊 𝗦𝘁𝗮𝘁𝗶𝘀𝘁𝗶𝗾𝘂𝗲𝘀\n` +
        `✅ 𝖢𝗈𝗋𝗋𝖾𝖼𝗍: ${user.correct ?? 0}\n` +
        `❌ 𝖨𝗇𝖼𝗈𝗋𝗋𝖾𝖼𝗍: ${user.wrong ?? 0}\n` +
        `📝 𝖳𝗈𝗍𝖺𝗅: ${user.total ?? 0}\n` +
        `🎯 𝖯𝗋𝖾́𝖼𝗂𝗌𝗂𝗈𝗇: ${user.accuracy ?? 0}%\n` +
        `⚡ 𝖳𝖾𝗆𝗉𝗌 𝖬𝗈𝗒𝖾𝗇: ${(user.avgResponseTime ?? 0).toFixed(1)}s\n\n` +
        `💰 𝗥𝗶𝗰𝗵𝗲𝘀𝘀𝗲 & 𝗫𝗣\n` +
        `💵 𝖠𝗋𝗀𝖾𝗇𝗍: ${userMoney.toLocaleString()}\n` +
        `✨ 𝖷𝖯: ${currentXP}/1000\n` +
        `🎯 𝖷𝖯 𝗉𝗈𝗎𝗋 1000: ${xpTo1000}\n` +
        `${xpProgressBar} ${xpProgress.toFixed(1)}%\n\n` +
        `🔥 𝗜𝗻𝗳𝗼 𝗦𝗲́𝗿𝗶𝗲\n` +
        `${streakInfo}\n` +
        `${bestStreakInfo}\n\n` +
        `🎯 𝖯𝗋𝗈𝖼𝗁𝖺𝗂𝗇 𝗈𝖻𝗃𝖾𝖼𝗍𝗂𝖿: ${user.nextMilestone || "Continuez à jouer !"}`
      );
    } catch (err) {
      console.error("Rank error:", err);
      return message.reply("⚠️ Impossible de récupérer votre rang. Veuillez réessayer plus tard.");
    }
  },

  async handleLeaderboard(message, getLang, args, api) {
    try {
      const page = parseInt(args?.[0]) || 1;
      const sortBy = args?.[1] || 'correct';

      const res = await axios.get(`${BASE_URL}/leaderboards?page=${page}&limit=8`);
      const { rankings, stats, pagination } = res.data;

      if (!rankings || rankings.length === 0) {
        return message.reply("🏆 Aucun joueur trouvé dans le classement. Commencez à jouer pour être le premier !");
      }

      const now = new Date();
      const currentDate = now.toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
      });
      const currentTime = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC'
      });

      const players = await Promise.all(rankings.map(async (u, i) => {
        let userName = u.name || 'Joueur Anonyme';

        if (u.userId && userName === 'Joueur Anonyme') {
          try {
            userName = await this.getUserName(api, u.userId);
          } catch {
            userName = u.name || 'Joueur Anonyme';
          }
        }

        const position = (pagination.currentPage - 1) * 8 + i + 1;
        const crown = position === 1 ? "👑" : position === 2 ? "🥈" : position === 3 ? "🥉" : position <= 10 ? "🏅" : "🎯";
        const title = this.getUserTitle(u.correct || 0);

        const level = u.level ?? Math.floor((u.correct || 0) / 50) + 1;
        const xp = u.xp ?? (u.correct || 0) * 10;
        const accuracy = u.accuracy ?? (u.total > 0 ? Math.round((u.correct / u.total) * 100) : 0);
        const avgResponseTime = typeof u.avgResponseTime === 'number' ? `${u.avgResponseTime.toFixed(2)}s` : 'N/A';
        const totalResponseTime = u.totalResponseTime?.toFixed(2) || '0';
        const fastest = u.fastestResponse?.toFixed(2) || 'N/A';
        const slowest = u.slowestResponse?.toFixed(2) || 'N/A';
        const playTime = u.totalPlayTime ? `${(u.totalPlayTime / 60).toFixed(1)} min` : '0 min';
        const games = u.gamesPlayed || u.total || 0;
        const perfectGames = u.perfectGames || 0;
        const longestSession = u.longestSession?.toFixed(2) || '0';
        const joinDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : 'Inconnue';

        return `${crown} #${position} ${userName}\n` +
               `🎖️ ${title} | 🌟 Niv.${level} | ✨ XP: ${xp.toLocaleString()}\n` +
               `📊 ${u.correct} ✅ / ${u.wrong} ❌ (Précision: ${accuracy}%)\n` +
               `🔥 Série actuelle: ${u.currentStreak || 0} | 🏅 Meilleure série: ${u.bestStreak || 0}\n` +
               `⚡ Temps moyen: ${avgResponseTime} | ⏱️ Temps total: ${totalResponseTime}s\n` +
               `🚀 Plus rapide: ${fastest}s | 🐌 Plus lent: ${slowest}s\n` +
               `🎯 Questions répondues: ${u.questionsAnswered} | Parties: ${games}\n` +
               `🎮 Temps de jeu: ${playTime} | 📈 Parties parfaites: ${perfectGames}\n` +
               `📅 Inscrit: ${joinDate}`;
      }));

      return message.reply(
        `🏆 𝗖𝗹𝗮𝘀𝘀𝗲𝗺𝗲𝗻𝘁 𝗚𝗹𝗼𝗯𝗮𝗹\n━━━━━━━━━\n\n` +
        `📅 ${currentDate}\n⏰ ${currentTime} UTC\n\n` +
        `━━━━━━━━━\n\n${players.join('\n\n')}\n\n` +
        `📖 Page ${pagination?.currentPage || 1}/${pagination?.totalPages || 1} | 👥 Total Utilisateurs: ${stats?.totalUsers || 0}\n` +
        `🔄 Utilisez: quiz classement <page> <tri>\n` +
        `📊 Options de tri: correct, accuracy, streak, level`
      );

    } catch (err) {
      console.error("Leaderboard error:", err);
      return message.reply("⚠️ Impossible de récupérer le classement. Le serveur est peut-être occupé, réessayez plus tard.");
    }
  },

  async handleCategories(message, getLang) {
    try {
      const res = await axios.get(`${BASE_URL}/categories`);
      const categories = res.data;

      const catText = categories.map(c => `📍 ${c.charAt(0).toUpperCase() + c.slice(1)}`).join("\n");

      return message.reply(
        `📚 𝗖𝗮𝘁𝗲́𝗴𝗼𝗿𝗶𝗲𝘀 𝗱𝘂 𝗤𝘂𝗶𝘇\n━━━━━━━━\n\n${catText}\n\n` +
        `🎯 Utilisez: quiz <catégorie>\n` +
        `🎲 Aléatoire: quiz aléatoire\n` +
        `🏆 Quotidien: quiz quotidien\n` +
        `🌟 Spécial: quiz vrai/faux, quiz drapeau`
      );
    } catch (err) {
      console.error("Categories error:", err);
      return message.reply("⚠️ Impossible de récupérer les catégories.");
    }
  },

  async handleDailyChallenge(message, event, commandName, api) {
    try {
      const res = await axios.get(`${BASE_URL}/challenge/daily?userId=${event.senderID}`);
      let { question, challengeDate, reward, streak } = res.data;

      // Traduire la question en français
      const translatedData = await translateQuestion({
        question: question.question,
        options: question.options,
        answer: question.answer,
        _id: question._id
      });

      const userName = await this.getUserName(api, event.senderID);

      const optText = translatedData.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join("\n");

      const info = await message.reply(
        `🌟 𝗗𝗲́𝗳𝗶 𝗤𝘂𝗼𝘁𝗶𝗱𝗶𝗲𝗻\n━━━━━━━━━\n\n` +
        `📅 ${challengeDate}\n` +
        `🎯 Récompense bonus: +${reward} XP\n` +
        `🔥 Série quotidienne: ${streak}\n\n\n` +
        `❓ ${translatedData.question}\n\n${optText}\n\n⏰ 30 secondes pour répondre !`
      );

      global.GoatBot.onReply.set(info.messageID, {
        commandName,
        author: event.senderID,
        messageID: info.messageID,
        answer: translatedData.answer,
        questionId: translatedData._id,
        startTime: Date.now(),
        isDailyChallenge: true,
        bonusReward: reward
      });

      setTimeout(() => {
        const r = global.GoatBot.onReply.get(info.messageID);
        if (r) {
          message.reply(`⏰ Temps écoulé ! La bonne réponse était: ${translatedData.answer}`);
          message.unsend(info.messageID);
          global.GoatBot.onReply.delete(info.messageID);
        }
      }, 30000);
    } catch (err) {
      console.error("Daily challenge error:", err);
      return message.reply("⚠️ Impossible de créer le défi quotidien.");
    }
  },

  async handleTrueOrFalse(message, event, commandName, api) {
    try {
      const res = await axios.get(`${BASE_URL}/question?category=torf&userId=${event.senderID}`);
      let { _id, question, answer } = res.data;

      // Traduire la question en français
      const translatedData = await translateQuestion({
        question: question,
        options: ["True", "False"],
        answer: answer,
        _id: _id
      });

      const info = await message.reply(
        `⚙ 𝗤𝘂𝗶𝘇 ( Vrai/Faux )\n━━━━━━━━━━\n\n💭 𝗤𝘂𝖾𝗌𝗍𝗂𝗈𝗇: ${translatedData.question}\n\n😆: Vrai\n😮: Faux\n\nRéagissez avec les émojis\n⏰ 30 secondes pour répondre`
      );

      const correctAnswer = answer.toUpperCase();

      global.GoatBot.onReaction.set(info.messageID, {
        commandName,
        author: event.senderID,
        messageID: info.messageID,
        answer: correctAnswer,
        reacted: false,
        reward: 10000,
        questionId: _id,
        startTime: Date.now()
      });

      setTimeout(() => {
        const reaction = global.GoatBot.onReaction.get(info.messageID);
        if (reaction && !reaction.reacted) {
          const correctText = correctAnswer === "A" ? "Vrai" : "Faux";
          message.reply(`⏰ Temps écoulé ! La bonne réponse était: ${correctText}`);
          message.unsend(info.messageID);
          global.GoatBot.onReaction.delete(info.messageID);
        }
      }, 30000);
    } catch (err) {
      console.error("True/False error:", err);
      return message.reply("⚠️ Impossible de créer une question Vrai/Faux.");
    }
  },

  async handleFlagQuiz(message, event, commandName, api) {
    try {
      const res = await axios.get(`${BASE_URL}/question?category=flag&userId=${event.senderID}`);
      let { _id, question, options, answer } = res.data;

      // Ne pas traduire les questions de drapeau (images)
      const flagEmbed = {
        body: `🏁 𝗤𝘂𝗶𝘇 𝗱𝗲 𝗗𝗿𝗮𝗽𝗲𝗮𝘂𝘅\n━━━━━━━━\n\n🌍 Devinez le pays de ce drapeau :\n\n` +
              options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join("\n") +
              `\n\n⏰ Temps : 30 secondes pour répondre.`,
        attachment: question ? await global.utils.getStreamFromURL(question) : null
      };

      const info = await message.reply(flagEmbed);

      global.GoatBot.onReply.set(info.messageID, {
        commandName,
        author: event.senderID,
        messageID: info.messageID,
        answer,
        options,
        questionId: _id,
        startTime: Date.now(),
        isFlag: true,
        reward: this.envConfig.flagReward || 10000
      });

      setTimeout(() => {
        const r = global.GoatBot.onReply.get(info.messageID);
        if (r) {
          message.reply(`⏰ Temps écoulé ! La bonne réponse était: ${answer}`);
          message.unsend(info.messageID);
          global.GoatBot.onReply.delete(info.messageID);
        }
      }, 30000);
    } catch (err) {
      console.error("Flag quiz error:", err);
      return message.reply("⚠️ Impossible de créer un quiz de drapeau.");
    }
  },

  async handleAnimeQuiz(message, event, commandName, api) {
    try {
      const res = await axios.get(`${BASE_URL}/question?category=anime&userId=${event.senderID}`);
      let { _id, question, options, answer, imageUrl } = res.data;

      // Traduire la question et les options en français
      const translatedData = await translateQuestion({
        question: question,
        options: options,
        answer: answer,
        _id: _id
      });

      const animeEmbed = {
        body: `🎌 𝗤𝘂𝗶𝘇 𝗔𝗻𝗶𝗺𝗲\n━━━━━━━━\n\n❔ 𝗜𝗻𝗱𝗶𝗰𝗲 : ${translatedData.question}\n\n` +
              translatedData.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join("\n") +
              `\n\n⏰ Temps : 30 secondes\n🎯 Défi de reconnaissance de personnages animés !`,
        attachment: imageUrl ? await global.utils.getStreamFromURL(imageUrl) : null
      };

      const info = await message.reply(animeEmbed);

      global.GoatBot.onReply.set(info.messageID, {
        commandName,
        author: event.senderID,
        messageID: info.messageID,
        answer: translatedData.answer,
        options: translatedData.options,
        questionId: _id,
        startTime: Date.now(),
        isAnime: true,
        reward: this.envConfig.animeReward || 15000
      });

      setTimeout(() => {
        const r = global.GoatBot.onReply.get(info.messageID);
        if (r) {
          message.reply(`⏰ Temps écoulé ! La bonne réponse était: ${translatedData.answer}\n🎌 Continuez à regarder des animés pour améliorer vos compétences !`);
          message.unsend(info.messageID);
          global.GoatBot.onReply.delete(info.messageID);
        }
      }, 30000);
    } catch (err) {
      console.error("Anime quiz error:", err);
      return message.reply("⚠️ Impossible de créer un quiz anime. Assurez-vous que des questions d'anime sont disponibles dans la base de données.");
    }
  },

  async handleQuiz(message, event, args, commandName, getLang, api, usersData, forcedDifficulty = null) {
    try {
      const userName = await this.getUserName(api, event.senderID);

      await axios.post(`${BASE_URL}/user/update`, {
        userId: event.senderID,
        name: userName
      });

      const category = args[0]?.toLowerCase() || "";

      let queryParams = {
        userId: event.senderID
      };
      if (category && category !== "random") {
        queryParams.category = category;
      }
      if (forcedDifficulty) {
        queryParams.difficulty = forcedDifficulty;
      }

      const res = await axios.get(`${BASE_URL}/question`, { params: queryParams });
      let { _id, question, options, answer, category: qCategory, difficulty } = res.data;

      // Traduire la question et les options en français
      const translatedData = await translateQuestion({
        _id,
        question,
        options,
        answer,
        category: qCategory,
        difficulty
      });

      const optText = translatedData.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join("\n");

      const info = await message.reply(
        `🎯 𝗗𝗲́𝗳𝗶 𝗤𝘂𝗶𝘇\n━━━━━━━━━━\n\n` +
        `📚 𝖢𝖺𝗍𝖾́𝗀𝗈𝗋𝗂𝖾: ${translatedData.category?.charAt(0).toUpperCase() + translatedData.category?.slice(1) || "Aléatoire"}\n` +
        `🎚️ 𝖣𝗂𝖿𝖿𝗂𝖼𝗎𝗅𝗍𝖾́: ${translatedData.difficulty?.charAt(0).toUpperCase() + translatedData.difficulty?.slice(1) || "Moyen"}\n` +
        `❓ 𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${translatedData.question}\n\n${optText}\n\n` +
        `⏰ 𝖵𝗈𝗎𝗌 𝖺𝗏𝖾𝗓 30 𝗌𝖾𝖼𝗈𝗇𝖽𝖾𝗌 𝗉𝗈𝗎𝗋 𝗋épondre (A/B/C/D):`
      );

      global.GoatBot.onReply.set(info.messageID, {
        commandName,
        author: event.senderID,
        messageID: info.messageID,
        answer: translatedData.answer,
        questionId: translatedData._id,
        startTime: Date.now(),
        difficulty: translatedData.difficulty,
        category: translatedData.category
      });

      setTimeout(() => {
        const r = global.GoatBot.onReply.get(info.messageID);
        if (r) {
          message.reply(`⏰ Temps écoulé ! La bonne réponse était: ${translatedData.answer}`);
          message.unsend(info.messageID);
          global.GoatBot.onReply.delete(info.messageID);
        }
      }, 30000);
    } catch (err) {
      console.error("Quiz error:", err);
      message.reply("⚠️ Impossible de récupérer une question. Essayez 'quiz categories' pour voir les options disponibles.");
    }
  },

  async handleCategoryLeaderboard(message, getLang, args, api) {
    try {
      const category = args[0]?.toLowerCase();
      if (!category) {
        return message.reply("📚 Veuillez spécifier une catégorie pour voir le classement.");
      }

      const page = parseInt(args[1]) || 1;
      const res = await axios.get(`${BASE_URL}/leaderboard/category/${category}?page=${page}&limit=10`);
      const { users, pagination } = res.data;

      if (!users || users.length === 0) {
        return message.reply(`🏆 Aucun joueur trouvé pour la catégorie : ${category}.`);
      }

      const topPlayersWithNames = await Promise.all(users.map(async (u, i) => {
        let userName = 'Joueur Anonyme';
        if (u.userId) {
          userName = await this.getUserName(api, u.userId);
        }

        const position = (pagination.currentPage - 1) * 10 + i + 1;
        const crown = position === 1 ? "👑" : position === 2 ? "🥈" : position === 3 ? "🥉" : "🏅";
        const title = this.getUserTitle(u.correct || 0);
        return `${crown} #${position} ${userName}\n🎖️ ${title}\n📊 ${u.correct || 0}/${u.total || 0} (${u.accuracy || 0}%)`;
      }));

      const topPlayers = topPlayersWithNames.join('\n\n');

      return message.reply(
        `🏆 𝗖𝗹𝗮𝘀𝘀𝗲𝗺𝗲𝗻𝘁 : ${category.charAt(0).toUpperCase() + category.slice(1)}\n━━━━━━━━━\n\n${topPlayers}\n\n` +
        `📖 Page ${pagination.currentPage}/${pagination.totalPages}\n` +
        `👥 Total Joueurs: ${pagination.totalUsers}`
      );
    } catch (err) {
      console.error("Category leaderboard error:", err);
      return message.reply("⚠️ Impossible de récupérer le classement de la catégorie.");
    }
  },

  onReaction: async function ({ message, event, Reaction, api, usersData }) {
    try {
      const { author, messageID, answer, reacted, reward } = Reaction;

      if (event.userID !== author || reacted) return;

      const userAnswer = event.reaction === '😆' ? "A" : "B"; 
      const isCorrect = userAnswer === answer;

      const timeSpent = (Date.now() - Reaction.startTime) / 1000;
      if (timeSpent > 30) {
        return message.reply("⏰ Temps écoulé !");
      }

      const userName = await this.getUserName(api, event.userID);

      const answerData = {
        userId: event.userID,
        questionId: Reaction.questionId,
        answer: userAnswer,
        timeSpent,
        userName
      };

      try {
        const res = await axios.post(`${BASE_URL}/answer`, answerData);
        const { user, xpGained } = res.data;

        const userData = await usersData.get(event.userID) || {};
        if (isCorrect) {
          const baseMoneyReward = 10000;
          const streakBonus = (user.currentStreak || 0) * 1000;
          const totalMoneyReward = baseMoneyReward + streakBonus;

          userData.money = (userData.money || 0) + totalMoneyReward;
          await usersData.set(event.userID, userData);

          const correctText = answer === "A" ? "Vrai" : "Faux";

          const torfSuccessMessages = [
            "🎯 𝗔𝗕𝗦𝗢𝗟𝗨𝗠𝗘𝗡𝗧 𝗩𝗥𝗔𝗜 ! 𝗩𝗼𝘂𝘀 ê𝘁𝗲𝘀 𝘂𝗻 𝗴𝗲́𝗻𝗶𝗲 ! ✨",
            "⚡ 𝗣𝗔𝗥𝗙𝗔𝗜𝗧 ! 𝗠𝗮𝗶̂𝘁𝗿𝗲 𝗱𝘂 𝗩𝗿𝗮𝗶/𝗙𝗮𝘂𝘅 ! 🏆",
            "🔥 𝗙𝗔𝗡𝗧𝗔𝗦𝗧𝗜𝗤𝗨𝗘 ! 𝗩𝗼𝘂𝘀 𝗮𝘃𝗲𝘇 𝗿𝗲́𝘂𝘀𝘀𝗶 ! 🎯",
            "🌟 𝗕𝗥𝗔𝗩𝗢 ! 𝗦𝗶𝗺𝗽𝗹𝗲 𝗺𝗮𝗶𝘀 𝗲𝗳𝗳𝗶𝗰𝗮𝗰𝗲 ! ⭐",
            "🎊 𝗘𝗫𝗖𝗘𝗟𝗟𝗘𝗡𝗧 ! 𝗥𝗮𝗽𝗶𝗱𝗲 𝗲𝘁 𝗰𝗼𝗿𝗿𝗲𝗰𝘁 ! 🚀"
          ];

          const randomTorfMsg = torfSuccessMessages[Math.floor(Math.random() * torfSuccessMessages.length)];

          let streakMessage = "";
          const streak = user.currentStreak || 0;
          if (streak >= 5) streakMessage = "\n🔥 𝗦𝗲́𝗿𝗶𝗲 𝗶𝗺𝗽𝗿𝗲𝘀𝘀𝗶𝗼𝗻𝗻𝗮𝗻𝘁𝗲 ! 𝗖𝗼𝗻𝘁𝗶𝗻𝘂𝗲𝘇 ! 🚀";

          const successMsg = `${randomTorfMsg}\n` +
            `━━━━━━━━━\n\n` +
            `🎉 𝗙𝗲́𝗹𝗶𝗰𝗶𝘁𝗮𝘁𝗶𝗼𝗻𝘀, ${userName}! 🎉\n\n` +
            `💰 𝗔𝗿𝗴𝗲𝗻𝘁 𝗴𝗮𝗴𝗻é: +${totalMoneyReward.toLocaleString()} 💎\n` +
            `✨ 𝗫𝗣 𝗴𝗮𝗴𝗻é: +${xpGained || 15} ⚡\n` +
            `🔥 𝗦é𝗿𝗶𝗲: ${user.currentStreak || 0} 🚀\n` +
            `⏱️ 𝗧𝗲𝗺𝗽𝘀: ${timeSpent.toFixed(1)}s` + streakMessage +
            `\n\n🎯 𝗠𝗮𝗶̂𝘁𝗿𝗲 𝗱𝘂 𝗩𝗿𝗮𝗶/𝗙𝗮𝘂𝘅 ! 𝗖𝗼𝗻𝘁𝗶𝗻𝘂𝗲𝘇 ! 🌟`;
          message.reply(successMsg);
        } else {
          const correctText = answer === "A" ? "Vrai" : "Faux";

          const torfWrongMessages = [
            "💔 𝗗𝗼𝗺𝗺𝗮𝗴𝗲 ! 𝗟𝗲 𝗩𝗿𝗮𝗶/𝗙𝗮𝘂𝘅 𝗽𝗲𝘂𝘁 ê𝘁𝗿𝗲 𝗽𝗶é𝗴𝗲𝘂𝘅 ! 🤔",
            "🌱 𝗢𝘂𝗽𝘀 ! 𝗣𝗮𝘀 𝗱𝗲 𝘀𝗼𝘂𝗰𝗶, 𝗰𝗼𝗻𝘁𝗶𝗻𝘂𝗲𝘇 𝗱'𝗮𝗽𝗽𝗿𝗲𝗻𝗱𝗿𝗲 ! 📚",
            "🔄 𝗣𝗮𝘀 𝘁𝗼𝘂𝘁 𝗮̀ 𝗳𝗮𝗶𝘁 ! 𝗣𝗮𝗿𝗳𝗼𝗶𝘀 𝗰'𝗲𝘀𝘁 𝘂𝗻𝗲 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻 𝗱𝗲 𝗰𝗵𝗮𝗻𝗰𝗲 ! 🎲",
            "⭐ 𝗙𝗮𝘂𝘅 ! 𝗟𝗮 𝗽𝗿𝗮𝘁𝗶𝗾𝘂𝗲 𝗿𝗲𝗻𝗱 𝗽𝗲𝗿𝗳𝗲𝗶𝘁 ! 💪",
            "💫 𝗥𝗮𝘁é ! 𝗠ê𝗺𝗲 𝗹𝗲𝘀 𝗺𝗮𝗶̂𝘁𝗿𝗲𝘀 𝘀𝗲 𝘁𝗿𝗼𝗺𝗽𝗲𝗻𝘁 𝗽𝗮𝗿𝗳𝗼𝗶𝘀 ! 🌟"
          ];

          const randomTorfWrongMsg = torfWrongMessages[Math.floor(Math.random() * torfWrongMessages.length)];

          message.reply(`${randomTorfWrongMsg}\n` +
            `━━━━━━━━━\n\n` +
            `🎯 𝗕𝗼𝗻𝗻𝗲 𝗿é𝗽𝗼𝗻𝘀𝗲: ${correctText} ✅\n` +
            `👤 ${userName}\n` +
            `💔 𝗦é𝗿𝗶𝗲 𝗿é𝗶𝗻𝗶𝘁𝗶𝗮𝗹𝗶𝘀é𝗲\n\n` +
            `🔥 𝗣𝗿𝗼𝗰𝗵𝗮𝗶𝗻𝗲 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻 𝗮𝘁𝘁𝗲𝗻𝗱 ! 𝗔𝗹𝗹𝗼𝗻𝘀-𝘆 ! 🚀`);
        }
      } catch (error) {
        console.error("Error updating score:", error);
      }

      global.GoatBot.onReaction.get(messageID).reacted = true;
      setTimeout(() => global.GoatBot.onReaction.delete(messageID), 1000);
    } catch (err) {
      console.error("Quiz reaction error:", err);
    }
  },

  onReply: async function ({ message, event, Reply, getLang, api, usersData }) {
    if (Reply.author !== event.senderID) return;

    try {
      const ans = event.body.trim().toUpperCase();
      if (!["A", "B", "C", "D"].includes(ans)) {
        return message.reply("❌ Veuillez répondre avec A, B, C ou D uniquement !");
      }

      const timeSpent = (Date.now() - Reply.startTime) / 1000;
      if (timeSpent > 30) {
        return message.reply("⏰ Temps écoulé !");
      }

      const userName = await this.getUserName(api, event.senderID);

      let correctAnswer = Reply.answer;
      let userAnswer = ans;

      if ((Reply.isFlag || Reply.isAnime) && Reply.options) {
        const optionIndex = ans.charCodeAt(0) - 65;
        if (optionIndex >= 0 && optionIndex < Reply.options.length) {
          userAnswer = Reply.options[optionIndex];
        }
      }

      const answerData = {
        userId: event.senderID,
        questionId: Reply.questionId,
        answer: userAnswer,
        timeSpent,
        userName
      };

      const res = await axios.post(`${BASE_URL}/answer`, answerData);

      if (!res.data) {
        throw new Error('Aucune donnée reçue');
      }

      const { result, user } = res.data;

      let responseMsg;

      if (result === "correct") {
        const userData = await usersData.get(event.senderID) || {};

        let baseMoneyReward = 10000;
        if (Reply.difficulty === 'hard') baseMoneyReward = 15000;
        if (Reply.difficulty === 'easy') baseMoneyReward = 7500;
        if (Reply.isFlag) baseMoneyReward = 12000;
        if (Reply.isAnime) baseMoneyReward = 15000;
        if (Reply.isDailyChallenge) baseMoneyReward = 20000;

        const streakBonus = (user.currentStreak || 0) * 1000;
        const totalMoneyReward = baseMoneyReward + streakBonus;

        userData.money = (userData.money || 0) + totalMoneyReward;
        await usersData.set(event.senderID, userData);

        const difficultyBonus = Reply.difficulty === 'hard' ? ' 🔥' : Reply.difficulty === 'easy' ? ' ⭐' : '';
        const streakBonus2 = (user.currentStreak || 0) >= 5 ? ` 🚀 ${user.currentStreak}x série !` : '';
        const flagBonus = Reply.isFlag ? ' 🏁' : '';
        const animeBonus = Reply.isAnime ? ' 🎌' : '';
        const dailyBonus = Reply.isDailyChallenge ? ' 🌟' : '';

        responseMsg = `🎉 Correct ! 💰\n` +
          `💵 Argent: +${totalMoneyReward.toLocaleString()}\n` +
          `✨ XP: +${user.xpGained || 15}\n` +
          `📊 Score: ${user.correct || 0}/${user.total || 0} (${user.accuracy || 0}%)\n` +
          `🔥 Série: ${user.currentStreak || 0}\n` +
          `⚡ Temps de réponse: ${timeSpent.toFixed(1)}s\n` +
          `🎯 Progrès XP: ${user.xp || 0}/1000\n` +
          `👤 ${userName}` + difficultyBonus + streakBonus2 + flagBonus + animeBonus + dailyBonus;
      } else {
        responseMsg = `❌ Faux ! Bonne réponse: ${correctAnswer}\n` +
          `📊 Score: ${user.correct || 0}/${user.total || 0} (${user.accuracy || 0}%)\n` +
          `💔 Série réinitialisée\n` +
          `👤 ${userName}` + (Reply.isFlag ? ' 🏁' : '') + (Reply.isAnime ? ' 🎌' : '');
      }

      await message.reply(responseMsg);

      if (user.achievements && user.achievements.length > 0) {
        const achievementMsg = user.achievements.map(ach => `🏆 ${ach}`).join('\n');
        await message.reply(`🏆 Succès débloqué !\n${achievementMsg}\n💰 +50 000 pièces bonus !\n✨ +100 XP bonus !`);

        const userData = await usersData.get(event.senderID) || {};
        userData.money = (userData.money || 0) + 50000;
        await usersData.set(event.senderID, userData);
      }

      message.unsend(Reply.messageID);
      global.GoatBot.onReply.delete(Reply.messageID);
    } catch (err) {
      console.error("Answer error:", err);
      const errorMsg = err.response?.data?.error || err.message || "Erreur inconnue";
      message.reply(`⚠️ Erreur lors du traitement de votre réponse : ${errorMsg}`);
    }
  },

  envConfig: {
    reward: 10000,
    achievementReward: 50000,
    streakReward: 1000,
    flagReward: 12000,
    animeReward: 15000,
    dailyChallengeBonus: 20000,
    hardDifficultyReward: 15000,
    easyDifficultyReward: 7500
  }
};