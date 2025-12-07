import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// CONTINENTES
app.get('/continentes', async (req, res) => {
  const lista = await prisma.continente.findMany({ orderBy: { id: 'asc' } });
  res.json(lista);
});

app.post('/continentes', async (req, res) => {
  try {
    const novo = await prisma.continente.create({ data: req.body });
    res.json(novo);
  } catch (error) { console.log("Erro:", error); res.status(400).json({ error: "Erro ao criar" }); }
});

app.put('/continentes/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  try {
    const atualizado = await prisma.continente.update({
      where: { id: Number(id) },
      data: { nome, descricao }
    });
    res.json(atualizado);
  } catch (error) { res.status(400).json({ error: "Erro ao atualizar" }); }
});

app.delete('/continentes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.continente.delete({ where: { id: Number(id) } });
    res.json({ message: "Deletado" });
  } catch (error) { res.status(400).json({ error: "Erro ao deletar (verifique se tem países vinculados)" }); }
});

// PAÍSES
app.get('/paises', async (req, res) => {
  const lista = await prisma.pais.findMany({ include: { continente: true }, orderBy: { id: 'asc' } });
  res.json(lista);
});

app.post('/paises', async (req, res) => {
  try {
    const { nome, populacao, idioma, moeda, continenteId } = req.body;
    const novo = await prisma.pais.create({
      data: { nome, populacao: Number(populacao), idioma, moeda, continenteId: Number(continenteId) }
    });
    res.json(novo);
  } catch (error) { console.log("Erro:", error); res.status(400).json({ error: "Erro ao criar" }); }
});

app.put('/paises/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, populacao, idioma, moeda, continenteId } = req.body;
  try {
    const atualizado = await prisma.pais.update({
      where: { id: Number(id) },
      data: { nome, populacao: Number(populacao), idioma, moeda, continenteId: Number(continenteId) }
    });
    res.json(atualizado);
  } catch (error) { res.status(400).json({ error: "Erro ao atualizar" }); }
});

app.delete('/paises/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.pais.delete({ where: { id: Number(id) } });
    res.json({ message: "Deletado" });
  } catch (error) { res.status(400).json({ error: "Erro ao deletar" }); }
});

// CIDADES
app.get('/cidades', async (req, res) => {
  const lista = await prisma.cidade.findMany({ include: { pais: true }, orderBy: { id: 'asc' } });
  res.json(lista);
});

app.post('/cidades', async (req, res) => {
  try {
    const { nome, populacao, latitude, longitude, paisId } = req.body;
    const nova = await prisma.cidade.create({
      data: { nome, populacao: Number(populacao), latitude: Number(latitude), longitude: Number(longitude), paisId: Number(paisId) }
    });
    res.json(nova);
  } catch (error) { console.log("Erro:", error); res.status(400).json({ error: "Erro ao criar" }); }
});

app.put('/cidades/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, populacao, latitude, longitude, paisId } = req.body;
  try {
    const atualizada = await prisma.cidade.update({
      where: { id: Number(id) },
      data: { nome, populacao: Number(populacao), latitude: Number(latitude), longitude: Number(longitude), paisId: Number(paisId) }
    });
    res.json(atualizada);
  } catch (error) { res.status(400).json({ error: "Erro ao atualizar" }); }
});

app.delete('/cidades/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.cidade.delete({ where: { id: Number(id) } });
    res.json({ message: "Deletado" });
  } catch (error) { res.status(400).json({ error: "Erro ao deletar" }); }
});

// API
app.get('/info-pais/:nome', async (req, res) => {
  const { nome } = req.params;
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${nome}`);
    const dados = response.data[0];
    res.json({
      nomeOficial: dados.name.official,
      bandeira: dados.flags.png,
      regiao: dados.region
    });
  } catch (error) { res.status(404).json({ error: "Não encontrado" }); }
});

app.get('/clima', async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    res.json(response.data.current_weather);
  } catch (error) { res.status(400).json({ error: "Erro ao buscar clima" }); }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor e APIs rodando na porta ${PORT}`);
});