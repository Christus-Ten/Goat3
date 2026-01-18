!cmd install catbox.js module.exports = {
    config: {
        name: "catbox",
        aliases: ["cb"],
        version: "5.5",
        author: "xalman",
        countDown: 5,
        role: 0,
        category: "media",
        guide: { en: "{pn} [reply]" }
    },

    onStart: async function ({ event, api, message }) {
        const axios = require("axios");
        const fs = require("fs-extra");
        const FormData = require("form-data");
        const path = require("path");

        const { messageReply, messageID } = event;
        if (!messageReply || !messageReply.attachments[0]) {
            return message.reply("⚠️ Media reply koro age!");
        }

        const nx_media = messageReply.attachments[0];
        const nx_ext = nx_media.type === "video" ? ".mp4" : (nx_media.type === "animated_image" ? ".gif" : ".jpg");
        const nx_temp_name = `xalman_nx_${Date.now()}${nx_ext}`;
        const nx_path = path.join(__dirname, nx_temp_name);

        api.setMessageReaction("⏳", messageID, () => {}, true);

        try {
            const nx_api_config = await axios.get("https://raw.githubusercontent.com/goatbotnx/Sexy-nx2.0Updated/refs/heads/main/nx-apis.json");
            let nx_target = nx_api_config.data.catbox || "https://catbox.moe/user/api.php";
            if (!nx_target.endsWith('/upload')) nx_target = nx_target.replace(/\/$/, "") + "/upload";

            const nx_input = await axios.get(nx_media.url, { responseType: "stream" });
            const nx_output = fs.createWriteStream(nx_path);
            nx_input.data.pipe(nx_output);

            await new Promise((resolve, reject) => {
                nx_output.on("finish", resolve);
                nx_output.on("error", reject);
            });

            const nx_body = new FormData();
            nx_body.append("fileToUpload", fs.createReadStream(nx_path), { filename: nx_temp_name });

            const { data } = await axios.post(nx_target, nx_body, {
                headers: { ...nx_body.getHeaders(), "User-Agent": "Mozilla/5.0" }
            });

            if (fs.existsSync(nx_path)) fs.unlinkSync(nx_path);
            
            api.setMessageReaction("✅", messageID, () => {}, true);
            return message.reply(data);

        } catch (nx_err) {
            if (fs.existsSync(nx_path)) fs.unlinkSync(nx_path);
            api.setMessageReaction("❌", messageID, () => {}, true);
            return message.reply("Error: " + nx_err.message);
        }
    }
};
