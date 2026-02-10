import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-5816eee8/health", (c) => {
  return c.json({ status: "ok" });
});

// Proxy endpoint for currency prices
app.get("/make-server-5816eee8/prices", async (c) => {
  try {
    const response = await fetch("http://31.59.105.156/prices");
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching prices:", error);
    return c.json(
      { 
        status: "Error", 
        message: "Failed to fetch prices from external API",
        error: error.message 
      }, 
      500
    );
  }
});

Deno.serve(app.fetch);