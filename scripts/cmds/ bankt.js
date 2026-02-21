const axios = require("axios");
const fs = require("fs-extra");
const fonts = require('../../func/fonts.js');

let createCanvas, loadImage, registerFont;
let canvasAvailable = false;
try {
        const canvas = require("canvas");
        createCanvas = canvas.createCanvas;
        loadImage = canvas.loadImage;
        registerFont = canvas.registerFont;
        canvasAvailable = true;
        console.log("✅ [BANK] Canvas loaded successfully - cards will be generated");
} catch (err) {
        console.log("❌ [BANK] Canvas not available - using text-only cards. Error:", err.message);
        canvasAvailable = false;
}

// Fonctions utilitaires
function generateCardNumber() {
        const firstPart = Math.floor(1000 + Math.random() * 9000);
        const secondPart = Math.floor(1000 + Math.random() * 9000);
        const thirdPart = Math.floor(1000 + Math.random() * 9000);
        const fourthPart = Math.floor(1000 + Math.random() * 9000);
        return `${firstPart}-${secondPart}-${thirdPart}-${fourthPart}`;
}

function generateTransactionID() {
        return `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

function calculateInterest(amount, rate, days) {
        return Math.floor(amount * (rate / 100) * (days / 365));
}

function getWealthTier(balance) {
        if (balance >= 1000000) return { tier: "💎 Billionaire", multiplier: 3.0, color: "#FFD700" };
        if (balance >= 500000) return { tier: "🏆 Millionaire", multiplier: 2.5, color: "#C0C0C0" };
        if (balance >= 100000) return { tier: "💰 Tycoon", multiplier: 2.0, color: "#CD7F32" };
        if (balance >= 50000) return { tier: "💼 Investor", multiplier: 1.5, color: "#4CAF50" };
        if (balance >= 10000) return { tier: "📈 Trader", multiplier: 1.2, color: "#2196F3" };
        return { tier: "🔰 Beginner", multiplier: 1.0, color: "#9E9E9E" };
}

// Données du marché
const marketData = {
        stocks: {
                "AAPL": { name: "Apple Inc.", price: 175.50, change: 2.1, volatility: 0.15 },
                "GOOGL": { name: "Alphabet Inc.", price: 2800.75, change: 1.8, volatility: 0.12 },
                "TSLA": { name: "Tesla Inc.", price: 850.25, change: -0.5, volatility: 0.25 },
                "MSFT": { name: "Microsoft", price: 420.30, change: 1.2, volatility: 0.10 },
                "AMZN": { name: "Amazon", price: 3300.50, change: 0.8, volatility: 0.18 },
                "META": { name: "Meta", price: 325.80, change: 2.5, volatility: 0.22 }
        },
        crypto: {
                "BTC": { name: "Bitcoin", price: 45000, change: 3.2, volatility: 0.35 },
                "ETH": { name: "Ethereum", price: 3200, change: 2.8, volatility: 0.30 },
                "BNB": { name: "Binance Coin", price: 400, change: 1.5, volatility: 0.28 },
                "SOL": { name: "Solana", price: 120, change: 3.8, volatility: 0.40 },
                "ADA": { name: "Cardano", price: 1.20, change: 4.1, volatility: 0.32 },
                "DOT": { name: "Polkadot", price: 25.50, change: 2.3, volatility: 0.33 }
        },
        businesses: {
                "CAFE": { name: "Coffee Shop", cost: 50000, income: 5000, employees: 3 },
                "RESTAURANT": { name: "Restaurant", cost: 150000, income: 15000, employees: 8 },
                "TECH": { name: "Tech Startup", cost: 500000, income: 50000, employees: 15 },
                "HOTEL": { name: "Hotel", cost: 2000000, income: 200000, employees: 50 },
                "MALL": { name: "Shopping Mall", cost: 5000000, income: 500000, employees: 200 }
        }
};

// Fonction de création de carte bancaire
async function createBankCard(userData, balance, cardNumber, userID, stats = {}) {
        if (!canvasAvailable) return null;

        try {
                const canvas = createCanvas(1000, 630);
                const ctx = canvas.getContext("2d");

                // Fond avec dégradé
                roundRect(ctx, 0, 0, 1000, 630, 30);
                ctx.clip();

                const gradient = ctx.createLinearGradient(0, 0, 1000, 630);
                gradient.addColorStop(0, "#0f0c29");
                gradient.addColorStop(0.5, "#302b63");
                gradient.addColorStop(1, "#24243e");
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 1000, 630);

                // Effets de particules
                for (let i = 0; i < 30; i++) {
                        const x = Math.random() * 1000;
                        const y = Math.random() * 630;
                        const radius = Math.random() * 100 + 50;
                        const innerGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                        innerGradient.addColorStop(0, `rgba(138, 43, 226, ${Math.random() * 0.15})`);
                        innerGradient.addColorStop(1, "rgba(138, 43, 226, 0)");
                        ctx.fillStyle = innerGradient;
                        ctx.beginPath();
                        ctx.arc(x, y, radius, 0, Math.PI * 2);
                        ctx.fill();
                }

                // Bordures dorées
                ctx.shadowColor = "rgba(255, 215, 0, 0.5)";
                ctx.shadowBlur = 40;
                roundRect(ctx, 20, 20, 960, 590, 20);
                ctx.strokeStyle = "rgba(255, 215, 0, 0.4)";
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Puce dorée
                const chipGradient = ctx.createRadialGradient(130, 110, 10, 130, 110, 50);
                chipGradient.addColorStop(0, "#FFE55C");
                chipGradient.addColorStop(0.5, "#FFD700");
                chipGradient.addColorStop(1, "#B8860B");
                ctx.fillStyle = chipGradient;
                ctx.beginPath();
                ctx.arc(130, 110, 50, 0, Math.PI * 2);
                ctx.fill();

                // Titre
                ctx.font = "bold 48px Arial";
                ctx.fillStyle = "#FFFFFF";
                ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                ctx.shadowBlur = 10;
                ctx.fillText("GOAT PREMIUM BANK", 50, 250);
                ctx.shadowBlur = 0;

                // Numéro de carte
                ctx.font = "bold 42px 'Courier New'";
                const cardParts = cardNumber.split("-");
                const maskedCard = `****  ****  ****  ${cardParts[3]}`;
                
                ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
                ctx.shadowBlur = 5;
                ctx.fillStyle = "#FFFFFF";
                ctx.fillText(maskedCard, 50, 360);
                ctx.shadowBlur = 0;

                // Nom du titulaire
                ctx.font = "20px Arial";
                ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                ctx.fillText("CARD HOLDER", 50, 440);
                ctx.font = "bold 32px Arial";
                ctx.fillStyle = "#FFFFFF";
                const displayName = userData.name.toUpperCase();
                const truncatedName = displayName.length > 25 ? displayName.substring(0, 22) + "..." : displayName;
                ctx.fillText(truncatedName, 50, 480);

                // Date d'expiration
                ctx.font = "20px Arial";
                ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                ctx.fillText("VALID THRU", 520, 440);
                ctx.font = "bold 26px Arial";
                ctx.fillStyle = "#FFFFFF";
                const expiryDate = new Date();
                expiryDate.setFullYear(expiryDate.getFullYear() + 3);
                const month = String(expiryDate.getMonth() + 1).padStart(2, "0");
                const year = String(expiryDate.getFullYear()).slice(-2);
                ctx.fillText(`${month}/${year}`, 520, 480);

                // Solde
                ctx.font = "20px Arial";
                ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                ctx.fillText("BALANCE", 50, 545);
                ctx.font = "bold 44px Arial";
                const balanceGradient = ctx.createLinearGradient(50, 565, 400, 565);
                balanceGradient.addColorStop(0, "#FFD700");
                balanceGradient.addColorStop(0.5, "#FFA500");
                balanceGradient.addColorStop(1, "#FFD700");
                ctx.fillStyle = balanceGradient;
                ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
                ctx.shadowBlur = 20;
                ctx.fillText(`$${balance.toLocaleString()}`, 50, 590);
                ctx.shadowBlur = 0;

                // Stats supplémentaires
                if (stats.creditScore) {
                        ctx.font = "16px Arial";
                        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                        ctx.fillText(`Credit: ${stats.creditScore}`, 750, 500);
                }

                if (stats.tier) {
                        ctx.font = "16px Arial";
                        ctx.fillStyle = stats.color || "#FFD700";
                        ctx.fillText(stats.tier, 750, 530);
                }

                // Signature
                ctx.font = "italic 18px Arial";
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                ctx.fillText("Powered by GoatBank", 750, 590);

                const buffer = canvas.toBuffer();
                const tempPath = `./tmp/bank_card_${Date.now()}.png`;
                await fs.outputFile(tempPath, buffer);
                return fs.createReadStream(tempPath);
        } catch (error) {
                console.error("Canvas error:", error.message);
                throw error;
        }
}

function roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
}

module.exports = {
        config: {
                name: "bank",
                version: "5.0.0",
                author: "Christus",
                countDown: 5,
                role: 0,
                description: {
                        en: "Ultimate banking system with investments, businesses, and premium features"
                },
                category: "economy",
                guide: {
                        en: "   {pn} help - Show all commands"
                }
        },

        langs: {
                en: {
                        notRegistered: fonts.bold("❌ You don't have a bank account! Use {pn} register to create one."),
                        registered: fonts.bold("✅ Bank account created successfully!\n💳 Card Number: %1\n💰 Initial Balance: $0\n🎁 Welcome Bonus: $1000 added!\n\nUse {pn} balance to view your premium card!"),
                        alreadyRegistered: fonts.bold("❌ You already have a bank account!\n💳 Card Number: %1"),
                        invalidAmount: fonts.bold("❌ Please enter a valid amount!"),
                        insufficientBank: fonts.bold("❌ Insufficient bank balance! Your balance: $%1"),
                        insufficientWallet: fonts.bold("❌ Insufficient wallet balance! Your balance: $%1"),
                        depositSuccess: fonts.bold("✅ Successfully deposited $%1 to your bank account!\n💳 Transaction ID: %2\n💰 New Bank Balance: $%3"),
                        withdrawSuccess: fonts.bold("✅ Successfully withdrew $%1 from your bank account!\n💳 Transaction ID: %2\n💰 New Bank Balance: $%3"),
                        transferSuccess: fonts.bold("✅ Successfully transferred $%1 to %2!\n💳 Transaction ID: %3\n💰 Your New Balance: $%4"),
                        transferReceived: fonts.bold("💰 You received $%1 from %2!\n💳 Transaction ID: %3"),
                        cannotTransferSelf: fonts.bold("❌ You cannot transfer money to yourself!"),
                        targetNotRegistered: fonts.bold("❌ Target user doesn't have a bank account!"),
                        noTarget: fonts.bold("❌ Please mention or provide user ID to transfer!"),
                        maxLoan: fonts.bold("❌ Maximum loan amount is $5000!"),
                        loanTaken: fonts.bold("✅ Loan approved!\n💵 Amount: $%1\n📈 Interest (10%%): $%2\n💰 Total to repay: $%3\n💳 Transaction ID: %4"),
                        loanExists: fonts.bold("❌ You already have an active loan of $%1!\nPay it back first using {pn} payloan"),
                        loanPaid: fonts.bold("✅ Loan payment successful!\n💵 Paid: $%1\n💰 Remaining: $%2"),
                        noLoan: fonts.bold("✅ You don't have any active loans!"),
                        noTransactions: fonts.bold("📋 No transaction history found."),
                        transactionHistory: fonts.bold("📋 Transaction History (Last 10):\n\n%1"),
                        dailyReward: fonts.bold("🎁 Daily Reward Collected!\n💰 Amount: $%1\n🔥 Streak: %2 days\n🎯 Bonus: $%3"),
                        dailyCooldown: fonts.bold("⏰ Daily reward already claimed!\nNext reward in: %1h %2m"),
                        workComplete: fonts.bold("💼 Work Completed!\nJob: %1\n💰 Earnings: $%2\n⭐ Skill Increased: +1"),
                        workCooldown: fonts.bold("⏰ You're tired! Rest for: %1h %2m"),
                        achievementUnlock: fonts.bold("🏆 Achievement Unlocked: %1!\n💰 Bonus: $%2"),
                }
        },

        onStart: async function ({ args, message, event, usersData, getLang, commandName }) {
                const { senderID, threadID } = event;
                const userData = await usersData.get(senderID);

                // Initialisation des données bancaires
                if (!userData.data.bank) {
                        userData.data.bank = {
                                cardNumber: null,
                                balance: 0,
                                savings: 0,
                                vault: 0,
                                loan: 0,
                                creditScore: 700,
                                transactions: [],
                                stocks: {},
                                crypto: {},
                                businesses: [],
                                dailyStreak: 0,
                                lastDaily: null,
                                lastWork: null,
                                achievements: [],
                                premium: false,
                                multiplier: 1.0,
                                reputation: 0
                        };
                }

                const action = args[0]?.toLowerCase();
                const prefix = global.utils.getPrefix(threadID);

                // Menu principal
                if (!action || action === "help") {
                        const tier = getWealthTier(userData.data.bank.balance);
                        
                        return message.reply(fonts.bold(
                                `🏦 𝐂𝐇𝐑𝐈𝐒𝐓𝐔𝐒 𝐁𝐀𝐍𝐊 𝐕5 - Ultimate Banking System\n` +
                                `━━━━━━━━━━━━━━━━━━━━━━\n` +
                                `👤 User: ${userData.name}\n` +
                                `🏅 Tier: ${tier.tier}\n` +
                                `💳 Balance: $${userData.data.bank.balance.toLocaleString()}\n` +
                                `📊 Credit: ${userData.data.bank.creditScore}/850\n` +
                                `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                                
                                `💰 𝐁𝐀𝐒𝐈𝐂 𝐁𝐀𝐍𝐊𝐈𝐍𝐆\n` +
                                `• ${prefix}${commandName} register - Create account (+$1000)\n` +
                                `• ${prefix}${commandName} balance - View card\n` +
                                `• ${prefix}${commandName} deposit <amount> - Deposit money\n` +
                                `• ${prefix}${commandName} withdraw <amount> - Withdraw money\n` +
                                `• ${prefix}${commandName} transfer <@user> <amount> - Send money\n` +
                                `• ${prefix}${commandName} transactions - View history\n` +
                                `• ${prefix}${commandName} daily - Daily reward\n` +
                                `• ${prefix}${commandName} work - Work for money\n\n` +
                                
                                `💎 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐅𝐄𝐀𝐓𝐔𝐑𝐄𝐒\n` +
                                `• ${prefix}${commandName} savings <amount> - Savings account (3%)\n` +
                                `• ${prefix}${commandName} vault <amount> - Secure vault (1%)\n` +
                                `• ${prefix}${commandName} credit - Check credit score\n` +
                                `• ${prefix}${commandName} achievements - View achievements\n\n` +
                                
                                `📈 𝐈𝐍𝐕𝐄𝐒𝐓𝐌𝐄𝐍𝐓𝐒\n` +
                                `• ${prefix}${commandName} stocks [list/buy/sell] - Stock market\n` +
                                `• ${prefix}${commandName} crypto [list/buy/sell] - Crypto trading\n` +
                                `• ${prefix}${commandName} portfolio - View investments\n\n` +
                                
                                `🏢 𝐁𝐔𝐒𝐈𝐍𝐄𝐒𝐒\n` +
                                `• ${prefix}${commandName} businesses - View opportunities\n` +
                                `• ${prefix}${commandName} buy <business> - Start business\n` +
                                `• ${prefix}${commandName} collect - Collect business income\n\n` +
                                
                                `🎰 𝐋𝐎𝐀𝐍 & 𝐑𝐄𝐖𝐀𝐑𝐃𝐒\n` +
                                `• ${prefix}${commandName} loan <amount> - Take loan (max $5000)\n` +
                                `• ${prefix}${commandName} payloan <amount> - Repay loan\n` +
                                `━━━━━━━━━━━━━━━━━━━━━━`
                        ));
                }

                // Vérification inscription
                if (action !== "register" && !userData.data.bank.cardNumber) {
                        return message.reply(getLang("notRegistered").replace("{pn}", prefix + commandName));
                }

                switch (action) {
                        case "register": {
                                if (userData.data.bank.cardNumber) {
                                        return message.reply(getLang("alreadyRegistered", userData.data.bank.cardNumber));
                                }
                                const cardNumber = generateCardNumber();
                                userData.data.bank.cardNumber = cardNumber;
                                userData.data.bank.balance = 1000; // Welcome bonus
                                userData.data.bank.transactions = [];
                                userData.data.bank.loan = 0;
                                userData.data.bank.achievements = ["First Account"];
                                
                                await usersData.set(senderID, userData.data, "data");
                                return message.reply(getLang("registered", cardNumber));
                        }

                        case "balance":
                        case "bal": {
                                const tier = getWealthTier(userData.data.bank.balance);
                                const stats = {
                                        creditScore: userData.data.bank.creditScore,
                                        tier: tier.tier,
                                        color: tier.color
                                };

                                // Essayer de générer une carte graphique
                                try {
                                        const cardImage = await createBankCard(
                                                userData, 
                                                userData.data.bank.balance, 
                                                userData.data.bank.cardNumber, 
                                                senderID,
                                                stats
                                        );
                                        
                                        if (cardImage) {
                                                const tempPath = cardImage.path;
                                                cardImage.on('end', () => fs.unlink(tempPath).catch(() => {}));
                                                return message.reply({ attachment: cardImage });
                                        }
                                } catch (err) {
                                        console.error("Card generation error:", err);
                                }

                                // Fallback texte
                                const maskedCard = userData.data.bank.cardNumber.replace(/(\d{4})-(\d{4})-(\d{4})-(\d{4})/, "****-****-****-$4");
                                return message.reply(fonts.bold(
                                        `💳 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐁𝐀𝐍𝐊 𝐂𝐀𝐑𝐃\n` +
                                        `━━━━━━━━━━━━━━━━━━━━━━\n` +
                                        `👤 Holder: ${userData.name}\n` +
                                        `🔢 Card: ${maskedCard}\n` +
                                        `💰 Balance: $${userData.data.bank.balance.toLocaleString()}\n` +
                                        `🏅 Tier: ${tier.tier} (${tier.multiplier}x earnings)\n` +
                                        `📊 Credit: ${userData.data.bank.creditScore}/850\n` +
                                        `🏛️ Savings: $${userData.data.bank.savings.toLocaleString()}\n` +
                                        `🔐 Vault: $${userData.data.bank.vault.toLocaleString()}\n` +
                                        `${userData.data.bank.loan > 0 ? `⚠️ Loan: $${userData.data.bank.loan.toLocaleString()}\n` : ''}` +
                                        `━━━━━━━━━━━━━━━━━━━━━━`
                                ));
                        }

                        case "deposit": {
                                const amount = parseInt(args[1]);
                                if (isNaN(amount) || amount <= 0) return message.reply(getLang("invalidAmount"));
                                if (userData.money < amount) return message.reply(getLang("insufficientWallet", userData.money.toLocaleString()));

                                userData.money -= amount;
                                userData.data.bank.balance += amount;
                                const txnID = generateTransactionID();
                                
                                userData.data.bank.transactions.unshift({
                                        type: "deposit",
                                        amount: amount,
                                        txnID: txnID,
                                        date: new Date().toISOString()
                                });

                                // Vérifier les achievements
                                if (amount >= 10000 && !userData.data.bank.achievements.includes("Big Saver")) {
                                        userData.data.bank.achievements.push("Big Saver");
                                        message.reply(getLang("achievementUnlock", "Big Saver", "500"));
                                        userData.data.bank.balance += 500;
                                }

                                await usersData.set(senderID, {
                                        money: userData.money,
                                        data: userData.data
                                });

                                return message.reply(getLang("depositSuccess", 
                                        amount.toLocaleString(), txnID, userData.data.bank.balance.toLocaleString()));
                        }

                        case "withdraw": {
                                const amount = parseInt(args[1]);
                                if (isNaN(amount) || amount <= 0) return message.reply(getLang("invalidAmount"));
                                if (userData.data.bank.balance < amount) {
                                        return message.reply(getLang("insufficientBank", userData.data.bank.balance.toLocaleString()));
                                }

                                userData.money += amount;
                                userData.data.bank.balance -= amount;
                                const txnID = generateTransactionID();
                                
                                userData.data.bank.transactions.unshift({
                                        type: "withdrawal",
                                        amount: amount,
                                        txnID: txnID,
                                        date: new Date().toISOString()
                                });

                                await usersData.set(senderID, {
                                        money: userData.money,
                                        data: userData.data
                                });

                                return message.reply(getLang("withdrawSuccess", 
                                        amount.toLocaleString(), txnID, userData.data.bank.balance.toLocaleString()));
                        }

                        case "transfer": {
                                let targetID = Object.keys(event.mentions)[0];
                                let amountArg;

                                if (targetID) {
                                        amountArg = args[1];
                                } else if (args[1]) {
                                        targetID = args[1];
                                        amountArg = args[2];
                                }

                                if (!targetID) return message.reply(getLang("noTarget"));
                                if (targetID == senderID) return message.reply(getLang("cannotTransferSelf"));

                                const amount = parseInt(amountArg);
                                if (isNaN(amount) || amount <= 0) return message.reply(getLang("invalidAmount"));
                                if (userData.data.bank.balance < amount) {
                                        return message.reply(getLang("insufficientBank", userData.data.bank.balance.toLocaleString()));
                                }

                                const targetData = await usersData.get(targetID);
                                if (!targetData.data.bank?.cardNumber) {
                                        return message.reply(getLang("targetNotRegistered"));
                                }

                                // Transfert
                                userData.data.bank.balance -= amount;
                                targetData.data.bank.balance += amount;
                                const txnID = generateTransactionID();

                                // Transactions
                                userData.data.bank.transactions.unshift({
                                        type: "transfer_sent",
                                        amount: amount,
                                        to: targetData.name,
                                        toID: targetID,
                                        txnID: txnID,
                                        date: new Date().toISOString()
                                });

                                targetData.data.bank.transactions.unshift({
                                        type: "transfer_received",
                                        amount: amount,
                                        from: userData.name,
                                        fromID: senderID,
                                        txnID: txnID,
                                        date: new Date().toISOString()
                                });

                                // Augmenter credit score
                                userData.data.bank.creditScore = Math.min(850, userData.data.bank.creditScore + 1);
                                targetData.data.bank.creditScore = Math.min(850, targetData.data.bank.creditScore + 1);

                                await usersData.set(senderID, userData.data, "data");
                                await usersData.set(targetID, targetData.data, "data");

                                message.reply(getLang("transferSuccess", 
                                        amount.toLocaleString(), targetData.name, txnID, userData.data.bank.balance.toLocaleString()));

                                // Notifier le receveur
                                global.GoatBot.onReply.set(message.messageID, {
                                        commandName,
                                        messageID: message.messageID,
                                        author: targetID,
                                        txnID: txnID,
                                        amount: amount,
                                        from: userData.name
                                });

                                return;
                        }

                        case "loan": {
                                if (userData.data.bank.loan > 0) {
                                        return message.reply(getLang("loanExists", userData.data.bank.loan.toLocaleString())
                                                .replace("{pn}", prefix + commandName));
                                }

                                const amount = parseInt(args[1]);
                                if (isNaN(amount) || amount <= 0) return message.reply(getLang("invalidAmount"));
                                if (amount > 5000) return message.reply(getLang("maxLoan"));

                                const interest = Math.floor(amount * 0.1);
                                const totalLoan = amount + interest;

                                userData.data.bank.balance += amount;
                                userData.data.bank.loan = totalLoan;
                                const txnID = generateTransactionID();

                                userData.data.bank.transactions.unshift({
                                        type: "loan",
                                        amount: amount,
                                        interest: interest,
                                        total: totalLoan,
                                        txnID: txnID,
                                        date: new Date().toISOString()
                                });

                                // Achievement pour premier prêt
                                if (!userData.data.bank.achievements.includes("First Loan")) {
                                        userData.data.bank.achievements.push("First Loan");
                                        message.reply(getLang("achievementUnlock", "First Loan", "200"));
                                }

                                await usersData.set(senderID, userData.data, "data");
                                return message.reply(getLang("loanTaken", 
                                        amount.toLocaleString(), interest.toLocaleString(), totalLoan.toLocaleString(), txnID));
                        }

                        case "payloan": {
                                if (userData.data.bank.loan <= 0) return message.reply(getLang("noLoan"));

                                const amount = parseInt(args[1]);
                                if (isNaN(amount) || amount <= 0) return message.reply(getLang("invalidAmount"));
                                if (userData.data.bank.balance < amount) {
                                        return message.reply(getLang("insufficientBank", userData.data.bank.balance.toLocaleString()));
                                }

                                const payAmount = Math.min(amount, userData.data.bank.loan);
                                userData.data.bank.balance -= payAmount;
                                userData.data.bank.loan -= payAmount;
                                const txnID = generateTransactionID();

                                userData.data.bank.transactions.unshift({
                                        type: "loan_payment",
                                        amount: payAmount,
                                        txnID: txnID,
                                        date: new Date().toISOString()
                                });

                                // Bonus credit score si loan fully paid
                                if (userData.data.bank.loan === 0) {
                                        userData.data.bank.creditScore += 10;
                                        if (!userData.data.bank.achievements.includes("Debt Free")) {
                                                userData.data.bank.achievements.push("Debt Free");
                                                message.reply(getLang("achievementUnlock", "Debt Free", "500"));
                                        }
                                }

                                await usersData.set(senderID, userData.data, "data");
                                return message.reply(getLang("loanPaid", 
                                        payAmount.toLocaleString(), userData.data.bank.loan.toLocaleString()));
                        }

                        case "savings": {
                                const amount = parseInt(args[1]);
                                if (!amount || amount <= 0) {
                                        return message.reply(fonts.bold(
                                                `🏛️ 𝐒𝐀𝐕𝐈𝐍𝐆𝐒 𝐀𝐂𝐂𝐎𝐔𝐍𝐓\n` +
                                                `━━━━━━━━━━━━━━━━━━━━━━\n` +
                                                `Current Savings: $${userData.data.bank.savings.toLocaleString()}\n` +
                                                `Interest Rate: 3% monthly\n\n` +
                                                `Usage: ${prefix}${commandName} savings <amount>\n` +
                                                `Example: ${prefix}${commandName} savings 5000`
                                        ));
                                }

                                if (userData.data.bank.balance < amount) {
                                        return message.reply(getLang("insufficientBank", userData.data.bank.balance.toLocaleString()));
                                }

                                userData.data.bank.balance -= amount;
                                userData.data.bank.savings += amount;

                                userData.data.bank.transactions.unshift({
                                        type: "savings_deposit",
                                        amount: amount,
                                        date: new Date().toISOString()
                                });

                                if (userData.data.bank.savings >= 10000 && !userData.data.bank.achievements.includes("Savings Master")) {
                                        userData.data.bank.achievements.push("Savings Master");
                                        message.reply(getLang("achievementUnlock", "Savings Master", "1000"));
                                }

                                await usersData.set(senderID, userData.data, "data");
                                return message.reply(fonts.bold(`✅ Saved $${amount.toLocaleString()} in your savings account!\n📈 Interest Rate: 3% monthly`));
                        }

                        case "vault": {
                                const subAction = args[1]?.toLowerCase();
                                const amount = parseInt(args[2]);

                                if (!subAction || subAction === "info") {
                                        return message.reply(fonts.bold(
                                                `🔐 𝐒𝐄𝐂𝐔𝐑𝐄 𝐕𝐀𝐔𝐋𝐓\n` +
                                                `━━━━━━━━━━━━━━━━━━━━━━\n` +
                                                `Vault Balance: $${userData.data.bank.vault.toLocaleString()}\n` +
                                                `Interest Rate: 1% monthly\n` +
                                                `Protection: Theft-proof\n\n` +
                                                `Usage:\n` +
                                                `• ${prefix}${commandName} vault deposit <amount>\n` +
                                                `• ${prefix}${commandName} vault withdraw <amount>`
                                        ));
                                }

                                if (!amount || amount <= 0) return message.reply(getLang("invalidAmount"));

                                if (subAction === "deposit") {
                                        if (userData.data.bank.balance < amount) {
                                                return message.reply(getLang("insufficientBank", userData.data.bank.balance.toLocaleString()));
                                        }

                                        userData.data.bank.balance -= amount;
                                        userData.data.bank.vault += amount;

                                        userData.data.bank.transactions.unshift({
                                                type: "vault_deposit",
                                                amount: amount,
                                                date: new Date().toISOString()
                                        });

                                        await usersData.set(senderID, userData.data, "data");
                                        return message.reply(fonts.bold(`🔐 Deposited $${amount.toLocaleString()} to your secure vault!\n💰 Interest Rate: 1% monthly`));
                                }

                                if (subAction === "withdraw") {
                                        if (userData.data.bank.vault < amount) {
                                                return message.reply(fonts.bold(`❌ Insufficient vault balance! You have $${userData.data.bank.vault.toLocaleString()}`));
                                        }

                                        userData.data.bank.vault -= amount;
                                        userData.data.bank.balance += amount;

                                        userData.data.bank.transactions.unshift({
                                                type: "vault_withdrawal",
                                                amount: amount,
                                                date: new Date().toISOString()
                                        });

                                        await usersData.set(senderID, userData.data, "data");
                                        return message.reply(fonts.bold(`🔓 Withdrew $${amount.toLocaleString()} from your secure vault!`));
                                }
                                break;
                        }

                        case "stocks": {
                                const subAction = args[1]?.toLowerCase();

                                if (!subAction || subAction === "list") {
                                        let stockList = "";
                                        Object.entries(marketData.stocks).forEach(([symbol, data]) => {
                                                const changeEmoji = data.change >= 0 ? "📈" : "📉";
                                                stockList += `${changeEmoji} ${symbol}: $${data.price.toLocaleString()} (${data.change}%)\n`;
                                                stockList += `   ${data.name}\n\n`;
                                        });

                                        let portfolio = "";
                                        Object.entries(userData.data.bank.stocks).forEach(([symbol, shares]) => {
                                                const price = marketData.stocks[symbol]?.price || 0;
                                                const value = shares * price;
                                                portfolio += `• ${symbol}: ${shares} shares ($${value.toLocaleString()})\n`;
                                        });

                                        return message.reply(fonts.bold(
                                                `📈 𝐒𝐓𝐎𝐂𝐊 𝐌𝐀𝐑𝐊𝐄𝐓\n` +
                                                `━━━━━━━━━━━━━━━━━━━━━━\n\n${stockList}\n` +
                                                `📊 Your Portfolio:\n${portfolio || "None"}\n\n` +
                                                `Usage:\n` +
                                                `• ${prefix}${commandName} stocks buy <symbol> <shares>\n` +
                                                `• ${prefix}${commandName} stocks sell <symbol> <shares>`
                                        ));
                                }

                                const symbol = args[2]?.toUpperCase();
                                const shares = parseInt(args[3]);

                                if (!symbol || !marketData.stocks[symbol]) {
                                        return message.reply(fonts.bold("❌ Invalid stock symbol!"));
                                }

                                if (subAction === "buy") {
                                        if (!shares || shares <= 0) return message.reply(fonts.bold("❌ Please enter valid number of shares!"));
                                        
                                        const totalCost = marketData.stocks[symbol].price * shares;
                                        if (userData.data.bank.balance < totalCost) {
                                                return message.reply(getLang("insufficientBank", userData.data.bank.balance.toLocaleString()));
                                        }

                                        userData.data.bank.balance -= totalCost;
                                        if (!userData.data.bank.stocks[symbol]) userData.data.bank.stocks[symbol] = 0;
                                        userData.data.bank.stocks[symbol] += shares;

                                        userData.data.bank.transactions.unshift({
                                                type: "stock_buy",
                                                amount: totalCost,
                                                symbol: symbol,
                                                shares: shares,
                                                date: new Date().toISOString()
                                        });

                                        await usersData.set(senderID, userData.data, "data");
                                        return message.reply(fonts.bold(`✅ Bought ${shares} shares of ${symbol} for $${totalCost.toLocaleString()}!`));
                                }

                                if (subAction === "sell") {
                                        if (!shares || shares <= 0) return message.reply(fonts.bold("❌ Please enter valid number of shares!"));
                                        if (!userData.data.bank.stocks[symbol] || userData.data.bank.stocks[symbol] < shares) {
                                                return message.reply(fonts.bold("❌ You don't own enough shares!"));
                                        }

                                        const totalValue = marketData.stocks[symbol].price * shares;
                                        userData.data.bank.balance += totalValue;
                                        userData.data.bank.stocks[symbol] -= shares;
                                        if (userData.data.bank.stocks[symbol] === 0) delete userData.data.bank.stocks[symbol];

                                        userData.data.bank.transactions.unshift({
                                                type: "stock_sell",
                                                amount: totalValue,
                                                symbol: symbol,
                                                shares: shares,
                                                date: new Date().toISOString()
                                        });

                                        await usersData.set(senderID, userData.data, "data");
                                        return message.reply(fonts.bold(`✅ Sold ${shares} shares of ${symbol} for $${totalValue.toLocaleString()}!`));
                                }
                                break;
                        }

                        case "crypto": {
                                const subAction = args[1]?.toLowerCase();

                                if (!subAction || subAction === "list") {
                                        let cryptoList = "";
                                        Object.entries(marketData.crypto).forEach(([symbol, data]) => {
                                                const changeEmoji = data.change >= 0 ? "📈" : "📉";
                                                cryptoList += `${changeEmoji} ${symbol}: $${data.price.toLocaleString()} (${data.change}%)\n`;
                                                cryptoList += `   ${data.name}\n\n`;
                                        });

                                        let portfolio = "";
                                        Object.entries(userData.data.bank.crypto).forEach(([symbol, amount]) => {
                                                const price = marketData.crypto[symbol]?.price || 0;
                                                const value = amount * price;
                                                portfolio += `• ${symbol}: ${amount} coins ($${value.toLocaleString()})\n`;
                                        });

                                        return message.reply(fonts.bold(
                                                `₿ 𝐂𝐑𝐘𝐏𝐓𝐎𝐂𝐔𝐑𝐑𝐄𝐍𝐂𝐘\n` +
                                                `━━━━━━━━━━━━━━━━━━━━━━\n\n${cryptoList}\n` +
                                                `📊 Your Holdings:\n${portfolio || "None"}\n\n` +
                                                `Usage:\n` +
                                                `• ${prefix}${commandName} crypto buy <symbol> <amount>\n` +
                                                `• ${prefix}${commandName} crypto sell <symbol> <amount>`
                                        ));
                                }

                                const symbol = args[2]?.toUpperCase();
                                const amount = parseFloat(args[3]);

                                if (!symbol || !marketData.crypto[symbol]) {
                                        return message.reply(fonts.bold("❌ Invalid crypto symbol!"));
                                }

                                if (subAction === "buy") {
                                        if (!amount || amount <= 0) return message.reply(fonts.bold("❌ Please enter valid amount!"));
                                        
                                        const totalCost = marketData.crypto[symbol].price * amount;
                                        if (userData.data.bank.balance < totalCost) {
                                                return message.reply(getLang("insufficientBank", userData.data.bank.balance.toLocaleString()));
                                        }

                                        userData.data.bank.balance -= totalCost;
                                        if (!userData.data.bank.crypto[symbol]) userData.data.bank.crypto[symbol] = 0;
                                        userData.data.bank.crypto[symbol] += amount;

                                        userData.data.bank.transactions.unshift({
                                                type: "crypto_buy",
                                                amount: totalCost,
                                                symbol: symbol,
                                                cryptoAmount: amount,
                                                date: new Date().toISOString()
                                        });

                                        await usersData.set(senderID, userData.data, "data");
                                        return message.reply(fonts.bold(`✅ Bought ${amount} ${symbol} for $${totalCost.toLocaleString()}!`));
                                }

                                if (subAction === "sell") {
                                        if (!amount || amount <= 0) return message.reply(fonts.bold("❌ Please enter valid amount!"));
                                        if (!userData.data.bank.crypto[symbol] || userData.data.bank.crypto[symbol] < amount) {
                                                return message.reply(fonts.bold("❌ You don't own enough crypto!"));
                                        }

                                        const totalValue = marketData.crypto[symbol].price * amount;
                                        userData.data.bank.balance += totalValue;
                                        userData.data.bank.crypto[symbol] -= amount;
                                        if (userData.data.bank.crypto[symbol] === 0) delete userData.data.bank.crypto[symbol];

                                        userData.data.bank.transactions.unshift({
                                                type: "crypto_sell",
                                                amount: totalValue,
                                                symbol: symbol,
                                                cryptoAmount: amount,
                                                date: new Date().toISOString()
                                        });

                                        await usersData.set(senderID, userData.data, "data");
                                        return message.reply(fonts.bold(`✅ Sold ${amount} ${symbol} for $${totalValue.toLocaleString()}!`));
                                }
                                break;
                        }

                        case "portfolio": {
                                let stockValue = 0;
                                let cryptoValue = 0;

                                Object.entries(userData.data.bank.stocks).forEach(([symbol, shares]) => {
                                        stockValue += (marketData.stocks[symbol]?.price || 0) * shares;
                                });

                                Object.entries(userData.data.bank.crypto).forEach(([symbol, amount]) => {
                                        cryptoValue += (marketData.crypto[symbol]?.price || 0) * amount;
                                });

                                const totalInvestments = stockValue + cryptoValue;

                                return message.reply(fonts.bold(
                                        `📊 𝐈𝐍𝐕𝐄𝐒𝐓𝐌𝐄𝐍𝐓 𝐏𝐎𝐑𝐓𝐅𝐎𝐋𝐈𝐎\n` +
                                        `━━━━━━━━━━━━━━━━━━━━━━\n` +
                                        `📈 Stocks: $${stockValue.toLocaleString()}\n` +
                                        `₿ Crypto: $${cryptoValue.toLocaleString()}\n` +
                                        `💵 Cash: $${userData.data.bank.balance.toLocaleString()}\n` +
                                        `━━━━━━━━━━━━━━━━━━━━━━\n` +
                                        `💰 Total: $${(totalInvestments + userData.data.bank.balance).toLocaleString()}`
                                ));
                        }

                        case "businesses": {
                                let businessList = "";
                                Object.entries(marketData.businesses).forEach(([type, data]) => {
                                        businessList += `🏢 ${data.name}\n`;
                                        businessList += `   Cost: $${data.cost.toLocaleString()}\n`;
                                        businessList += `   Income: $${data.income.toLocaleString()}/month\n\n`;
                                });

                                let ownedBusinesses = "";
                                userData.data.bank.businesses.forEach((b, i) => {
                                        ownedBusinesses += `${i+1}. ${b.name}\n`;
                                });

                                return message.reply(fonts.bold(
                                        `🏢 𝐁𝐔𝐒𝐈𝐍𝐄𝐒𝐒 𝐎𝐏𝐏𝐎𝐑𝐓𝐔𝐍𝐈𝐓𝐈𝐄𝐒\n` +
                                        `━━━━━━━━━━━━━━━━━━━━━━\n\n${businessList}\n` +
                                        `🏭 Your Businesses:\n${ownedBusinesses || "None"}\n\n` +
                                        `Usage:\n` +
                                        `• ${prefix}${commandName} buy <business>\n` +
                                        `• ${prefix}${commandName} collect`
                                ));
                        }

                        case "buy": {
                                const businessType = args[1]?.toUpperCase();
                                if (!businessType || !marketData.businesses[businessType]) {
                                        return message.reply(fonts.bold("❌ Invalid business type!"));
                                }

                                const business = marketData.businesses[businessType];
                                if (userData.data.bank.balance < business.cost) {
                                        return message.reply(getLang("insufficientBank", userData.data.bank.balance.toLocaleString()));
                                }

                                userData.data.bank.balance -= business.cost;
                                userData.data.bank.businesses.push({
                                        type: businessType,
                                        name: business.name,
                                        level: 1,
                                        lastCollected: Date.now()
                                });

                                userData.data.bank.transactions.unshift({
                                        type: "business_buy",
                                        amount: business.cost,
                                        business: business.name,
                                        date: new Date().toISOString()
                                });

                                await usersData.set(senderID, userData.data, "data");
                                return message.reply(fonts.bold(`✅ Purchased ${business.name} for $${business.cost.toLocaleString()}!\n💰 Monthly Income: $${business.income.toLocaleString()}`));
                        }

                        case "collect": {
                                let totalIncome = 0;
                                const now = Date.now();

                                userData.data.bank.businesses.forEach(business => {
                                        const hoursSince = (now - business.lastCollected) / (1000 * 60 * 60);
                                        const monthlyIncome = marketData.businesses[business.type]?.income || 0;
                                        const income = Math.floor((monthlyIncome / 30 / 24) * hoursSince);
                                        totalIncome += income;
                                        business.lastCollected = now;
                                });

                                if (totalIncome === 0) {
                                        return message.reply(fonts.bold("💼 No business income to collect yet!"));
                                }

                                userData.data.bank.balance += totalIncome;
                                userData.data.bank.transactions.unshift({
                                        type: "business_income",
                                        amount: totalIncome,
                                        date: new Date().toISOString()
                                });

                                await usersData.set(senderID, userData.data, "data");
                                return message.reply(fonts.bold(`💰 Collected $${totalIncome.toLocaleString()} from your businesses!`));
                        }

                        case "daily": {
                                const now = Date.now();
                                const lastDaily = userData.data.bank.lastDaily || 0;
                                const cooldown = 24 * 60 * 60 * 1000;

                                if (now - lastDaily < cooldown) {
                                        const hoursLeft = Math.floor((cooldown - (now - lastDaily)) / (60 * 60 * 1000));
                                        const minsLeft = Math.floor(((cooldown - (now - lastDaily)) % (60 * 60 * 1000)) / (60 * 1000));
                                        return message.reply(getLang("dailyCooldown", hoursLeft, minsLeft));
                                }

                                // Calcul du streak
                                if (now - lastDaily < cooldown * 2) {
                                        userData.data.bank.dailyStreak++;
                                } else {
                                        userData.data.bank.dailyStreak = 1;
                                }

                                const baseReward = 500;
                                const streakBonus = Math.min(userData.data.bank.dailyStreak * 50, 1000);
                                const totalReward = baseReward + streakBonus;

                                userData.data.bank.balance += totalReward;
                                userData.data.bank.lastDaily = now;

                                userData.data.bank.transactions.unshift({
                                        type: "daily_reward",
                                        amount: totalReward,
                                        streak: userData.data.bank.dailyStreak,
                                        date: new Date().toISOString()
                                });

                                await usersData.set(senderID, userData.data, "data");
                                return message.reply(getLang("dailyReward", 
                                        totalReward.toLocaleString(), userData.data.bank.dailyStreak, streakBonus.toLocaleString()));
                        }

                        case "work": {
                                const now = Date.now();
                                const lastWork = userData.data.bank.lastWork || 0;
                                const cooldown = 4 * 60 * 60 * 1000;

                                if (now - lastWork < cooldown) {
                                        const hoursLeft = Math.floor((cooldown - (now - lastWork)) / (60 * 60 * 1000));
                                        const minsLeft = Math.floor(((cooldown - (now - lastWork)) % (60 * 60 * 1000)) / (60 * 1000));
                                        return message.reply(getLang("workCooldown", hoursLeft, minsLeft));
                                }

                                const jobs = [
                                        "Cashier", "Driver", "Teacher", "Engineer", "Doctor", 
                                        "Programmer", "Designer", "Manager", "Consultant"
                                ];
                                const job = jobs[Math.floor(Math.random() * jobs.length)];
                                const earnings = Math.floor(Math.random() * 1000) + 200;

                                userData.data.bank.balance += earnings;
                                userData.data.bank.lastWork = now;
                                userData.data.bank.reputation += 1;

                                userData.data.bank.transactions.unshift({
                                        type: "work",
                                        amount: earnings,
                                        job: job,
                                        date: new Date().toISOString()
                                });

                                await usersData.set(senderID, userData.data, "data");
                                return message.reply(getLang("workComplete", job, earnings.toLocaleString()));
                        }

                        case "credit": {
                                const score = userData.data.bank.creditScore;
                                let rating = "Poor";
                                if (score >= 800) rating = "Excellent";
                                else if (score >= 740) rating = "Very Good";
                                else if (score >= 670) rating = "Good";
                                else if (score >= 580) rating = "Fair";

                                return message.reply(fonts.bold(
                                        `📊 𝐂𝐑𝐄𝐃𝐈𝐓 𝐒𝐂𝐎𝐑𝐄\n` +
                                        `━━━━━━━━━━━━━━━━━━━━━━\n` +
                                        `Score: ${score}/850\n` +
                                        `Rating: ${rating}\n` +
                                        `Max Loan: $${(score * 1000).toLocaleString()}\n\n` +
                                        `💡 Tips to improve:\n` +
                                        `• Pay loans on time\n` +
                                        `• Make regular deposits\n` +
                                        `• Build transaction history`
                                ));
                        }

                        case "achievements": {
                                const achievements = userData.data.bank.achievements || [];
                                let achievementText = "";

                                achievements.forEach((ach, i) => {
                                        achievementText += `${i+1}. 🏆 ${ach}\n`;
                                });

                                return message.reply(fonts.bold(
                                        `🏆 𝐀𝐂𝐇𝐈𝐄𝐕𝐄𝐌𝐄𝐍𝐓𝐒\n` +
                                        `━━━━━━━━━━━━━━━━━━━━━━\n` +
                                        `${achievementText || "No achievements yet!"}\n\n` +
                                        `Total: ${achievements.length} unlocked`
                                ));
                        }

                        case "transactions":
                        case "history": {
                                const transactions = userData.data.bank.transactions.slice(0, 10);
                                if (transactions.length === 0) {
                                        return message.reply(getLang("noTransactions"));
                                }

                                let historyText = "";
                                transactions.forEach((tx, i) => {
                                        const date = new Date(tx.date).toLocaleString();
                                        const icon = {
                                                deposit: "📥", withdrawal: "📤", transfer_sent: "➡️",
                                                transfer_received: "⬅️", loan: "💵", loan_payment: "💸",
                                                stock_buy: "📈", stock_sell: "📉", crypto_buy: "₿",
                                                crypto_sell: "₿", daily_reward: "🎁", work: "💼"
                                        }[tx.type] || "💳";

                                        historyText += `${i+1}. ${icon} ${tx.type.toUpperCase()}\n`;
                                        historyText += `   💰 Amount: $${tx.amount.toLocaleString()}\n`;
                                        historyText += `   🆔 ID: ${tx.txnID || 'N/A'}\n`;
                                        historyText += `   📅 ${date}\n\n`;
                                });

                                return message.reply(getLang("transactionHistory", historyText));
                        }

                        default:
                                return message.reply(fonts.bold(
                                        `❌ Unknown command: "${action}"\n` +
                                        `Use ${prefix}${commandName} help to see all commands.`
                                ));
                }
        }
};