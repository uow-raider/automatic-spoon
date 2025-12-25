let raiderTimer = null;
let totalSentCount = 0;

const raiderForm = document.getElementById('raiderForm');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusText = document.getElementById('statusText');
const countText = document.getElementById('countText');

raiderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 設定の取得
    const tokenList = document.getElementById('tokens').value.split(/\r?\n/).filter(t => t.trim() !== "");
    const channelId = document.getElementById('channelId').value.trim();
    const message = document.getElementById('message').value;
    const intervalMs = parseFloat(document.getElementById('interval').value) * 1000;

    if (tokenList.length === 0) return alert("トークンを入力してください");

    // UI更新
    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusText.innerText = "RUNNING";
    statusText.style.color = "#00d4ff";

    const sendMessage = async () => {
        for (const token of tokenList) {
            try {
                const response = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': token.trim(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content: message })
                });

                if (response.ok) {
                    totalSentCount++;
                    countText.innerText = totalSentCount;
                } else if (response.status === 429) {
                    console.warn("レート制限中...");
                } else {
                    console.error("エラー:", response.status);
                }
            } catch (err) {
                console.error("送信失敗:", err);
            }
            // トークンごとの連投検知回避（0.2秒待機）
            await new Promise(r => setTimeout(r, 200));
        }
    };

    // ループ開始
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
