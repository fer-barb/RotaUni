// variáveis globais 
let tipoCalculo = 'simples';
let secaoAtual = 'inicio';

// quando a página carregar:
document.addEventListener('DOMContentLoaded', () => {
    
    // logica de navegação do menu
    const botoesNavegacao = document.querySelectorAll('[data-navegar]');
    const paginas = document.querySelectorAll('.pagina');
    const menuCelular = document.getElementById('menuMobile');
    const botaoAbrirMenu = document.querySelector('.btn-mobile');

    // função para troca de página
    function mudarPagina(idPagina) {
        // esconde todas as páginas e mostra apenas correta
        paginas.forEach(pagina => {
            pagina.classList.remove('ativa');
            if (pagina.id === idPagina) {
                pagina.classList.add('ativa');
            }
        });

        // atualiza cor dos botões do menu
        botoesNavegacao.forEach(btn => {
            btn.classList.remove('ativo');
            if (btn.dataset.navegar === idPagina) {
                btn.classList.add('ativo');
            }
        });

        secaoAtual = idPagina;
        
        // se tiver no celular, fecha menu depois de clicar
        menuCelular.classList.remove('ativo');
        
        // volta para topo da página
        window.scrollTo(0, 0);
    }

    // adiciona o clique em todos os botões do menu
    botoesNavegacao.forEach(btn => {
        btn.addEventListener('click', () => {
            mudarPagina(btn.dataset.navegar);
        });
    });

    // abre e fecha menu no celular
    if (botaoAbrirMenu) {
        botaoAbrirMenu.addEventListener('click', () => {
            // se tiverclasse ativo tira, se não tiver coloca (toggle)
            menuCelular.classList.toggle('ativo');
        });
    }

    // lógica das Abas refernte a tab programas
    const botoesAba = document.querySelectorAll('.btn-aba');
    const paineisAba = document.querySelectorAll('.painel-aba');

    botoesAba.forEach(btn => {
        btn.addEventListener('click', (evento) => {
            const idAba = evento.target.dataset.aba;
            
            // remove classe 'ativo' de tudo
            botoesAba.forEach(b => b.classList.remove('ativo'));
            paineisAba.forEach(p => p.classList.remove('ativo'));
            
            // adiciona a classe 'ativo' só no que foi clicado
            evento.target.classList.add('ativo');
            document.getElementById(idAba).classList.add('ativo');
        });
    });

    // lógica da calculadora 
    const botoesTipoCalc = document.querySelectorAll('.btn-tipo');
    const inputsPeso = document.querySelectorAll('.input-peso');
    const infoPesos = document.getElementById('infoPesos');
    const textoRodape = document.getElementById('textoRodapeCalc');
    const descricao = document.getElementById('descricaoCalc');
    const formulario = document.getElementById('formCalculadora');
    const botaoLimpar = document.getElementById('btnLimpar');
    
    // troca entre média simples e ponderada
    botoesTipoCalc.forEach(btn => {
        btn.addEventListener('click', (evento) => {
            const tipo = evento.target.dataset.tipo;
            tipoCalculo = tipo; // Atualiza a variável global

            // atualiza os botões
            botoesTipoCalc.forEach(b => b.classList.remove('ativo'));
            evento.target.classList.add('ativo');

            // mostra / esconde campos para peso
            if (tipo === 'ponderada') {
                inputsPeso.forEach(input => input.classList.remove('escondido'));
                infoPesos.classList.remove('escondido');
                descricao.textContent = 'Digite suas notas e os pesos para calcular a média ponderada.';
                textoRodape.innerHTML = '<strong>Importante:</strong> como dito acima, lembre-se de consultar o edital do curso para saber os pesos corretos.';
            } else {
                inputsPeso.forEach(input => input.classList.add('escondido'));
                infoPesos.classList.add('escondido');
                descricao.textContent = 'Digite suas notas do Enem (0 a 1000) para calcular a média simples.';
                textoRodape.innerHTML = '<strong>Importante:</strong> Use a calculadora ponderada se o curso tiver pesos específicos.';
            }
            
            // esconde resultado anterior se mudar tipo
            document.getElementById('resultadoCalc').classList.add('escondido');
        });
    });

    //  clicand em "Calcular"
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault(); // não deixa a página de recarregar
        
        const materias = ['linguagens', 'matematica', 'humanas', 'natureza', 'redacao'];
        let somaNotas = 0;
        let somaPesos = 0;
        let digitouAlgo = false;

        materias.forEach(materia => {
            const inputNota = document.getElementById(materia);
            const inputPeso = document.getElementById('peso-' + materia);
            
            // se não tem valor, é considerado 0
            const nota = parseFloat(inputNota.value) || 0;
            
            // se for média simples, o peso é sempre 1. caso seja media  ponderada, pega o valor digitado (ou 1 se vazio)
            let peso = 1;
            if (tipoCalculo === 'ponderada') {
                peso = parseFloat(inputPeso.value) || 1;
            }

            if (inputNota.value !== '') {
                digitouAlgo = true;
            }

            somaNotas += nota * peso;
            somaPesos += peso;
        });

        if (digitouAlgo === false) {
            return; // Para a função se tudo estiver vazio
        }

        const mediaFinal = somaPesos > 0 ? (somaNotas / somaPesos) : 0;
        mostrarResultado(mediaFinal);
    });

    function mostrarResultado(media) {
        const divResultado = document.getElementById('resultadoCalc');
        const rotulo = document.getElementById('rotuloResultado');
        const valor = document.getElementById('valorResultado');
        const info = document.getElementById('infoResultado');

        divResultado.classList.remove('escondido');
        valor.textContent = media.toFixed(2); 
        
        if (tipoCalculo === 'simples') {
            rotulo.textContent = 'Sua média simples é:';
            if (media >= 450) {
                info.textContent = 'Você atinge a nota mínima para ProUni e FIES (450+).';
                info.style.color = 'var(--verde-principal)';
            } else {
                info.textContent = 'Nota abaixo da mínima exigida para ProUni e FIES (450 pontos).';
                info.style.color = '#ef4444'; 
            }
        } else {
            rotulo.textContent = 'Sua média ponderada é:';
            info.textContent = 'Compare este resultado com a nota de corte do curso desejado.';
            info.style.color = 'var(--cinza-texto)';
        }
    }

    // Botão Limpar
    botaoLimpar.addEventListener('click', () => {
        formulario.reset();
        document.getElementById('resultadoCalc').classList.add('escondido');
    });

    // Coloca o ano atual no rodapé
    document.getElementById('anoAtual').textContent = new Date().getFullYear();
});