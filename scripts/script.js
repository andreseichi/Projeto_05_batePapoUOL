const mensagensDiv = document.querySelector('.mensagens');

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

carregarMensagens();

setInterval(carregarMensagens, 3000);
