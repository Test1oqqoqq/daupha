const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

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

// Canvas helper functions
async function createCharacterCard(user, data) {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Title
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🌟 ĐẤU PHÁ THƯƠNG KHUNG 🌟', 400, 50);
    
    // Character info
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`👤 Tên: ${user.name}`, 50, 100);
    ctx.fillText(`📊 Cấp: ${user.level}`, 50, 140);
    ctx.fillText(`⭐ EXP: ${user.exp}`, 50, 180);
    ctx.fillText(`💰 Xu: ${user.coins}`, 50, 220);
    ctx.fillText(`⚔️ Đấu khí: ${user.douqi}`, 50, 260);
    ctx.fillText(`🔥 Dị hỏa: ${user.dihoa.length || 0}`, 50, 300);
    ctx.fillText(`🏰 Gia tộc: ${user.giatoc}`, 50, 340);
    ctx.fillText(`👨‍🏫 Sư phụ: ${user.suphu}`, 50, 380);
    ctx.fillText(`✨ Tinh: ${user.tinh}`, 50, 420);
    
    // Border
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 780, 580);
    
    return canvas.toBuffer();
}

async function createRankingCard(data) {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#2c3e50');
    gradient.addColorStop(1, '#34495e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Title
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 BẢNG XẾP HẠNG ĐẤU PHÁ 🏆', 400, 50);
    
    // Top players
    const top = Object.values(data.users)
        .sort((a, b) => b.level - a.level || b.exp - a.exp)
        .slice(0, 5);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    
    top.forEach((user, i) => {
        const y = 120 + i * 80;
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🏅';
        ctx.fillText(`${medal} ${i + 1}. ${user.name}`, 100, y);
        ctx.fillText(`Cấp: ${user.level} | EXP: ${user.exp}`, 100, y + 30);
    });
    
    // Border
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 780, 580);
    
    return canvas.toBuffer();
}

async function createSkillCard(skills, userSkills) {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#8e44ad');
    gradient.addColorStop(1, '#9b59b6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('⚔️ KỸ NĂNG ĐẤU PHÁ ⚔️', 400, 50);
    
    // Skills list
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    
    skills.forEach((skill, i) => {
        const y = 100 + i * 60;
        const hasSkill = userSkills.includes(skill.id);
        ctx.fillStyle = hasSkill ? '#2ecc71' : '#ffffff';
        ctx.fillText(`${skill.id}. ${skill.name} - ${skill.desc}`, 50, y);
        ctx.fillText(`Giá: ${skill.price} xu`, 50, y + 25);
    });
    
    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 780, 580);
    
    return canvas.toBuffer();
}

async function createShopCard(shop) {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#27ae60');
    gradient.addColorStop(1, '#2ecc71');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🛒 CỬA HÀNG ĐẤU PHÁ 🛒', 400, 50);
    
    // Shop items
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    
    shop.forEach((item, i) => {
        const y = 100 + i * 80;
        ctx.fillText(`${item.id}. ${item.name}`, 50, y);
        ctx.fillText(`Mô tả: ${item.desc}`, 50, y + 25);
        ctx.fillText(`💰 Giá: ${item.price} xu`, 50, y + 50);
    });
    
    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 780, 580);
    
    return canvas.toBuffer();
}

async function createBossCard(bosses) {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#c0392b');
    gradient.addColorStop(1, '#e74c3c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🐲 BOSS ĐẤU PHÁ 🐲', 400, 50);
    
    // Boss list
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    
    bosses.forEach((boss, i) => {
        const y = 100 + i * 100;
        ctx.fillText(`${boss.id}. ${boss.name}`, 50, y);
        ctx.fillText(`❤️ HP: ${boss.hp}`, 50, y + 25);
        ctx.fillText(`🎁 Thưởng: ${boss.reward}`, 50, y + 50);
    });
    
    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 780, 580);
    
    return canvas.toBuffer();
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
const TINH = [
    "1 Tinh", "2 Tinh", "3 Tinh", "4 Tinh", "5 Tinh", "6 Tinh", "7 Tinh", "8 Tinh", "9 Tinh"
];

