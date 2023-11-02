const html = document.querySelector('html');
const btnFoco = document.querySelector('.app__card-button--foco');
const btnCurto = document.querySelector('.app__card-button--curto');
const btnLongo = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const title = document.querySelector('.app__title');
const btnArray = document.querySelectorAll('.app__card-button');
const viewTimer = document.querySelector('#timer');
const btnOnOffMusic = document.querySelector('#alternar-musica');
const btnStartPause = document.querySelector('#start-pause');
const btnPauseCount = document.querySelector('#start-pause span');
const imgPauseCount = document.querySelector('#start-pause img');
const btnZerarCount = document.querySelector('#zerar-count');
const music = new Audio('/sons/luna-rise-part-one.mp3');
const play = new Audio('/sons/play.wav');
const pause = new Audio('/sons/pause.mp3');
const beep = new Audio('/sons/beep.mp3');
music.loop = true;
let temporizador = 1500;
let tempoInicial = null;

btnOnOffMusic.addEventListener('change', () => {
    if (music.paused) {
        music.play();
        music.volume = 1;
    } else {
        pause.pause();
        music.pause();
    }
})

btnFoco.addEventListener('click', () => {
    temporizador = 1500;
    alteraTelaInicial('foco');
    btnFoco.classList.add('active');
    btnZerarCount.classList.add('disabled');
})

btnCurto.addEventListener('click', () => {
    temporizador = 300;
    alteraTelaInicial('descanso-curto');
    btnCurto.classList.add('active');
    btnZerarCount.classList.add('disabled');
})

btnLongo.addEventListener('click', () => {
    temporizador = 900;
    alteraTelaInicial('descanso-longo');
    btnLongo.classList.add('active');
    btnZerarCount.classList.add('disabled');
})

btnZerarCount.addEventListener('click', () => {
    stopZeraContador();
    btnZerarCount.classList.add('disabled');
    temporizador = 1500;
    alteraTelaInicial('foco');
    btnFoco.classList.add('active');
});

function alteraTelaInicial(contexto) {
    mostrarTempoTela();
    btnArray.forEach(function (contexto) {
        contexto.classList.remove('active');
    });
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);
    switch (contexto) {
        case 'foco':
            title.innerHTML = `Otimize sua produtividade,<br />
                <strong class="app__title-strong">mergulhe no que importa.</strong>`;
            break;
        case 'descanso-curto':
            title.innerHTML = `Que tal dar uma respirada?<br />
                <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
            break;
        case 'descanso-longo':
            title.innerHTML = `Hora de voltar à superfície.<br />
                <strong class="app__title-strong">Faça uma pausa longa.</strong>`;
            break;
        default:
            break;
    }
}

const contagemTemporizador = () => {
    if (temporizador <= 0) {
        beep.play();
        alert("Tempo esgotado!!!");
        btnZerarCount.classList.add('disabled');
        btnPauseCount.textContent = "Começar";
        imgPauseCount.setAttribute('src', '/imagens/play_arrow.png');
        zerarContador();
        temporizador = 5;
        return;
    }
    temporizador -= 1;
    mostrarTempoTela();
}

btnStartPause.addEventListener('click', iniciarPausarContador);

function iniciarPausarContador() {
    if (tempoInicial) {
        pause.play();
        btnPauseCount.textContent = "Continuar";
        imgPauseCount.setAttribute('src', '/imagens/play_arrow.png');
        zerarContador();
        return;
    }
    play.play();
    tempoInicial = setInterval(contagemTemporizador, 1000); //tempo em milisegundos
    btnPauseCount.textContent = "Pausar";
    imgPauseCount.setAttribute('src', '/imagens/pause.png');
    btnZerarCount.classList.remove('disabled');
}

function zerarContador() {
    clearInterval(tempoInicial);
    tempoInicial = null;
}

function stopZeraContador() {
    if(tempoInicial) {
        pause.play();
        btnPauseCount.textContent = "Começar";
        imgPauseCount.setAttribute('src', '/imagens/play_arrow.png');
        zerarContador();
        return;
    }
}

function mostrarTempoTela() {
    const tempo = new Date(temporizador * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-BR', { minute: '2-digit', second: '2-digit' });
    viewTimer.innerHTML = `${tempoFormatado}`;
}

mostrarTempoTela();