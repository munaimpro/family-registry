import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add your MONGODB_URI to .env");
}

// Global caching for Next.js hot reload
let client;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri);
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(uri);
}

const db = client.db("omskp");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    changeEmail: {
      enabled: true,
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log(`[Verification] Sent to ${user.email}`);
      console.log(`[Verification] URL: ${url}`);
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: 'jwt',
      maxAge: 24 * 60 * 60
    }
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    "http://localhost:3000",
    "https://omskp-blood-bank.vercel.app",
    // "https://ais-dev-imv2gtiegvnhenegnl4vkb-142875536356.asia-southeast1.run.app",
    // "https://ais-pre-imv2gtiegvnhenegnl4vkb-142875536356.asia-southeast1.run.app",
  ],
  plugins: [
    jwt()
  ]
});