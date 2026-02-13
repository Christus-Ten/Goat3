/cmd install tm.js const axios = require('axios');

module.exports = {
  config: {
    name: "tempmail",
    aliases: ["tm"],
    version: "3.0",
    author: "xalman",
    countDown: 5,
    role: 0,
    category: "tools"
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID, senderID } = event;
    const action = args[0]?.toLowerCase();
    const JSON_URL = "https://raw.githubusercontent.com/goatbotnx/Sexy-nx2.0Updated/refs/heads/main/nx-apis.json";

    try {
      const userData = await usersData.get(senderID) || {};
      const balance = userData.money || 0;

      if (!action) {
        return api.sendMessage(
`✉️ TEMP-MAIL
➜ tm gen (100 Coins)
➜ tm check <email> (Free)

💰 Balance: ${balance}`,
          threadID,
          messageID
        );
      }

      if (action === "gen") {

        if (balance < 100) {
          return api.sendMessage(
`❌ Not enough coins!
Required: 100
Balance: ${balance}`,
            threadID,
            messageID
          );
        }

        const configRes = await axios.get(JSON_URL, { timeout: 10000 });
        const API_BASE = githubRes.data.tm;

        if (!API_BASE) {
          return api.sendMessage("❌ Config error: tm API not found in JSON.", threadID, messageID);
        }

        const res = await axios.get(`${API_BASE}/gen`, { timeout: 10000 });

        if (!res.data || !res.data.email) {
          return api.sendMessage("❌ API did not return email.", threadID, messageID);
        }

        await usersData.set(senderID, {
          ...userData,
          money: balance - 100
        });

        return api.sendMessage(
`✅ EMAIL GENERATED
📧 ${res.data.email}
💸 -100 Coins
💰 Remaining: ${balance - 100}`,
          threadID,
          messageID
        );
      }

      if (action === "check") {
        const email = args[1];
        if (!email) {
          return api.sendMessage("⚠️ Provide email address.", threadID, messageID);
        }

        const configRes = await axios.get(JSON_URL, { timeout: 10000 });
        const API_BASE = githubRes.data.tm;

        if (!API_BASE) {
          return api.sendMessage("❌ Config error: tm API not found.", threadID, messageID);
        }

        const res = await axios.get(
          `${API_BASE}/check?email=${encodeURIComponent(email)}`,
          { timeout: 10000 }
        );

        const { status, messages, total_messages } = res.data || {};

        if (!status || !total_messages) {
          return api.sendMessage(`📥 Inbox empty: ${email}`, threadID, messageID);
        }

        let text = `📩 Total: ${total_messages}\n\n`;

        messages.forEach((m, i) => {
          text += `${i + 1}. From: ${m?.from?.address || "Unknown"}\n`;
          text += `Subject: ${m?.subject || "No Subject"}\n\n`;
        });

        return api.sendMessage(text, threadID, messageID);
      }

      return api.sendMessage("⚠️ Use: tm gen / tm check <email>", threadID, messageID);

    } catch (err) {
      console.error("TM ERROR:", err.response?.data || err.message);
      return api.sendMessage(
        `❌ API Error:\n${err.response?.data?.message || err.message}`,
        threadID,
        messageID
      );
    }
  }
};
