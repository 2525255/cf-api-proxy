export default {
  async fetch(request, env) {
    const API_KEY = "kunAcYXyrlrVHreUIgZePnRHBNSpOROe";
    const shareId = "866";

    const targetUrl = new URL("https://10086id.com/client/getShareAccounts");
    targetUrl.searchParams.set("id", shareId);

    const res = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: {
        "X-API-Key": API_KEY
      }
    });
    const jsonData = await res.json();

    // 判断：如果是程序接口请求，直接返回JSON；浏览器访问返回美化页面
    const ua = request.headers.get("user-agent") || "";
    const isBrowser = /Chrome|Firefox|Safari|Edge|Opera/i.test(ua);
    if (!isBrowser) {
      return new Response(JSON.stringify(jsonData, null, 2), {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 浏览器访问：渲染美化页面
    let html = "";
    if (jsonData.ret !== 1 || !Array.isArray(jsonData.data) || jsonData.data.length === 0) {
      html = `
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>资源中转页</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box;font-family:system-ui,"Microsoft YaHei"}
          body{background:#f5f7fa;padding:60px 20px}
          .box{max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:36px;box-shadow:0 4px 16px rgba(0,0,0,0.05)}
          h1{text-align:center;color:#222;margin-bottom:24px;padding-bottom:14px;border-bottom:1px solid #eee;font-size:23px}
          .tip{text-align:center;color:#e04040;font-size:16px}
        </style>
      </head>
      <body>
        <div class="box">
          <h1>账号资源中转页</h1>
          <p class="tip">暂无可用账号资源，请稍后刷新</p>
        </div>
      </body>
      </html>
      `;
    } else {
      const item = jsonData.data[0];
      const area = item.region_display;
      const account = item.username;
      const secretKey = item.password;
      const checkTime = item.last_check;

      html = `
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>账号资源中转页</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box;font-family:system-ui,"Microsoft YaHei"}
          body{background:#f5f7fa;padding:60px 16px}
          .container{max-width:560px;margin:0 auto}
          .card{background:#fff;border-radius:18px;padding:38px;box-shadow:0 4px 20px rgba(0,0,0,0.06)}
          h1{text-align:center;color:#1f2937;font-size:24px;padding-bottom:16px;border-bottom:1px solid #eeeeee;margin-bottom:30px}
          .line{display:flex;padding:15px 0;border-bottom:1px solid #f1f1f1;align-items:center}
          .line:last-child{border-bottom:none}
          .label{width:115px;color:#6b7280;font-weight:500;font-size:15px}
          .value{flex:1;color:#111827;font-size:15px;word-break:break-all}
          .copyBtn{width:100%;height:48px;margin-top:32px;border:none;border-radius:12px;background:#2563eb;color:#fff;font-size:16px;cursor:pointer;transition:0.2s}
          .copyBtn:hover{background:#1d4ed8}
          .smallTip{text-align:center;margin-top:12px;font-size:13px;color:#9ca3af}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <h1>账号资源中转页</h1>
            <div class="line">
              <div class="label">所属地区</div>
              <div class="value">${area}</div>
            </div>
            <div class="line">
              <div class="label">资源账号</div>
              <div class="value" id="acc">${account}</div>
            </div>
            <div class="line">
              <div class="label">密钥</div>
              <div class="value" id="key">${secretKey}</div>
            </div>
            <div class="line">
              <div class="label">最后检测时间</div>
              <div class="value">${checkTime}</div>
            </div>
            <button class="copyBtn" onclick="copyData()">一键复制【账号 | 密钥】</button>
            <p class="smallTip">复制格式：资源账号 | 密钥</p>
          </div>
        </div>
        <script>
          function copyData(){
            const acc = document.getElementById('acc').innerText;
            const key = document.getElementById('key').innerText;
            const text = acc + " | " + key;
            navigator.clipboard.writeText(text).then(()=>{
              alert("✅ 复制成功，可直接粘贴使用");
            }).catch(()=>{
              alert("❌ 复制失败，请手动框选文字复制");
            })
          }
        </script>
      </body>
      </html>
      `;
    }

    return new Response(html, {
      headers: {
        "Content-Type": "text/html;charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
