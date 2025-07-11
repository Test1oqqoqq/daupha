const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "system", "data", "daupha_data.json");

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

// Dữ liệu mẫu cho craft, boss, quest, pvp
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

// Dữ liệu mẫu cho market
const MARKET = [
    // { id: 1, seller: 'userID', item: 'Thanh Tâm Đan', price: 150 }
];

module.exports = class {
    static config = {
        name: "daupha",
        aliases: ["daupha", "dauphatruyen", "dpt"],
        version: "1.2.0",
        role: 0,
        author: "Panna",
        info: "Đấu Phá Thương Khung: skills, shop, đấu khí, dị hỏa, gia tộc, sư phụ, đấu giá, luyện dược.",
        Category: "Truyện",
        guides: "{pn}daupha [rank|skills|shop|info|douqi|dihoa|giatoc|suphu|daugia|luyenduoc]",
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
                let price = item.price;
                if (user.suphu === "Pháp Lão") price = Math.floor(price * 0.9); // bonus 10% giảm giá
                if (user.coins < price) return api.sendMessage("Bạn không đủ xu để mua vật phẩm này!", event.threadID, event.messageID);
                user.coins -= price;
                user.items.push(itemID);
                saveData(data);
                return api.sendMessage(`Bạn đã mua vật phẩm ${item.name}! (giá: ${price} xu)`, event.threadID, event.messageID);
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
                `👤 Thông tin nhân vật:\nTên: ${user.name}\nCấp: ${user.level}\nEXP: ${user.exp}\nXu: ${user.coins}\nKỹ năng: ${mySkills}\nVật phẩm: ${myItems}\nĐấu khí: ${user.douqi}\nDị hỏa: ${(user.dihoa && user.dihoa.length) ? user.dihoa.join(", ") : "Không có"}\nGia tộc: ${user.giatoc}\nSư phụ: ${user.suphu}`,
                event.threadID, event.messageID
            );
        }

        // Đấu khí
        if (sub === "douqi") {
            if (args[1] === "chon" && args[2]) {
                const idx = parseInt(args[2]) - 1;
                if (idx < 0 || idx >= DOUQI.length) return api.sendMessage("ID đấu khí không hợp lệ!", event.threadID, event.messageID);
                // Điều kiện lên cấp: đủ EXP
                const needExp = (idx + 1) * 100;
                if (user.exp < needExp) return api.sendMessage(`Bạn cần ${needExp} EXP để lên cấp này!`, event.threadID, event.messageID);
                const oldDouqi = user.douqi;
                user.douqi = DOUQI[idx];
                let bonus = 0;
                if (user.suphu === "Huân Nhi") bonus = Math.floor(needExp * 0.1);
                user.exp -= needExp;
                user.coins += 100 + bonus;
                saveData(data);
                return api.sendMessage(`Chúc mừng! Bạn đã lên cấp đấu khí: ${user.douqi} (mất ${needExp} EXP, nhận ${100 + bonus} xu${bonus > 0 ? ", bonus từ Huân Nhi: " + bonus + " xu" : ""})`, event.threadID, event.messageID);
            }
            return api.sendMessage(`Các cấp bậc Đấu khí:\n${DOUQI.map((d, i) => `${i + 1}. ${d}`).join("\n")}\n\nChọn: {pn}daupha douqi chon [id] (cần đủ EXP, lên cấp nhận xu, bonus nếu có sư phụ)`, event.threadID, event.messageID);
        }

        // Dị hỏa
        if (sub === "dihoa") {
            if (args[1] === "chon" && args[2]) {
                const idx = parseInt(args[2]) - 1;
                if (idx < 0 || idx >= DIHOA.length) return api.sendMessage("ID dị hỏa không hợp lệ!", event.threadID, event.messageID);
                if (!user.dihoa) user.dihoa = [];
                if (user.dihoa.includes(DIHOA[idx])) return api.sendMessage("Bạn đã sở hữu dị hỏa này!", event.threadID, event.messageID);
                user.dihoa.push(DIHOA[idx]);
                saveData(data);
                return api.sendMessage(`Bạn đã nhận dị hỏa: ${DIHOA[idx]}`, event.threadID, event.messageID);
            }
            return api.sendMessage(`Các loại Dị Hỏa nổi bật:\n${DIHOA.map((d, i) => `${i + 1}. ${d}`).join("\n")}\n\nNhận: {pn}daupha dihoa chon [id]`, event.threadID, event.messageID);
        }

        // Gia tộc
        if (sub === "giatoc") {
            if (args[1] === "chon" && args[2]) {
                const idx = parseInt(args[2]) - 1;
                if (idx < 0 || idx >= GIATOC.length) return api.sendMessage("ID gia tộc không hợp lệ!", event.threadID, event.messageID);
                const now = Date.now();
                if (!user.lastChangeClan) user.lastChangeClan = 0;
                if (now - user.lastChangeClan < 24 * 60 * 60 * 1000) return api.sendMessage("Bạn chỉ được đổi gia tộc 1 lần mỗi ngày!", event.threadID, event.messageID);
                if (user.coins < 200) return api.sendMessage("Bạn cần 200 xu để đổi gia tộc!", event.threadID, event.messageID);
                user.coins -= 200;
                user.giatoc = GIATOC[idx];
                user.suphu = SUPHU[0]; // reset sư phụ về mặc định
                user.lastChangeClan = now;
                saveData(data);
                return api.sendMessage(`Bạn đã đổi sang gia tộc: ${user.giatoc} (mất 200 xu, sư phụ về mặc định)`, event.threadID, event.messageID);
            }
            return api.sendMessage(`Các gia tộc lớn:\n${GIATOC.map((g, i) => `${i + 1}. ${g}`).join("\n")}\n\nChọn: {pn}daupha giatoc chon [id] (mất 200 xu, mỗi ngày 1 lần)`, event.threadID, event.messageID);
        }

        // Sư phụ
        if (sub === "suphu") {
            if (args[1] === "chon" && args[2]) {
                const idx = parseInt(args[2]) - 1;
                if (idx < 0 || idx >= SUPHU.length) return api.sendMessage("ID sư phụ không hợp lệ!", event.threadID, event.messageID);
                if (!user.giatoc) return api.sendMessage("Bạn cần vào gia tộc trước khi chọn sư phụ!", event.threadID, event.messageID);
                user.suphu = SUPHU[idx];
                saveData(data);
                let bonusMsg = "";
                if (SUPHU[idx] === "Dược Lão") bonusMsg = "(Bonus: +20% EXP khi luyện dược thành công)";
                if (SUPHU[idx] === "Pháp Lão") bonusMsg = "(Bonus: -10% giá vật phẩm shop)";
                if (SUPHU[idx] === "Hàn Phong") bonusMsg = "(Bonus: +10% tỉ lệ luyện dược thành công)";
                if (SUPHU[idx] === "Huân Nhi") bonusMsg = "(Bonus: +10% EXP khi lên cấp đấu khí)";
                return api.sendMessage(`Bạn đã chọn sư phụ: ${user.suphu} ${bonusMsg}`, event.threadID, event.messageID);
            }
            return api.sendMessage(`Các sư phụ nổi bật:\n${SUPHU.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nChọn: {pn}daupha suphu chon [id]`, event.threadID, event.messageID);
        }

        // Đấu giá
        if (sub === "daugia") {
            return api.sendMessage(`Các vật phẩm đấu giá nổi bật:\n${DAUGIA.map(i => `ID: ${i.id} | ${i.name} - ${i.desc}`).join("\n")}`, event.threadID, event.messageID);
        }

        // Luyện dược
        if (sub === "luyenduoc") {
            if (args[1] === "chon" && args[2]) {
                const idx = parseInt(args[2]) - 1;
                if (idx < 0 || idx >= LUYENDUOC.length) return api.sendMessage("ID dược phẩm không hợp lệ!", event.threadID, event.messageID);
                const price = 100; // Giá luyện mỗi loại dược phẩm (có thể mở rộng từng loại)
                if (user.coins < price) return api.sendMessage(`Bạn cần ${price} xu để luyện dược phẩm này!`, event.threadID, event.messageID);
                // Tính xác suất thành công
                let successRate = 0.7;
                if (user.suphu === "Hàn Phong") successRate += 0.1;
                const isSuccess = Math.random() < successRate;
                user.coins -= price;
                if (isSuccess) {
                    if (!user.items) user.items = [];
                    user.items.push(LUYENDUOC[idx].name);
                    let exp = 50;
                    if (user.suphu === "Dược Lão") exp = Math.floor(exp * 1.2);
                    user.exp += exp;
                    saveData(data);
                    return api.sendMessage(`Bạn đã luyện thành công: ${LUYENDUOC[idx].name}! Nhận ${exp} EXP.`, event.threadID, event.messageID);
                } else {
                    saveData(data);
                    return api.sendMessage(`Luyện thất bại! Bạn đã mất ${price} xu.`, event.threadID, event.messageID);
                }
            }
            return api.sendMessage(`Các loại dược phẩm nổi bật:\n${LUYENDUOC.map((i, idx) => `${idx + 1}. ${i.name} - ${i.desc}`).join("\n")}\n\nLuyện: {pn}daupha luyenduoc chon [id] (mỗi lần luyện tốn 100 xu, có thể thất bại)`, event.threadID, event.messageID);
        }

        // Market
        if (sub === "market") {
            if (!args[1]) {
                // Xem danh sách vật phẩm đang rao bán
                if (!MARKET.length) return api.sendMessage("Chợ hiện chưa có vật phẩm nào được rao bán!", event.threadID, event.messageID);
                const list = MARKET.map((m, i) => `${i + 1}. ${m.item} - Giá: ${m.price} xu - Người bán: ${m.seller}`).join("\n");
                return api.sendMessage(`🛒 Chợ giao dịch:\n${list}\n\nMua: {pn}daupha market mua [id]`, event.threadID, event.messageID);
            }
            if (args[1] === "ban" && args[2] && args[3]) {
                // Đăng bán vật phẩm
                const itemName = args[2];
                const price = parseInt(args[3]);
                if (!user.items || !user.items.includes(itemName)) return api.sendMessage("Bạn không có vật phẩm này để bán!", event.threadID, event.messageID);
                MARKET.push({ id: MARKET.length + 1, seller: user.name, item: itemName, price });
                // Xóa vật phẩm khỏi túi đồ (demo)
                user.items = user.items.filter(i => i !== itemName);
                saveData(data);
                return api.sendMessage(`Bạn đã đăng bán ${itemName} với giá ${price} xu trên chợ!`, event.threadID, event.messageID);
            }
            if (args[1] === "mua" && args[2]) {
                // Mua vật phẩm từ chợ (demo)
                const idx = parseInt(args[2]) - 1;
                if (idx < 0 || idx >= MARKET.length) return api.sendMessage("ID vật phẩm không hợp lệ!", event.threadID, event.messageID);
                const item = MARKET[idx];
                if (user.coins < item.price) return api.sendMessage("Bạn không đủ xu để mua vật phẩm này!", event.threadID, event.messageID);
                user.coins -= item.price;
                if (!user.items) user.items = [];
                user.items.push(item.item);
                // (Demo) Không cộng xu cho người bán, chỉ xóa khỏi chợ
                MARKET.splice(idx, 1);
                saveData(data);
                return api.sendMessage(`Bạn đã mua ${item.item} với giá ${item.price} xu!`, event.threadID, event.messageID);
            }
            return api.sendMessage(`🛒 Chợ giao dịch:\n- Xem chợ: {pn}daupha market\n- Bán vật phẩm: {pn}daupha market ban [tên vật phẩm] [giá]\n- Mua vật phẩm: {pn}daupha market mua [id]`, event.threadID, event.messageID);
        }

        // MENU tổng hợp
        if (!sub || sub === "menu") {
            return api.sendMessage(`🌟 ĐẤU PHÁ THƯƠNG KHUNG MENU 🌟\n\n1. Thông tin nhân vật: {pn}daupha info\n2. Bảng xếp hạng: {pn}daupha rank\n3. Kỹ năng: {pn}daupha skills\n4. Shop: {pn}daupha shop\n5. Đổi/tra cứu Đấu khí: {pn}daupha douqi [chon id]\n6. Nhận/tra cứu Dị hỏa: {pn}daupha dihoa [chon id]\n7. Đổi/tra cứu Gia tộc: {pn}daupha giatoc [chon id]\n8. Đổi/tra cứu Sư phụ: {pn}daupha suphu [chon id]\n9. Đấu giá: {pn}daupha daugia\n10. Luyện dược: {pn}daupha luyenduoc [chon id]\n11. Nhiệm vụ: {pn}daupha quest\n12. PvP đấu trường: {pn}daupha pvp [@tag]\n13. Săn boss: {pn}daupha boss\n14. Chế tạo trang bị: {pn}daupha craft\n15. Chợ giao dịch: {pn}daupha market\n\n💡 Dùng {pn}daupha [lệnh] để biết chi tiết!`, event.threadID, event.messageID);
        }
        // Quest
        if (sub === "quest") {
            // Hiển thị nhiệm vụ mẫu
            const questList = QUESTS.map(q => `ID: ${q.id} | ${q.name} - ${q.desc} | Thưởng: ${q.reward}`).join("\n");
            return api.sendMessage(`🎯 Nhiệm vụ hàng ngày:\n${questList}\n\n(Chức năng nhiệm vụ sẽ được cập nhật chi tiết sau!)`, event.threadID, event.messageID);
        }
        // PvP
        if (sub === "pvp") {
            // PvP mẫu: chỉ phản hồi hướng dẫn
            return api.sendMessage(`⚔️ PvP đấu trường:\nDùng {pn}daupha pvp [@tag] để thách đấu người khác!\n(Chức năng PvP sẽ được cập nhật chi tiết sau!)`, event.threadID, event.messageID);
        }
        // Boss
        if (sub === "boss") {
            // Hiển thị boss mẫu
            const bossList = BOSSES.map(b => `ID: ${b.id} | ${b.name} - HP: ${b.hp} | Thưởng: ${b.reward}`).join("\n");
            return api.sendMessage(`🐲 Boss hiện tại:\n${bossList}\n\nDùng {pn}daupha boss danh [id] để tấn công!\n(Chức năng boss sẽ được cập nhật chi tiết sau!)`, event.threadID, event.messageID);
        }
        // Craft
        if (sub === "craft") {
            // Hiển thị công thức craft mẫu
            const craftList = CRAFTS.map(c => `ID: ${c.id} | ${c.name} - Yêu cầu: ${Object.entries(c.require).map(([k,v])=>`${v} ${k}`).join(", ")} | ${c.desc}`).join("\n");
            return api.sendMessage(`⚒️ Chế tạo trang bị:\n${craftList}\n\nDùng {pn}daupha craft [id] để chế tạo!\n(Chức năng craft sẽ được cập nhật chi tiết sau!)`, event.threadID, event.messageID);
        }

        return api.sendMessage("Lệnh không hợp lệ. Dùng {pn}daupha menu để xem hướng dẫn.", event.threadID, event.messageID);
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