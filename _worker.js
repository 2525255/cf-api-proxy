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
          body{background:linear-gradient(135deg,#f0f4ff,#f5f7fa);padding:70px 20px;min-height:100vh}
          .box{max-width:560px;margin:0 auto;background:#fff;border-radius:20px;padding:40px;box-shadow:0 6px 24px rgba(0,0,0,0.06)}
          h1{text-align:center;color:#111;margin-bottom:26px;padding-bottom:16px;border-bottom:1px solid #eee;font-size:24px}
          .tip{text-align:center;color:#dc2626;font-size:17px;line-height:1.7}
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
      const showSec = "******";

      listHtml += `
      <div class="item-block">
        <div class="item-title">第${index+1}组资源</div>
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
        body{
          background:linear-gradient(135deg,#eff6ff,#f8fafc);
          padding:70px 16px;
          min-height:100vh;
        }
        .container{max-width:560px;margin:0 auto}
        .card{
          background:#ffffff;
          border-radius:22px;
          padding:40px;
          box-shadow:0 8px 30px rgba(0,0,0,0.07);
        }
        h1{
          text-align:center;
          color:#1e293b;
          font-size:26px;
          padding-bottom:18px;
          border-bottom:1px solid #e5e7eb;
          margin-bottom:18px;
          letter-spacing:1px;
        }
        /* 顶部公告提示框 */
        .notice-box{
          background:#fffbeb;
          border:1px solid #fcd34d;
          border-radius:14px;
          padding:16px 18px;
          margin-bottom:28px;
          color:#92400e;
          font-size:15px;
          line-height:1.7;
          text-align:center;
          font-weight:500;
        }
        /* 每组资源区块 */
        .item-block{
          padding-bottom:26px;
          margin-bottom:26px;
          border-bottom:1px dashed #e2e8f0;
        }
        .item-block:last-child{
          border-bottom:none;
          margin-bottom:0;
          padding-bottom:0;
        }
        .item-title{
          font-weight:600;
          font-size:17px;
          color:#27272a;
          margin-bottom:14px;
        }
        .line{
          display:flex;
          padding:13px 0;
          align-items:center;
        }
        .label{
          width:120px;
          color:#64748b;
          font-weight:500;
          font-size:15px;
        }
        .hide-text{
          flex:1;
          color:#334155;
          font-size:15px;
          letter-spacing:1px;
        }
        .btn-wrap{
          display:flex;
          gap:16px;
          margin-top:18px;
        }
        .copyBtn{
          flex:1;
          height:46px;
          border:none;
          border-radius:14px;
          color:#fff;
          font-size:15px;
          cursor:pointer;
          transition:all 0.25s ease;
          font-weight:500;
        }
        .btn-res{background:#2563eb;}
        .btn-res:hover{background:#1d4ed8;transform:translateY(-2px);box-shadow:0 4px 12px rgba(37,99,235,0.3)}
        .btn-sec{background:#0891b2;}
        .btn-sec:hover{background:#0e7490;transform:translateY(-2px);box-shadow:0 4px 12px rgba(8,145,178,0.3)}
        .smallTip{
          text-align:center;
          margin-top:20px;
          font-size:13px;
          color:#94a3b8;
        }
        /* 弹窗通用样式 */
        .mask{
          position:fixed;left:0;top:0;width:100%;height:100%;
          background:rgba(0,0,0,0.35);display:none;
          justify-content:center;align-items:center;z-index:999;
        }
        .pop-box{
          background:#fff;
          padding:34px 38px;
          border-radius:20px;
          min-width:320px;
          text-align:center;
          box-shadow:0 10px 40px rgba(0,0,0,0.12);
        }
        .pop-text{
          font-size:17px;
          margin-bottom:22px;
          color:#222;
          line-height:1.65;
        }
        .pop-input{
          width:100%;
          padding:13px 16px;
          border:1px solid #d1d5db;
          border-radius:12px;
          font-size:16px;
          margin-bottom:26px;
          outline:none;
          transition:0.2s;
        }
        .pop-input:focus{
          border-color:#2563eb;
          box-shadow:0 0 0 3px rgba(37,99,235,0.15);
        }
        .pop-btn{
          padding:11px 34px;
          border:none;
          background:#2563eb;
          color:#fff;
          border-radius:99px;
          font-size:16px;
          cursor:pointer;
          margin:0 8px;
          transition:0.2s;
        }
        .pop-btn:hover{transform:translateY(-1px)}
        .pop-cancel{background:#94a3b8;}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <h1>资源宝库</h1>
          <div class="notice-box">
            每10分钟自动获取最新资源，如获取失败请重新刷新页面并前往小程序再次获取口令！
          </div>
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

      <!-- 密钥口令验证弹窗，密码框隐藏明文 -->
      <div class="mask" id="pwdMask">
        <div class="pop-box">
          <div class="pop-text">小程序查看【实施工具交流】提取口令</div>
          <input class="pop-input" id="pwdInput" placeholder="请输入提取口令" type="password" autocomplete="off">
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
        const correctPwd = "55231";

        function showTip(msg){
          tipText.innerText = msg;
          tipMask.style.display = 'flex';
        }
        function closeTip(){
          tipMask.style.display = 'none';
        }
        function openPwdMask(){
          pwdInput.value = "";
          pwdMask.style.display = 'flex';
        }
        function closePwdMask(){
          pwdMask.style.display = 'none';
        }

        // 资源直接复制
        function copyItem(id,name){
          const val = document.getElementById(id).value;
          navigator.clipboard.writeText(val).then(()=>{
            showTip(name + "复制成功");
          }).catch(()=>{
            showTip("复制失败，请更换浏览器重试");
          })
        }

        // 密钥打开验证弹窗
        function copySecret(secId){
          waitingCopyId = secId;
          openPwdMask();
        }

        // 口令校验
        function checkPassword(){
          const inputVal = pwdInput.value.trim();
          if(inputVal === correctPwd){
            closePwdMask();
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
