import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return true;

  const primaryUri = process.env.MONGODB_URI;
  const localUri = "mongodb://127.0.0.1:27017/deepscout";

  const isPlaceholder = primaryUri && primaryUri.includes("PASSWORD");

  if (!isPlaceholder && primaryUri) {
    try {
      console.log("[MongoDB] Connecting to primary URI...");
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 4000,
      });
      isConnected = true;
      console.log(`[MongoDB] Connected to database: ${conn.connection.name || conn.connection.host}`);
      return true;
    } catch (primaryError) {
      console.warn(`[MongoDB] Primary connection failed (${primaryError.message}). Attempting local fallback...`);
    }
  } else if (isPlaceholder) {
    console.log("[MongoDB] Placeholder detected in MONGODB_URI. Connecting to running local MongoDB service...");
  }

  // Fallback to local MongoDB service (running on Windows)
  try {
    const conn = await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected to local MongoDB at ${localUri}`);
    return true;
  } catch (localError) {
    console.error(`[MongoDB] Failed to connect to local MongoDB: ${localError.message}`);
    isConnected = false;
    return false;
  }
};

export const getDBStatus = () => isConnected && mongoose.connection.readyState === 1;
