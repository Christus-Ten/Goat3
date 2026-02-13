const axios = require('axios');

module.exports = {
  config: {
    name: "tempmail",
    aliases: ["tm"],
    version: "5.0",
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
`âœ‰ï¸ TEMP-MAIL PRO (FULL BODY)
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
âžœ tm gen (Cost: 100 Coins)
âžœ tm check <email> (Free)

ðŸ’° Your Balance: ${balance} Coins`,
          threadID,
          messageID
        );
      }

      const configRes = await axios.get(JSON_URL);
      const API_BASE = configRes?.data?.tm;

      if (!API_BASE) return api.sendMessage("âŒ API Config not found in JSON.", threadID, messageID);

      if (action === "gen") {
        if (balance < 100) {
          return api.sendMessage(`âŒ Coins dorkar: 100\nYour Balance: ${balance}`, threadID, messageID);
        }

        const res = await axios.get(`${API_BASE}/gen`);
        if (!res.data.status) return api.sendMessage("âŒ API Error: Mail create kora jachche na.", threadID, messageID);

        await usersData.set(senderID, { ...userData, money: balance - 100 });

        return api.sendMessage(
`âœ… EMAIL GENERATED
ðŸ“§ Address: ${res.data.email}
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
ðŸ’¸ -100 Coins (Success!)
ðŸ’¡ Tip: Use 'tm check ${res.data.email}' for inbox msg.`,
          threadID,
          messageID
        );
      }

      if (action === "check") {
        const email = args[1];
        if (!email) return api.sendMessage("âš ï¸ Please provide the email address.", threadID, messageID);

        const res = await axios.get(`${API_BASE}/check?email=${encodeURIComponent(email)}`);
        
        if (!res.data.status) {
          return api.sendMessage(`ðŸ“¥ Inbox empty for:\n${email}`, threadID, messageID);
        }

        const messages = res.data.messages || [];
        if (messages.length === 0) {
          return api.sendMessage(`ðŸ“¥ Inbox is empty (0 messages).`, threadID, messageID);
        }

        let text = `ðŸ“© INBOX - ${email}\nTotal: ${messages.length}\n`;

        messages.forEach((m, i) => {

          const cleanBody = (m.body || "No content found").replace(/<\/?[^>]+(>|$)/g, "").trim();

          text += `\nâ”â”â”â”â”â”â”â”â”â”â”â”â”â”â”\n`;
          text += `#ï¸âƒ£ ${i + 1}\n`;
          text += `ðŸ‘¤ From: ${m.from.name || "Unknown"} (${m.from.address})\n`;
          text += `ðŸ“ Sub: ${m.subject || "No Subject"}\n`;
          text += `âœ‰ï¸ Message: ${cleanBody}\n`;
        });

        return api.sendMessage(text, threadID, messageID);
      }

      return api.sendMessage("âš ï¸ Invalid usage! Use 'tm gen' or 'tm check <email>'", threadID, messageID);

    } catch (err) {
      console.error("TM ERROR:", err.message);
      return api.sendMessage(`âŒ Error: ${err.message}`, threadID, messageID);
    }
  }
};
