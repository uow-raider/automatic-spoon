let raiderInterval = null; // 繰り返し処理を保持する変数

document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.querySelector('.btn');
    
    // すでに実行中の場合は停止処理を行う
    if (raiderInterval) {
        stopRaider();
        return;
    }

    // フォームデータの取得
    const token = document.querySelector('input[placeholder="Token"]').value;
    const channelId = document.querySelector('input[placeholder="Channel ID"]').value;
    const message = document.querySelector('textarea').value;
    const intervalSeconds = parseFloat(document.querySelector('input[type="number"]').value) || 1;

    // バリデーション
    if (!token || !channelId || !message) {
        alert("トークン、チャンネルID、メッセージ内容は必須です。");
        return;
    }

    // ボタンの表示を「停止」に変更
    btn.textContent = "停止 (実行中...)";
    btn.style.background = "#ff4444"; // 停止ボタンらしく赤色に

    // メッセージ送信処理
    const sendMessage = async () => {
        const url = `https://discord.com/api/v9/channels/${channelId}/messages`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: message,
                    tts: false
                })
            });

            if (!response.ok) {
                console.error("送信失敗。レート制限の可能性があります:", await response.text());
                // エラーが起きたら止める場合はここを有効化
                // stopRaider(); 
            }
        } catch (error) {
            console.error("ネットワークエラー:", error);
        }
    };

    // 初回送信
    sendMessage();

    // 指定した秒数（ミリ秒換算）ごとに繰り返し実行
    raiderInterval = setInterval(sendMessage, intervalSeconds * 1000);
});

// 停止するための関数
function stopRaider() {
    if (raiderInterval) {
        clearInterval(raiderInterval);
        raiderInterval = null;
        
        const btn = document.querySelector('.btn');
        btn.textContent = "実行";
        btn.style.background = "#007bff"; // 元の青色に戻す
        alert("送信を停止しました。");
    }
}
