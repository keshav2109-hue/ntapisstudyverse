export default {
  async fetch(request) {
    const url = new URL(request.url);
    const getdata = url.searchParams.get("getdata");
    const type = url.searchParams.get("type");

    if (!getdata || !type) {
      return new Response(
        JSON.stringify({ status: false, error: "Missing parameters" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Original API endpoint
    const apiUrl = `https://ntx.apiway.workers.dev/?getdata=${getdata}&type=${type}`;

    try {
      const res = await fetch(apiUrl, {
        headers: { "User-Agent": "studyverse-proxy" }
      });
      const data = await res.json();

      // Normalize response format
      let items = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data.data && Array.isArray(data.data)) {
        items = data.data;
      } else if (data.items && Array.isArray(data.items)) {
        items = data.items;
      }

      // Always return a unified structure
      return new Response(
        JSON.stringify({ status: true, items }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ status: false, error: err.message }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
