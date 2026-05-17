export const env = {
  PORT: Number(process.env.PORT || 3000),
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret_change_me",
  NODE_ENV: process.env.NODE_ENV || "development",
};