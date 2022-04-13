const mensagensDiv = document.querySelector('.mensagens');
let usuarioName = '';

function logarSala() {
  usuarioName = prompt('Digite seu user:');
  const usuario = { name: usuarioName };
  const response = axios
    .post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario)
    .then(() => {
      carregarMensagens();
      setInterval(() => manterConexao(), 4750);
    })
    .catch(tratar);

  function tratar(err) {
    if (err.response.status !== 200) {
      usuarioName = prompt('User já logado, digite outro user:');
      const usuario = { name: usuarioName };
      const response = axios
        .post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario)
        .catch(tratar);
    }
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
        mensagensDiv.innerHTML += mensagemTemplate;
      }
    });

    const ultimaMensagem = mensagensDiv.lastChild;
    ultimaMensagem.scrollIntoView();
  }
}

function manterConexao() {
  const usuario = { name: usuarioName };

  axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
}

setInterval(carregarMensagens, 3000);
