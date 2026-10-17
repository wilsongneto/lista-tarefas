const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'tarefas.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Funções auxiliares ----------
function lerTarefas() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function salvarTarefas(tarefas) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(tarefas, null, 2));
}

// ---------- Rotas da API ----------
app.get('/api/tarefas', (req, res) => {
  res.json(lerTarefas());
});

app.post('/api/tarefas', (req, res) => {
  const titulo = String(req.body?.titulo ?? '').trim();
  if (!titulo) {
    return res.status(400).json({ erro: 'O título é obrigatório.' });
  }
  const tarefas = lerTarefas();
  const nova = { id: Date.now(), titulo, concluida: false };
  tarefas.push(nova);
  salvarTarefas(tarefas);
  res.status(201).json(nova);
});

app.patch('/api/tarefas/:id', (req, res) => {
  const tarefas = lerTarefas();
  const tarefa = tarefas.find(t => t.id === Number(req.params.id));
  if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada.' });
  tarefa.concluida = !tarefa.concluida;
  salvarTarefas(tarefas);
  res.json(tarefa);
});

app.delete('/api/tarefas/:id', (req, res) => {
  const tarefas = lerTarefas().filter(t => t.id !== Number(req.params.id));
  salvarTarefas(tarefas);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});