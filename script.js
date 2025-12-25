let raiderTimer = null;
let totalSentCount = 0;

const raiderForm = document.getElementById('raiderForm');
const tokensArea = document.getElementById('tokens');
const toggleBtn = document.getElementById('toggleBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusText = document.getElementById('statusText');
const countText = document.getElementById('countText');

// --- 表示・非表示の切り替え ---
toggleBtn.addEventListener('click', () => {
    if (tokensArea.classList.contains('masked')) {
        tokensArea.classList.remove('masked');
        toggleBtn.innerText = "トークンを隠す";
    } else {
        tokensArea.classList.add('masked');
        toggleBtn.innerText = "トークンを表示する";
    }
});

raiderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const tokenList = tokensArea.value.split(/\r?\n/).filter(t => t.trim() !== "");
    const channelId = document.getElementById('channelId').value.trim();
    const message = document.getElementById('message').value;
    
    // ミリ秒としてそのまま取得
    const intervalMs = parseInt(document.getElementById('interval').value);

    if (tokenList.length === 0) return alert("トークンを入力してください");
    if (intervalMs < 50) return alert("間隔が短すぎます（最低50ms以上推奨）");

    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusText.innerText = "RUNNING";
    statusText.style.color = "#00d4ff";

    const sendMessage = async () => {
        for (const token of tokenList) {
            // 停止ボタンが押されたらループを抜ける
            if (!raiderTimer && totalSentCount > 0) return;

            // 検知回避用のランダムID生成
            const randomId = Math.random().toString(36).substring(2, 6);
            const finalMessage = `${message} [${randomId}]`;

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
            } catch (err) {
                console.error("送信エラー:", err);
            }
            // アカウント間のごくわずかなディレイ（100ms）
            await new Promise(r => setTimeout(r, 100));
        }
    };

    // 指定したミリ秒でループ
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
