// utils/testCors.ts
export async function testCors(url: string, origin: string) {
  console.log(`🔍 Testing CORS for: ${url} with origin ${origin}`);

  try {
    const res = await fetch(url, {
      method: "OPTIONS",
      mode: "cors",
      headers: {
        Origin: origin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type"
      }
    });

    console.log("Status:", res.status);
    console.log("Headers:");
    console.log("  Access-Control-Allow-Origin:", res.headers.get("Access-Control-Allow-Origin"));
    console.log("  Access-Control-Allow-Methods:", res.headers.get("Access-Control-Allow-Methods"));
    console.log("  Access-Control-Allow-Headers:", res.headers.get("Access-Control-Allow-Headers"));
    console.log("  Access-Control-Allow-Credentials:", res.headers.get("Access-Control-Allow-Credentials"));

    if (res.headers.get("Access-Control-Allow-Origin") === origin) {
      console.log("✅ CORS is correctly configured.");
    } else {
      console.warn("⚠️ CORS origin mismatch! Requests may fail.");
    }
  } catch (err) {
    console.error("❌ CORS test failed:", err);
  }
}