module.exports = class {
    static config = {
        name: "tutiencanvas",
        aliases: ["daupha", "dauphatruyen", "dpt", "tutien"],
        version: "3.0.0",
        role: 0,
        author: "Panna",
        info: "Đấu Phá Thương Khung: menu, info, rank, skills, shop, douqi, dihoa, giatoc, suphu, daugia, luyenduoc, quest, pvp, boss, craft, market, tinh với Canvas.",
        Category: "Truyện",
        guides: "{pn}tutiencanvas menu",
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
                suphu: SUPHU[0],
                tinh: TINH[0]
            };
            saveData(data);
        }
        const user = data.users[userID];
        const sub = (args[0] || "").toLowerCase();

        // MENU tổng hợp
        if (!sub || sub === "menu") {
            return api.sendMessage(`🌟 ĐẤU PHÁ THƯƠNG KHUNG MENU 🌟\n\n1. Thông tin nhân vật: {pn}tutiencanvas info\n2. Bảng xếp hạng: {pn}tutiencanvas rank\n3. Kỹ năng: {pn}tutiencanvas skills\n4. Shop: {pn}tutiencanvas shop\n5. Đổi/tra cứu Đấu khí: {pn}tutiencanvas douqi [chon id]\n6. Nhận/tra cứu Dị hỏa: {pn}tutiencanvas dihoa [chon id]\n7. Đổi/tra cứu Gia tộc: {pn}tutiencanvas giatoc [chon id]\n8. Đổi/tra cứu Sư phụ: {pn}tutiencanvas suphu [chon id]\n9. Đấu giá: {pn}tutiencanvas daugia\n10. Luyện dược: {pn}tutiencanvas luyenduoc [chon id]\n11. Nhiệm vụ: {pn}tutiencanvas quest\n12. PvP đấu trường: {pn}tutiencanvas pvp [@tag]\n13. Săn boss: {pn}tutiencanvas boss\n14. Chế tạo trang bị: {pn}tutiencanvas craft\n15. Chợ giao dịch: {pn}tutiencanvas market\n16. Đấu phá vượt cảnh giới: {pn}tutiencanvas tinh [chon id]\n\n💡 Dùng {pn}tutiencanvas [lệnh] để biết chi tiết!`, event.threadID, event.messageID);
        }

        // Info với Canvas
        if (sub === "info") {
            try {
                const imageBuffer = await createCharacterCard(user, data);
                return api.sendMessage({
                    body: `👤 Thông tin nhân vật của ${user.name}`,
                    attachment: imageBuffer
                }, event.threadID, event.messageID);
            } catch (error) {
                // Fallback to text if Canvas fails
                const mySkills = user.skills.map(id => {
                    const sk = SKILLS.find(s => s.id === id);
                    return sk ? sk.name : "";
                }).join(", ") || "Không có";
                const myItems = user.items.map(id => {
                    const it = SHOP.find(i => i.id === id);
                    return it ? it.name : "";
                }).join(", ") || "Không có";
                return api.sendMessage(
                    `👤 Thông tin nhân vật:\nTên: ${user.name}\nCấp: ${user.level}\nEXP: ${user.exp}\nXu: ${user.coins}\nKỹ năng: ${mySkills}\nVật phẩm: ${myItems}\nĐấu khí: ${user.douqi}\nDị hỏa: ${(user.dihoa && user.dihoa.length) ? user.dihoa.join(", ") : "Không có"}\nGia tộc: ${user.giatoc}\nSư phụ: ${user.suphu}\nTinh: ${user.tinh}`,
                    event.threadID, event.messageID
                );
            }
        }

        // Rank với Canvas
        if (sub === "rank") {
            try {
                const imageBuffer = await createRankingCard(data);
                return api.sendMessage({
                    body: `🏆 Bảng xếp hạng Đấu Phá`,
                    attachment: imageBuffer
                }, event.threadID, event.messageID);
            } catch (error) {
                // Fallback to text if Canvas fails
                const top = Object.values(data.users)
                    .sort((a, b) => b.level - a.level || b.exp - a.exp)
                    .slice(0, 5)
                    .map((u, i) => `${i + 1}. ${u.name} - Cấp: ${u.level}, EXP: ${u.exp}`)
                    .join("\n");
                return api.sendMessage(`🏆 Bảng xếp hạng Đấu Phá:\n${top}`, event.threadID, event.messageID);
            }
        }

        // Skills với Canvas
        if (sub === "skills") {
            if (!args[1]) {
                try {
                    const imageBuffer = await createSkillCard(SKILLS, user.skills);
                    return api.sendMessage({
                        body: `⚔️ Kỹ năng của bạn\nMua: {pn}tutiencanvas skills buy [id]`,
                        attachment: imageBuffer
                    }, event.threadID, event.messageID);
                } catch (error) {
                    // Fallback to text if Canvas fails
                    const mySkills = user.skills.length
                        ? user.skills.map(id => {
                            const sk = SKILLS.find(s => s.id === id);
                            return sk ? `- ${sk.name} (Lv${sk.level}): ${sk.desc}` : "";
                        }).join("\n")
                        : "Bạn chưa có kỹ năng nào. Dùng {pn}tutiencanvas skills buy [id] để mua.";
                    const allSkills = SKILLS.map(s => `ID: ${s.id} | ${s.name} (Lv${s.level}) - ${s.desc} | Giá: ${s.price} xu`).join("\n");
                    return api.sendMessage(`Kỹ năng của bạn:\n${mySkills}\n\nKỹ năng có thể mua:\n${allSkills}\n\nMua: {pn}tutiencanvas skills buy [id]`, event.threadID, event.messageID);
                }
            }
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

        // Shop với Canvas
        if (sub === "shop") {
            if (!args[1]) {
                try {
                    const imageBuffer = await createShopCard(SHOP);
                    return api.sendMessage({
                        body: `🛒 Cửa hàng Đấu Phá\nMua: {pn}tutiencanvas shop buy [id]`,
                        attachment: imageBuffer
                    }, event.threadID, event.messageID);
                } catch (error) {
                    // Fallback to text if Canvas fails
                    const shopList = SHOP.map(i => `ID: ${i.id} | ${i.name} - ${i.desc} | Giá: ${i.price} xu`).join("\n");
                    return api.sendMessage(`Cửa hàng Đấu Phá:\n${shopList}\n\nMua: {pn}tutiencanvas shop buy [id]`, event.threadID, event.messageID);
                }
            }
            if (args[1] === "buy" && args[2]) {
                const itemID = parseInt(args[2]);
                const item = SHOP.find(i => i.id === itemID);
                if (!item) return api.sendMessage("ID vật phẩm không hợp lệ!", event.threadID, event.messageID);
                let price = item.price;
                if (user.suphu === "Pháp Lão") price = Math.floor(price * 0.9);
                if (user.coins < price) return api.sendMessage("Bạn không đủ xu để mua vật phẩm này!", event.threadID, event.messageID);
                user.coins -= price;
                user.items.push(itemID);
                saveData(data);
                return api.sendMessage(`Bạn đã mua vật phẩm ${item.name}! (giá: ${price} xu)`, event.threadID, event.messageID);
            }
        }

        // Boss với Canvas
        if (sub === "boss") {
            try {
                const imageBuffer = await createBossCard(BOSSES);
                return api.sendMessage({
                    body: `🐲 Boss hiện tại\nDùng {pn}tutiencanvas boss danh [id] để tấn công!`,
                    attachment: imageBuffer
                }, event.threadID, event.messageID);
            } catch (error) {
                // Fallback to text if Canvas fails
                const bossList = BOSSES.map(b => `ID: ${b.id} | ${b.name} - HP: ${b.hp} | Thưởng: ${b.reward}`).join("\n");
                return api.sendMessage(`🐲 Boss hiện tại:\n${bossList}\n\nDùng {pn}tutiencanvas boss danh [id] để tấn công!\n(Chức năng boss sẽ được cập nhật chi tiết sau!)`, event.threadID, event.messageID);
            }
        }

        // Đấu khí
        if (sub === "douqi") {
            if (args[1] === "chon" && args[2]) {
                const idx = parseInt(args[2]) - 1;
                if (idx < 0 || idx >= DOUQI.length) return api.sendMessage("ID đấu khí không hợp lệ!", event.threadID, event.messageID);
                const needExp = (idx + 1) * 100;
                if (user.exp < needExp) return api.sendMessage(`Bạn cần ${needExp} EXP để lên cấp này!`, event.threadID, event.messageID);
                user.douqi = DOUQI[idx];
                let bonus = 0;
                if (user.suphu === "Huân Nhi") bonus = Math.floor(needExp * 0.1);
                user.exp -= needExp;
                user.coins += 100 + bonus;
                saveData(data);
                return api.sendMessage(`Chúc mừng! Bạn đã lên cấp đấu khí: ${user.douqi} (mất ${needExp} EXP, nhận ${100 + bonus} xu${bonus > 0 ? ", bonus từ Huân Nhi: " + bonus + " xu" : ""})`, event.threadID, event.messageID);
            }
            return api.sendMessage(`Các cấp bậc Đấu khí:\n${DOUQI.map((d, i) => `${i + 1}. ${d}`).join("\n")}\n\nChọn: {pn}tutiencanvas douqi chon [id] (cần đủ EXP, lên cấp nhận xu, bonus nếu có sư phụ)`, event.threadID, event.messageID);
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
            return api.sendMessage(`Các loại Dị Hỏa nổi bật:\n${DIHOA.map((d, i) => `${i + 1}. ${d}`).join("\n")}\n\nNhận: {pn}tutiencanvas dihoa chon [id]`, event.threadID, event.messageID);
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
                user.suphu = SUPHU[0];
                user.lastChangeClan = now;
                saveData(data);
                return api.sendMessage(`Bạn đã đổi sang gia tộc: ${user.giatoc} (mất 200 xu, sư phụ về mặc định)`, event.threadID, event.messageID);
            }
            return api.sendMessage(`Các gia tộc lớn:\n${GIATOC.map((g, i) => `${i + 1}. ${g}`).join("\n")}\n\nChọn: {pn}tutiencanvas giatoc chon [id] (mất 200 xu, mỗi ngày 1 lần)`, event.threadID, event.messageID);
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
            return api.sendMessage(`Các sư phụ nổi bật:\n${SUPHU.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nChọn: {pn}tutiencanvas suphu chon [id]`, event.threadID, event.messageID);
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
                const price = 100;
                if (user.coins < price) return api.sendMessage(`Bạn cần ${price} xu để luyện dược phẩm này!`, event.threadID, event.messageID);
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
            return api.sendMessage(`Các loại dược phẩm nổi bật:\n${LUYENDUOC.map((i, idx) => `${idx + 1}. ${i.name} - ${i.desc}`).join("\n")}\n\nLuyện: {pn}tutiencanvas luyenduoc chon [id] (mỗi lần luyện tốn 100 xu, có thể thất bại)`, event.threadID, event.messageID);
        }

        // Tinh (Đấu phá vượt cảnh giới)
        if (sub === "tinh") {
            if (args[1] === "chon" && args[2]) {
                const idx = parseInt(args[2]) - 1;
                if (idx < 0 || idx >= TINH.length) return api.sendMessage("ID tinh không hợp lệ!", event.threadID, event.messageID);
                const needExp = (idx + 1) * 200;
                if (user.exp < needExp) return api.sendMessage(`Bạn cần ${needExp} EXP để đạt ${TINH[idx]}!`, event.threadID, event.messageID);
                user.tinh = TINH[idx];
                user.exp -= needExp;
                user.coins += 150;
                saveData(data);
                return api.sendMessage(`Chúc mừng! Bạn đã đạt ${user.tinh}! (mất ${needExp} EXP, nhận 150 xu)`, event.threadID, event.messageID);
            }
            return api.sendMessage(`Đấu phá vượt cảnh giới:\n${TINH.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nChọn: {pn}tutiencanvas tinh chon [id] (cần đủ EXP, đạt tinh nhận xu)`, event.threadID, event.messageID);
        }

        // Quest
        if (sub === "quest") {
            const questList = QUESTS.map(q => `ID: ${q.id} | ${q.name} - ${q.desc} | Thưởng: ${q.reward}`).join("\n");
            return api.sendMessage(`🎯 Nhiệm vụ hàng ngày:\n${questList}\n\n(Chức năng nhiệm vụ sẽ được cập nhật chi tiết sau!)`, event.threadID, event.messageID);
        }

        // PvP
        if (sub === "pvp") {
            return api.sendMessage(`⚔️ PvP đấu trường:\nDùng {pn}tutiencanvas pvp [@tag] để thách đấu người khác!\n(Chức năng PvP sẽ được cập nhật chi tiết sau!)`, event.threadID, event.messageID);
        }

        // Craft
        if (sub === "craft") {
            const craftList = CRAFTS.map(c => `ID: ${c.id} | ${c.name} - Yêu cầu: ${Object.entries(c.require).map(([k,v])=>`${v} ${k}`).join(", ")} | ${c.desc}`).join("\n");
            return api.sendMessage(`⚒️ Chế tạo trang bị:\n${craftList}\n\nDùng {pn}tutiencanvas craft [id] để chế tạo!\n(Chức năng craft sẽ được cập nhật chi tiết sau!)`, event.threadID, event.messageID);
        }

        // Market
        if (sub === "market") {
            let market = loadMarket();
            if (!args[1]) {
                if (!market.length) return api.sendMessage("Chợ hiện chưa có vật phẩm nào được rao bán!", event.threadID, event.messageID);
                const list = market.map((m, i) => `${i + 1}. ${m.item} - Giá: ${m.price} xu - Người bán: ${m.sellerName}`).join("\n");
                return api.sendMessage(`🛒 Chợ giao dịch:\n${list}\n\nMua: {pn}tutiencanvas market mua [id]`, event.threadID, event.messageID);
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
            return api.sendMessage(`🛒 Chợ giao dịch:\n- Xem chợ: {pn}tutiencanvas market\n- Bán vật phẩm: {pn}tutiencanvas market ban [tên vật phẩm] [giá]\n- Mua vật phẩm: {pn}tutiencanvas market mua [id]`, event.threadID, event.messageID);
        }

        return api.sendMessage("Lệnh không hợp lệ. Dùng {pn}tutiencanvas menu để xem hướng dẫn.", event.threadID, event.messageID);
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