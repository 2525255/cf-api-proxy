export default {
  async fetch(request, env) {
    const API_KEY = "EdiHivmCxlMstUCrxusvYNxeNUdpCyQE";
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

    return new Response(JSON.stringify(jsonData, null, 2), {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
