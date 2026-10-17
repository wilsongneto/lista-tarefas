const form = document.getElementById('form-tarefa');
const inputTitulo = document.getElementById('titulo');
const lista = document.getElementById('lista');

async function carregarTarefas() {
  const resposta = await fetch('/api/tarefas');
  const tarefas = await resposta.json();
  lista.innerHTML = '';

  tarefas.forEach(tarefa => {
    const li = document.createElement('li');
    if (tarefa.concluida) li.classList.add('concluida');

    const texto = document.createElement('span');
    texto.textContent = tarefa.titulo; // textContent evita injeção de HTML (XSS)
    texto.addEventListener('click', () => alternar(tarefa.id));

    const botao = document.createElement('button');
    botao.textContent = 'Apagar';
    botao.className = 'apagar';
    botao.addEventListener('click', () => apagar(tarefa.id));

    li.append(texto, botao);
    lista.appendChild(li);
  });
}

async function alternar(id) {
  await fetch(`/api/tarefas/${id}`, { method: 'PATCH' });
  carregarTarefas();
}

async function apagar(id) {
  await fetch(`/api/tarefas/${id}`, { method: 'DELETE' });
  carregarTarefas();
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  await fetch('/api/tarefas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo: inputTitulo.value })
  });
  inputTitulo.value = '';
  carregarTarefas();
});

carregarTarefas();