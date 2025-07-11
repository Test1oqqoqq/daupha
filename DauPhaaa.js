const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "system", "data", "daupha_data.json");
const MARKET_PATH = path.join(__dirname, "system", "data", "daupha_market.json");

function loadData() {
    if (!fs.existsSync(DATA_PATH)) {
        fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
        fs.writeFileSync(DATA_PATH, JSON.stringify({ users: {} }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DATA_PATH));
}
function saveData(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}
function loadMarket() {
    if (!fs.existsSync(MARKET_PATH)) {
        fs.mkdirSync(path.dirname(MARKET_PATH), { recursive: true });
        fs.writeFileSync(MARKET_PATH, JSON.stringify([], null, 2));
    }
    return JSON.parse(fs.readFileSync(MARKET_PATH));
}
function saveMarket(market) {
    fs.writeFileSync(MARKET_PATH, JSON.stringify(market, null, 2));
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
const DOUQI = [
    "Đấu giả", "Đấu sư", "Đại đấu sư", "Đấu linh", "Đấu vương", "Đấu hoàng", "Đấu tông", "Đấu tôn", "Đấu thánh", "Đấu đế"
];
const DIHOA = [
    "Thanh Liên Địa Tâm Hỏa", "Tịnh Liên Yêu Hỏa", "Kim Đế Phần Thiên Diễm", "Hư Vô Thôn Viêm"
];
const GIATOC = [
    "Tiêu Gia", "Nạp Lan Gia", "Mễ Đặc Nhĩ Gia", "Gia Mã Đế Quốc"
];
const SUPHU = [
    "Dược Lão", "Pháp Lão", "Hàn Phong", "Huân Nhi"
];
const DAUGIA = [
    { id: 1, name: "Dị Hỏa", desc: "Ngọn lửa hiếm có, tăng sức mạnh lớn" },
    { id: 2, name: "Linh Dược", desc: "Dược liệu quý hiếm" }
];
const LUYENDUOC = [
    { id: 1, name: "Thanh Tâm Đan", desc: "Tăng đấu khí" },
    { id: 2, name: "Bồi Nguyên Đan", desc: "Hồi phục nguyên khí" }
];
const CRAFTS = [
    { id: 1, name: "Huyền Thiết Kiếm", require: { "Thanh Tâm Đan": 1, "Dị Hỏa": 1 }, desc: "Kiếm tăng 10% EXP khi luyện dược" },
    { id: 2, name: "Bảo Hộ Phù", require: { "Bồi Nguyên Đan": 2 }, desc: "Giảm 10% xu khi mua shop" }
];
const BOSSES = [
    { id: 1, name: "Hắc Ám Ma Viên", hp: 500, reward: "Dị Hỏa, 200 xu, 200 EXP" },
    { id: 2, name: "Viêm Long", hp: 1000, reward: "Trang bị hiếm, 500 xu, 500 EXP" }
];
const QUESTS = [
    { id: 1, name: "Luyện dược 1 lần", desc: "Luyện thành công 1 dược phẩm", reward: "50 xu, 50 EXP" },
    { id: 2, name: "Đổi cấp đấu khí", desc: "Lên cấp đấu khí mới", reward: "100 xu, 100 EXP" },
    { id: 3, name: "Tham gia PvP", desc: "Tham gia 1 trận PvP", reward: "70 xu, 70 EXP" }
];

module.exports = class {
    static config = {
        name: "dauphaaa",
        aliases: ["daupha", "dauphatruyen", "dpt"],
        version: "2.0.0",
        role: 0,
        author: "Panna",
        info: "Đấu Phá Thương Khung: menu, info, rank, skills, shop, douqi, dihoa, giatoc, suphu, daugia, luyenduoc, quest, pvp, boss, craft, market.",
        Category: "Truyện",
        guides: "{pn}dauphaaa menu",
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
                items: [],
                douqi: DOUQI[0],
                dihoa: [],
                giatoc: GIATOC[0],
                suphu: SUPHU[0]
            };
            saveData(data);
        }
        const user = data.users[userID];
        const sub = (args[0] || "").toLowerCase();

        // Market
        if (sub === "market") {
            let market = loadMarket();
            if (!args[1]) {
                if (!market.length) return api.sendMessage("Chợ hiện chưa có vật phẩm nào được rao bán!", event.threadID, event.messageID);
                const list = market.map((m, i) => `${i + 1}. ${m.item} - Giá: ${m.price} xu - Người bán: ${m.sellerName}`).join("\n");
                return api.sendMessage(`🛒 Chợ giao dịch:\n${list}\n\nMua: {pn}dauphaaa market mua [id]`, event.threadID, event.messageID);
            }
            if (args[1] === "ban" && args[2] && args[3]) {
                const itemName = args[2];
                const price = parseInt(args[3]);
                if (!user.items || !user.items.includes(itemName)) return api.sendMessage("Bạn không có vật phẩm này để bán!", event.threadID, event.messageID);
                market.push({ id: market.length + 1, seller: userID, sellerName: user.name, item: itemName, price });
                user.items = user.items.filter(i => i !== itemName);
                saveMarket(market);
                saveData(data);
                return api.sendMessage(`Bạn đã đăng bán ${itemName} với giá ${price} xu trên chợ!`, event.threadID, event.messageID);
            }
            if (args[1] === "mua" && args[2]) {
                const idx = parseInt(args[2]) - 1;
                if (idx < 0 || idx >= market.length) return api.sendMessage("ID vật phẩm không hợp lệ!", event.threadID, event.messageID);
                const item = market[idx];
                if (user.coins < item.price) return api.sendMessage("Bạn không đủ xu để mua vật phẩm này!", event.threadID, event.messageID);
                user.coins -= item.price;
                if (!user.items) user.items = [];
                user.items.push(item.item);
                if (data.users[item.seller]) {
                    data.users[item.seller].coins += item.price;
                }
                market.splice(idx, 1);
                saveMarket(market);
                saveData(data);
                return api.sendMessage(`Bạn đã mua ${item.item} với giá ${item.price} xu!`, event.threadID, event.messageID);
            }
            return api.sendMessage(`🛒 Chợ giao dịch:\n- Xem chợ: {pn}dauphaaa market\n- Bán vật phẩm: {pn}dauphaaa market ban [tên vật phẩm] [giá]\n- Mua vật phẩm: {pn}dauphaaa market mua [id]`, event.threadID, event.messageID);
        }

        // MENU tổng hợp
        if (!sub || sub === "menu") {
            return api.sendMessage(`🌟 ĐẤU PHÁ THƯƠNG KHUNG MENU 🌟\n\n1. Thông tin nhân vật: {pn}dauphaaa info\n2. Bảng xếp hạng: {pn}dauphaaa rank\n3. Kỹ năng: {pn}dauphaaa skills\n4. Shop: {pn}dauphaaa shop\n5. Đổi/tra cứu Đấu khí: {pn}dauphaaa douqi [chon id]\n6. Nhận/tra cứu Dị hỏa: {pn}dauphaaa dihoa [chon id]\n7. Đổi/tra cứu Gia tộc: {pn}dauphaaa giatoc [chon id]\n8. Đổi/tra cứu Sư phụ: {pn}dauphaaa suphu [chon id]\n9. Đấu giá: {pn}dauphaaa daugia\n10. Luyện dược: {pn}dauphaaa luyenduoc [chon id]\n11. Nhiệm vụ: {pn}dauphaaa quest\n12. PvP đấu trường: {pn}dauphaaa pvp [@tag]\n13. Săn boss: {pn}dauphaaa boss\n14. Chế tạo trang bị: {pn}dauphaaa craft\n15. Chợ giao dịch: {pn}dauphaaa market\n\n💡 Dùng {pn}dauphaaa [lệnh] để biết chi tiết!`, event.threadID, event.messageID);
        }

        // ... (phần còn lại giữ nguyên như file trước, chỉ đổi tên lệnh sang dauphaaa)
        // Rank, skills, shop, douqi, dihoa, giatoc, suphu, daugia, luyenduoc, quest, pvp, boss, craft
        // ...
    }

    static async onEvent({ api, event, msg, model, Threads, Users, Currencies, args }) {
        // Có thể mở rộng event ở đây
    }

    static async onReaction({ api, event, msg, model, Threads, Users, Currencies, args, onReaction }) {
        // Có thể mở rộng reaction ở đây
    }

    static async onLoad({ api, model }) {
        loadData();
        loadMarket();
    }

    static async onReply({ api, event, msg, model, Threads, Users, Currencies, args, onReply }) {
        // Có thể mở rộng reply ở đây
    }
}