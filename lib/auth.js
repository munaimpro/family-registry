import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

let dbAdapter = undefined;

try {
  const uri = process.env.MONGODB_URI;
  if (uri && uri.trim() !== "") {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    dbAdapter = mongodbAdapter(client.db());
  }
} catch (err) {
  console.warn("MongoDB connection warning:", err.message);
}

export const auth = betterAuth({
  ...(dbAdapter ? { database: dbAdapter } : {}),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  secret: process.env.BETTER_AUTH_SECRET || "omskp-secure-auth-secret-key-2026",
  baseURL: process.env.BETTER_AUTH_URL || "https://ais-dev-imv2gtiegvnhenegnl4vkb-142875536356.asia-southeast1.run.app",
  trustedOrigins: [
    "http://localhost:3000",
    "https://ais-dev-imv2gtiegvnhenegnl4vkb-142875536356.asia-southeast1.run.app",
    "https://ais-pre-imv2gtiegvnhenegnl4vkb-142875536356.asia-southeast1.run.app",
  ],
});
