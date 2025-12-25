let raiderTimer = null;
let totalSentCount = 0;

const raiderForm = document.getElementById('raiderForm');
const tokensArea = document.getElementById('tokens');
const targetIdsArea = document.getElementById('targetUserIds');
const mentionInput = document.getElementById('mentionCount');
const toggleBtn = document.getElementById('toggleBtn');
const fetchUsersBtn = document.getElementById('fetchUsersBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusText = document.getElementById('statusText');
const countText = document.getElementById('countText');

// トークン表示切り替え
toggleBtn.addEventListener('click', () => {
    if (tokensArea.classList.contains('masked')) {
        tokensArea.classList.remove('masked');
        toggleBtn.innerText = "トークンを隠す";
    } else {
        tokensArea.classList.add('masked');
        toggleBtn.innerText = "トークンを表示する";
    }
});

// 20文字のランダム文字列生成（改行から開始）
function generateStrongRandom() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "\n"; 
    for (let i = 0; i < 20; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// ユーザーID取得（チャンネル履歴から）
fetchUsersBtn.addEventListener('click', async () => {
    const tokenList = tokensArea.value.split(/\r?\n/).filter(t => t.trim() !== "");
    const channelId = document.getElementById('channelId').value.trim();
    if (!tokenList[0] || !channelId) return alert("トークンとチャンネルIDが必要です");

    fetchUsersBtn.innerText = "取得中...";
    try {
        const res = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages?limit=50`, {
            headers: { 'Authorization': tokenList[0].trim() }
        });
        const messages = await res.json();
        const ids = [...new Set(messages.map(m => m.author.id))];
        targetIdsArea.value = ids.join("\n");
        alert(`${ids.length}名のIDを取得しました`);
    } catch (err) { alert("取得失敗"); }
    fetchUsersBtn.innerText = "ユーザーID取得";
});

// 送信実行
raiderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const tokenList = tokensArea.value.split(/\r?\n/).filter(t => t.trim() !== "");
    const channelId = document.getElementById('channelId').value.trim();
    const messageBase = document.getElementById('message').value;
    const intervalMs = parseInt(document.getElementById('interval').value);
    const mentionNum = parseInt(mentionInput.value);
    const targetIds = targetIdsArea.value.split(/\r?\n/).filter(id => id.trim() !== "");

    if (tokenList.length === 0) return;

    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusText.innerText = "RUNNING";
    statusText.style.color = "#00d4ff";

    const sendMessage = async () => {
        for (const token of tokenList) {
            if (raiderTimer === null) return;

            let mentions = "";
            if (mentionNum > 0 && targetIds.length > 0) {
                const shuffled = [...targetIds].sort(() => 0.5 - Math.random());
                mentions = shuffled.slice(0, mentionNum).map(id => `<@${id.trim()}>`).join(" ");
            }

            const finalMessage = `${mentions} ${messageBase} ${generateStrongRandom()}`;

            try {
                const response = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': token.trim(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content: finalMessage })
                });
                if (response.ok) {
                    totalSentCount++;
                    countText.innerText = totalSentCount;
                }
            } catch (err) { console.error(err); }
            await new Promise(r => setTimeout(r, 150));
        }
    };

    sendMessage();
    raiderTimer = setInterval(sendMessage, intervalMs);
});

stopBtn.addEventListener('click', () => {
    clearInterval(raiderTimer);
    raiderTimer = null;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusText.innerText = "STOPPED";
    statusText.style.color = "#ff0055";
});
