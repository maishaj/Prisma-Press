import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";

const app:Application=express();

// Middlewares (Express build in middlewares)

app.use(cors({
   origin: config.app_url,
   credentials:true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get("/", (req:Request, res:Response)=>{
    res.send("Hello World");
});

export default app;

