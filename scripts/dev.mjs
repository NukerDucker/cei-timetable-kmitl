// Local dev server: serves index.html and proxies /kmitl/api to KMITL.
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const port = 8787;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);
  if (url.pathname === "/kmitl/api") {
    try {
      const upstream = await fetch("https://regis.reg.kmitl.ac.th/api/" + url.search);
      const body = Buffer.from(await upstream.arrayBuffer());
      res.writeHead(upstream.status, {
        "content-type": upstream.headers.get("content-type") || "application/json; charset=UTF-8",
        "cache-control": "no-store"
      });
      res.end(body);
    } catch (err) {
      res.writeHead(502, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "upstream unavailable" }));
    }
    return;
  }
  const file = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  try {
    const body = await fs.readFile(path.join(root, file));
    res.writeHead(200, { "content-type": file.endsWith(".html") ? "text/html; charset=utf-8" : "application/octet-stream" });
    res.end(body);
  } catch (err) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`CEI schedule dev: http://127.0.0.1:${port}/`);
});
