const mensagensDiv = document.querySelector('.mensagens');
let usuarioName = '';
let destinatario = 'Todos';
let mesageType = 'message';

function logarSala() {
  usuarioName = prompt('Digite seu user:');
  const usuario = { name: usuarioName };
  const response = axios
    .post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario)
    .then(() => {
      carregarMensagens();
      setInterval(carregarMensagens, 3000);
      setInterval(manterConexao, 4750);
    })
    .catch(tratar);

  function tratar(err) {
    if (err.response.status !== 200) {
      usuarioName = prompt('User já logado, digite outro user:');
      const usuario = { name: usuarioName };
      const response = axios
        .post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario)
        .then(() => {
          carregarMensagens();
          setInterval(carregarMensagens, 3000);
          setInterval(manterConexao, 4750);
        })
        .catch(tratar);
    }
  }

  function manterConexao() {
    const usuario = { name: usuarioName };

    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
  }
}
logarSala();

function carregarMensagens() {
  mensagensDiv.innerHTML = '';
  axios
    .get('https://mock-api.driven.com.br/api/v6/uol/messages')
    .then(renderizarMensagens);

  function renderizarMensagens(promise) {
    const data = promise.data;
    data.forEach((dados, index) => {
      if (dados.type === 'status') {
        const mensagemTemplate = `<div class="mensagem ${dados.type}">
          <time class="hora">(${dados.time})</time> <span>${dados.from}</span> ${dados.text}
        </div>`;
        mensagensDiv.innerHTML += mensagemTemplate;
      } else {
        const mensagemTemplate = `<div class="mensagem ${dados.type}">
        <time class="hora">(${dados.time})</time> <span>${dados.from}</span> para
        <span>${dados.to}</span>: ${dados.text}
        </div>`;

        if (dados.type === 'private_message' && dados.from === usuarioName) {
          mensagensDiv.innerHTML += mensagemTemplate;
        }
        if (dados.type === 'private_message' && dados.to !== usuarioName) {
          // n faz nada (n renderiza a mensagem)
        } else {
          mensagensDiv.innerHTML += mensagemTemplate;
        }
      }
    });

    const ultimaMensagem = mensagensDiv.lastChild;
    ultimaMensagem.scrollIntoView();
  }
}

function enviarMensagem() {
  const mensagem = document.getElementById('mensagem-text').value;

  const data = {
    from: usuarioName,
    to: destinatario,
    text: mensagem,
    type: mesageType,
  };

  axios
    .post('https://mock-api.driven.com.br/api/v6/uol/messages', data)
    .then(carregarMensagens)
    .catch(() => window.location.reload());
}

function adicionarEventoTexto() {
  document
    .getElementById('mensagem-text')
    .addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        enviarMensagem();
      }
    });
}
adicionarEventoTexto();
