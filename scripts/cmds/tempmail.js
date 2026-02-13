const axios = require('axios');

module.exports = {
  config: {
    name: "tempmail",
    aliases: ["tm"],
    version: "3.2",
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
`✉️ TEMP-MAIL MANAGER
━━━━━━━━━━━━━━━
➜ tempmail gen (Cost: 100 Coins)
➜ tempmail check <email> (Free)

💰 Your Balance: ${balance} Coins`,
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

        const configRes = await axios.get(JSON_URL);
        const API_BASE = configRes?.data?.tm;

        if (!API_BASE) {
          return api.sendMessage("❌ API Config not found.", threadID, messageID);
        }

        const res = await axios.get(`${API_BASE}/gen`);

        if (!res.data || !res.data.email) {
          return api.sendMessage("❌ Failed to generate email.", threadID, messageID);
        }

        await usersData.set(senderID, {
          ...userData,
          money: balance - 100
        });

        return api.sendMessage(
`✅ EMAIL GENERATED
📧 Address: ${res.data.email}
━━━━━━━━━━━━━━━
/tempmail check <email>
💸 Cost: 100 Coins
💰 Remaining: ${balance - 100}`,
          threadID,
          messageID
        );
      }

      if (action === "check") {
        const email = args[1];
        if (!email) {
          return api.sendMessage("⚠️ Please provide the email to check.\nExample: tm check abc@xyz.com", threadID, messageID);
        }

        const configRes = await axios.get(JSON_URL);
        const API_BASE = configRes.data.tm;

        if (!API_BASE) {
          return api.sendMessage("❌ API Config not found.", threadID, messageID);
        }

        const res = await axios.get(`${API_BASE}/check?email=${encodeURIComponent(email)}`);
        const messages = res.data.messages || [];

        if (messages.length === 0) {
          return api.sendMessage(`📥 Inbox is empty for:\n${email}`, threadID, messageID);
        }

        let text = `📩 INBOX - Total: ${messages.length}\n`;

        messages.forEach((m, i) => {

          const mailContent = m.intro || m.text || "No content preview available.";
          
          text += `\n━━━━━━━━━━━━━━━\n`;
          text += `#️⃣ ${i + 1}\n`;
          text += `👤 From: ${m?.from?.address || "Unknown"}\n`;
          text += `📝 Sub: ${m?.subject || "No Subject"}\n`;
          text += `✉️ Content: ${mailContent}\n`;
        });

        return api.sendMessage(text, threadID, messageID);
      }

      return api.sendMessage("⚠️ Invalid command. Use 'tm gen' or 'tm check <email>'", threadID, messageID);

    } catch (err) {
      console.error("TM ERROR:", err.message);
      return api.sendMessage(`❌ Error: ${err.message}`, threadID, messageID);
    }
  }
};
