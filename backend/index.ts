import webpush from "web-push";
import ViteApp from "../frontend/dist/index.html";




Bun.serve({
    port: 4173,
    routes: {
        "/": ViteApp,
    }
})


console.log("Hello via Bun!");