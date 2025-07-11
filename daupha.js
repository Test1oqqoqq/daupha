const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "daupha_data.json");

// Khởi tạo dữ liệu nếu chưa có
function loadData() {
    if (!fs.existsSync(DATA_PATH)) {
        fs.writeFileSync(DATA_PATH, JSON.stringify({ users: {} }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DATA_PATH));
}
function saveData(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

const SKILLS = [
    { id: 1, name: "Hỏa Liên", desc: "Tấn công lửa mạnh mẽ", level: 1, price: 100 },
    { id: 2, name: "Băng Phách", desc: "Tấn công băng giá", level: 1, price: 120 },
    { id: 3, name: "Phong Nhận", desc: "Tấn công gió sắc bén", level: 1, price: 150 },
];

const SHOP = [
    { id: 1, name: "Đan dược", desc: "Hồi phục HP", price: 50 },
    { id: 2, name: "Bí kíp kỹ năng", desc: "Mở khóa kỹ năng mới", price: 200 },
];

module.exports = class {
    static config = {
        name: "daupha",
        aliases: ["daupha", "dauphatruyen", "dpt"],
        version: "1.1.0",
        role: 0,
        author: "Panna",
        info: "Đọc truyện, rank, skills, shop Đấu Phá Thương Khung.",
        Category: "Truyện",
        guides: "{pn}daupha [chương|rank|skills|shop|info]",
        cd: 5,
        hasPrefix: true,
        images: []
    };

    static async onRun({ api, event, args }) {
        const data = loadData();
        const userID = event.senderID;
        if (!data.users[userID]) {
            data.users[userID] = {
                name: event.senderID,
                level: 1,
                exp: 0,
                coins: 100,
                skills: [],
                items: []
            };
            saveData(data);
        }
        const user = data.users[userID];
        const sub = (args[0] || "").toLowerCase();

        // Đọc truyện
        if (!sub || !isNaN(sub)) {
            const chapter = sub || 1;
            // TODO: Lấy nội dung chương thực tế
            return api.sendMessage(`Đây là nội dung chương ${chapter} của Đấu Phá Thương Khung (demo).`, event.threadID, event.messageID);
        }

        // Rank
        if (sub === "rank") {
            const top = Object.values(data.users)
                .sort((a, b) => b.level - a.level || b.exp - a.exp)
                .slice(0, 5)
                .map((u, i) => `${i + 1}. ${u.name} - Cấp: ${u.level}, EXP: ${u.exp}`)
                .join("\n");
            return api.sendMessage(`🏆 Bảng xếp hạng Đấu Phá:\n${top}`, event.threadID, event.messageID);
        }

        // Skills
        if (sub === "skills") {
            if (!args[1]) {
                const mySkills = user.skills.length
                    ? user.skills.map(id => {
                        const sk = SKILLS.find(s => s.id === id);
                        return sk ? `- ${sk.name} (Lv${sk.level}): ${sk.desc}` : "";
                    }).join("\n")
                    : "Bạn chưa có kỹ năng nào. Dùng {pn}daupha skills buy [id] để mua.";
                const allSkills = SKILLS.map(s => `ID: ${s.id} | ${s.name} (Lv${s.level}) - ${s.desc} | Giá: ${s.price} xu`).join("\n");
                return api.sendMessage(`Kỹ năng của bạn:\n${mySkills}\n\nKỹ năng có thể mua:\n${allSkills}\n\nMua: {pn}daupha skills buy [id]`, event.threadID, event.messageID);
            }
            // Mua skill
            if (args[1] === "buy" && args[2]) {
                const skillID = parseInt(args[2]);
                const skill = SKILLS.find(s => s.id === skillID);
                if (!skill) return api.sendMessage("ID kỹ năng không hợp lệ!", event.threadID, event.messageID);
                if (user.skills.includes(skillID)) return api.sendMessage("Bạn đã sở hữu kỹ năng này!", event.threadID, event.messageID);
                if (user.coins < skill.price) return api.sendMessage("Bạn không đủ xu để mua kỹ năng này!", event.threadID, event.messageID);
                user.coins -= skill.price;
                user.skills.push(skillID);
                saveData(data);
                return api.sendMessage(`Bạn đã mua kỹ năng ${skill.name}!`, event.threadID, event.messageID);
            }
        }

        // Shop
        if (sub === "shop") {
            if (!args[1]) {
                const shopList = SHOP.map(i => `ID: ${i.id} | ${i.name} - ${i.desc} | Giá: ${i.price} xu`).join("\n");
                return api.sendMessage(`Cửa hàng Đấu Phá:\n${shopList}\n\nMua: {pn}daupha shop buy [id]`, event.threadID, event.messageID);
            }
            if (args[1] === "buy" && args[2]) {
                const itemID = parseInt(args[2]);
                const item = SHOP.find(i => i.id === itemID);
                if (!item) return api.sendMessage("ID vật phẩm không hợp lệ!", event.threadID, event.messageID);
                if (user.coins < item.price) return api.sendMessage("Bạn không đủ xu để mua vật phẩm này!", event.threadID, event.messageID);
                user.coins -= item.price;
                user.items.push(itemID);
                saveData(data);
                return api.sendMessage(`Bạn đã mua vật phẩm ${item.name}!`, event.threadID, event.messageID);
            }
        }

        // Info
        if (sub === "info") {
            const mySkills = user.skills.map(id => {
                const sk = SKILLS.find(s => s.id === id);
                return sk ? sk.name : "";
            }).join(", ") || "Không có";
            const myItems = user.items.map(id => {
                const it = SHOP.find(i => i.id === id);
                return it ? it.name : "";
            }).join(", ") || "Không có";
            return api.sendMessage(
                `👤 Thông tin nhân vật:
Tên: ${user.name}
Cấp: ${user.level}
EXP: ${user.exp}
Xu: ${user.coins}
Kỹ năng: ${mySkills}
Vật phẩm: ${myItems}`,
                event.threadID, event.messageID
            );
        }

        return api.sendMessage("Lệnh không hợp lệ. Dùng {pn}daupha [chương|rank|skills|shop|info]", event.threadID, event.messageID);
    }

    static async onEvent({ api, event, msg, model, Threads, Users, Currencies, args }) {
        // Có thể mở rộng event ở đây
    }

    static async onReaction({ api, event, msg, model, Threads, Users, Currencies, args, onReaction }) {
        // Có thể mở rộng reaction ở đây
    }

    static async onLoad({ api, model }) {
        // Tạo file data nếu chưa có
        loadData();
    }

    static async onReply({ api, event, msg, model, Threads, Users, Currencies, args, onReply }) {
        // Có thể mở rộng reply ở đây
    }
}