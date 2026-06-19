import { bootstrap } from "./app.controller";
import express, { Express } from "express";
const app: Express = express();
bootstrap(app, express);
