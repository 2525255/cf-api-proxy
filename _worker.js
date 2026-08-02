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

    // 非浏览器访问，返回完整原始JSON
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

    // 空资源页面
    if (jsonData.ret !== 1 || !Array.isArray(jsonData.data) || jsonData.data.length === 0) {
      return new Response(`
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>资源宝库</title>
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
          <h1>资源宝库</h1>
          <p class="tip">暂无可用资源，请稍后刷新页面重试</p>
        </div>
      </body>
      </html>
      `, {
        headers: {
          "Content-Type": "text/html;charset=utf-8"
        }
      });
    }

    // 资源脱敏函数：前3位 + *** + 末尾2位
    function maskResource(str) {
      if (!str || str.length <= 5) return "******";
      return str.slice(0, 3) + "***" + str.slice(-2);
    }

    let listHtml = "";
    jsonData.data.forEach((item, index) => {
      const resource = item.username;
      const secret = item.password;
      const checkTime = item.last_check;
      const rid = `res${index}`;
      const sid = `sec${index}`;

      const showRes = maskResource(resource);
      // 密钥全程完全隐藏
      const showSec = "******";

      listHtml += `
      <div style="margin-bottom:26px;padding-bottom:22px;border-bottom:1px solid #eee">
        <div style="font-weight:bold;margin-bottom:12px;color:#333">第${index+1}组资源</div>
        <div class="line">
          <div class="label">资源</div>
          <div class="hide-text">${showRes}</div>
        </div>
        <div class="line">
          <div class="label">密钥</div>
          <div class="hide-text">${showSec}</div>
        </div>
        <div class="line">
          <div class="label">最后检测时间</div>
          <div class="hide-text">${checkTime}</div>
        </div>
        <div class="btn-wrap">
          <button class="copyBtn btn-res" onclick="copyItem('${rid}','资源')">复制资源</button>
          <button class="copyBtn btn-sec" onclick="copySecret('${sid}')">复制密钥</button>
        </div>
        <input type="hidden" id="${rid}" value="${resource}">
        <input type="hidden" id="${sid}" value="${secret}">
      </div>
      `;
    });

    const pageHtml = `
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>资源宝库</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box;font-family:system-ui,"Microsoft YaHei"}
        body{background:#f5f7fa;padding:60px 16px}
        .container{max-width:560px;margin:0 auto}
        .card{background:#fff;border-radius:18px;padding:38px;box-shadow:0 4px 20px rgba(0,0,0,0.06)}
        h1{text-align:center;color:#1f2937;font-size:24px;padding-bottom:16px;border-bottom:1px solid #eeeeee;margin-bottom:30px}
        .line{display:flex;padding:12px 0;align-items:center}
        .label{width:115px;color:#6b7280;font-weight:500;font-size:15px}
        .hide-text{flex:1;color:#444;font-size:15px;letter-spacing:1px}
        .btn-wrap{display:flex;gap:14px;margin-top:16px}
        .copyBtn{flex:1;height:44px;border:none;border-radius:12px;color:#fff;font-size:15px;cursor:pointer;transition:0.2s}
        .btn-res{background:#2563eb;}
        .btn-res:hover{background:#1d4ed8}
        .btn-sec{background:#0891b2;}
        .btn-sec:hover{background:#0e7490}
        .smallTip{text-align:center;margin-top:16px;font-size:13px;color:#9ca3af}
        /* 弹窗通用样式 */
        .mask{
          position:fixed;left:0;top:0;width:100%;height:100%;
          background:rgba(0,0,0,0.3);display:none;
          justify-content:center;align-items:center;z-index:999;
        }
        .pop-box{background:#fff;padding:30px 35px;border-radius:16px;min-width:300px;text-align:center;}
        .pop-text{font-size:17px;margin-bottom:20px;color:#222;line-height:1.6;}
        .pop-input{width:100%;padding:12px 14px;border:1px solid #ddd;border-radius:10px;font-size:16px;margin-bottom:24px;outline:none;}
        .pop-btn{padding:10px 32px;border:none;background:#2563eb;color:#fff;border-radius:99px;font-size:16px;cursor:pointer;margin:0 8px;}
        .pop-cancel{background:#94a3b8;}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <h1>资源宝库</h1>
          ${listHtml}
          <p class="smallTip">点击对应按钮一键复制本组完整内容</p>
        </div>
      </div>

      <!-- 普通提示弹窗 -->
      <div class="mask" id="tipMask">
        <div class="pop-box">
          <div class="pop-text" id="tipText"></div>
          <button class="pop-btn" onclick="closeTip()">确定</button>
        </div>
      </div>

      <!-- 密钥口令验证弹窗 -->
      <div class="mask" id="pwdMask">
        <div class="pop-box">
          <div class="pop-text">小程序点击【实施工具交流】提取口令</div>
          <input class="pop-input" id="pwdInput" placeholder="请输入提取口令" type="text">
          <div>
            <button class="pop-btn" onclick="checkPassword()">确认验证</button>
            <button class="pop-btn pop-cancel" onclick="closePwdMask()">取消</button>
          </div>
        </div>
      </div>

      <script>
        // 弹窗控制
        const tipMask = document.getElementById('tipMask');
        const tipText = document.getElementById('tipText');
        const pwdMask = document.getElementById('pwdMask');
        const pwdInput = document.getElementById('pwdInput');
        let waitingCopyId = "";
        const correctPwd = "4536";// 密钥

        // 提示弹窗
        function showTip(msg){
          tipText.innerText = msg;
          tipMask.style.display = 'flex';
        }
        function closeTip(){
          tipMask.style.display = 'none';
        }
        // 口令弹窗
        function openPwdMask(){
          pwdInput.value = "";
          pwdMask.style.display = 'flex';
        }
        function closePwdMask(){
          pwdMask.style.display = 'none';
        }

        // 普通资源复制（无验证）
        function copyItem(id,name){
          const val = document.getElementById(id).value;
          navigator.clipboard.writeText(val).then(()=>{
            showTip(name + "复制成功");
          }).catch(()=>{
            showTip("复制失败，请更换浏览器重试");
          })
        }

        // 密钥复制：打开口令弹窗，记录要复制的ID
        function copySecret(secId){
          waitingCopyId = secId;
          openPwdMask();
        }

        // 口令校验
        function checkPassword(){
          const inputVal = pwdInput.value.trim();
          if(inputVal === correctPwd){
            closePwdMask();
            // 验证通过，执行复制
            const secretVal = document.getElementById(waitingCopyId).value;
            navigator.clipboard.writeText(secretVal).then(()=>{
              showTip("验证成功，密钥复制成功");
            }).catch(()=>{
              showTip("复制失败，请更换浏览器重试");
            })
          }else{
            showTip("口令错误，请重新输入提取口令");
          }
        }
      </script>
    </body>
    </html>
    `;

    return new Response(pageHtml, {
      headers: {
        "Content-Type": "text/html;charset=utf-8"
      }
    });
  }
}
