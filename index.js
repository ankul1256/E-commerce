import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { LanguageDetector } from "i18next-http-middleware";
import middleware from "i18next-http-middleware";

i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallback: "en",
    preload: ["en", "es"],
    Backend: {
      loadPath: "locales/{{lng}}.json",
    },
  });

dotenv.config("./.env");

const connectionString = process.env.connectionString;
const PORT = process.env.PORT;
const app = express();

app.use(middleware.handle(i18next))

app.get("/health", (req, res) => {
  res.status(200).send(req.t("welcome"));
});

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("connected to Mongodb successfully");
  })
  .catch((err) => {
    console.error("MongoDB is not available");
  });
app.listen(PORT | 3000, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
