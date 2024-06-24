// Importando o módulo 'express' para criar o servidor
import express, { Request, Response } from "express";

// Importando o módulo 'cors' para lidar com a política de mesma origem
import cors from "cors";

// Importando o módulo 'dotenv' para carregar variáveis de ambiente a partir de um arquivo .env
import "dotenv/config";

import moongoose from "mongoose"; // Importando o módulo 'mongoose' para lidar com o banco de dados MongoDB

// Importando o roteador de usuários
import userRoutes from "./routes/users";
// Importando o roteador de autenticação
import authRouter from "./routes/auth";

// Conectando com o banco de dados MongoDB
moongoose.connect(process.env.MONGODB_CONECTING_STRING as string);

// Criando uma instância do servidor express
const app = express();

// Utilizando o middleware 'express.json()' para fazer o parsing do corpo das requisições como JSON
app.use(express.json());

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Utilizando o middleware 'cors' para permitir requisições de diferentes origens
app.use(cors());

app.use("/api/auth", authRouter); // Utilizando o roteador de autenticação

// Utilizando o roteador de usuários
app.use("/api/users", userRoutes);


app.listen(7001, () => {
  console.log("Server is running on port 7001");
}); // Inicializando o servidor na porta 7000
