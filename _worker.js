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

    // 非浏览器访问直接返回JSON
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
          <h1>资源中转页</h1>
          <p class="tip">暂无可用资源，请稍后刷新页面重试</p>
        </div>
      </body>
      </html>
      `;
    } else {
      const item = jsonData.data[0];
      const area = item.region_display;
      const resource = item.username;
      const secret = item.password;
      const checkTime = item.last_check;

      html = `
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>资源中转页</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box;font-family:system-ui,"Microsoft YaHei"}
          body{background:#f5f7fa;padding:60px 16px}
          .container{max-width:560px;margin:0 auto}
          .card{background:#fff;border-radius:18px;padding:38px;box-shadow:0 4px 20px rgba(0,0,0,0.06)}
          h1{text-align:center;color:#1f2937;font-size:24px;padding-bottom:16px;border-bottom:1px solid #eeeeee;margin-bottom:30px}
          .line{display:flex;padding:15px 0;border-bottom:1px solid #f1f1f1;align-items:center}
          .line:last-child{border-bottom:none}
          .label{width:115px;color:#6b7280;font-weight:500;font-size:15px}
          .hide-text{flex:1;color:#999;font-size:15px;letter-spacing:4px}
          .btn-wrap{display:flex;gap:14px;margin-top:32px}
          .copyBtn{flex:1;height:48px;border:none;border-radius:12px;color:#fff;font-size:16px;cursor:pointer;transition:0.2s}
          .btn-res{background:#2563eb;}
          .btn-res:hover{background:#1d4ed8}
          .btn-sec{background:#0891b2;}
          .btn-sec:hover{background:#0e7490}
          .smallTip{text-align:center;margin-top:16px;font-size:13px;color:#9ca3af}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <h1>资源中转页</h1>
            <div class="line">
              <div class="label">所属地区</div>
              <div class="hide-text">${area}</div>
            </div>
            <div class="line">
              <div class="label">资源</div>
              <div class="hide-text">******</div>
            </div>
            <div class="line">
              <div class="label">密钥</div>
              <div class="hide-text">******</div>
            </div>
            <div class="line">
              <div class="label">最后检测时间</div>
              <div class="hide-text">${checkTime}</div>
            </div>
            <div class="btn-wrap">
              <button class="copyBtn btn-res" onclick="copyResource()">复制资源</button>
              <button class="copyBtn btn-sec" onclick="copySecret()">复制密钥</button>
            </div>
            <p class="smallTip">点击对应按钮一键复制对应内容</p>
          </div>
        </div>
        <script>
          // 把真实内容存于JS变量，页面不展示明文
          const realResource = "${resource}";
          const realSecret = "${secret}";
          function copyResource(){
            navigator.clipboard.writeText(realResource).then(()=>{
              alert("✅ 资源复制成功");
            }).catch(()=>{
              alert("❌ 复制失败，可切换浏览器重试");
            })
          }
          function copySecret(){
            navigator.clipboard.writeText(realSecret).then(()=>{
              alert("✅ 密钥复制成功");
            }).catch(()=>{
              alert("❌ 复制失败，可切换浏览器重试");
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
