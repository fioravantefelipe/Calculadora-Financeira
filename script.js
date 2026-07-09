let salarioBase = parseFloat(localStorage.getItem('salarioBase')) || 0;
let movimentacoes = JSON.parse(localStorage.getItem('movimentacoes')) || [];


window.onload = function() {
    atualizarInterface();
};

function atualizarInterface() {
    let volumeTotal = 0;
    let saldoCalculado = salarioBase; 

    
    movimentacoes.forEach(item => {
        volumeTotal += item.valor; 

        if (item.tipo === 'ganho') {
            saldoCalculado += item.valor; 
        } else {
            saldoCalculado -= item.valor; 
        }
    });
    
    document.getElementById('txt-salario').innerText = `R$ ${salarioBase.toFixed(2)}`;
    document.getElementById('txt-movimentacoes').innerText = `R$ ${volumeTotal.toFixed(2)}`;
    document.getElementById('txt-saldo').innerText = `R$ ${saldoCalculado.toFixed(2)}`;

    const painelSaldo = document.querySelector('.saldo-final');
    if (saldoCalculado < 0) {
        painelSaldo.style.backgroundColor = '#e74c3c';
    } else {
        painelSaldo.style.backgroundColor = '#27ae60';
    }

    renderizarListaHistorico();
}

function renderizarListaHistorico() {
    const lista = document.getElementById('lista-historico');
    lista.innerHTML = '';

    movimentacoes.forEach((item, index) => {
        const novoItem = document.createElement('li');
        novoItem.classList.add(item.tipo);
        const sinal = item.tipo === 'ganho' ? '+' : '-';
        
        novoItem.innerHTML = `
            <span>${item.descricao}</span>
            <div>
                <strong style="margin-right: 15px;">${sinal} R$ ${item.valor.toFixed(2)}</strong>
                <button class="btn-deletar" onclick="deletarItem(${index})">&times;</button>
            </div>
        `;
        lista.appendChild(novoItem);
    });
}

function definirSalario() {
    const inputSalario = document.getElementById('salario');
    const valor = parseFloat(inputSalario.value);

    if (!isNaN(valor) && valor >= 0) {
        salarioBase = valor;
        localStorage.setItem('salarioBase', salarioBase);
        
        atualizarInterface(); 
        inputSalario.value = '';
    } else {
        alert('Por favor, insira um salário válido.');
    }
}

function adicionarMovimentacao() {
    const inputDescricao = document.getElementById('descricao');
    const inputValor = document.getElementById('valor');
    const inputTipo = document.getElementById('tipo');

    const descricao = inputDescricao.value.trim();
    const valor = parseFloat(inputValor.value);
    const tipo = inputTipo.value;

    if (descricao === '' || isNaN(valor) || valor <= 0) {
        alert('Preencha a descrição e insira um valor válido.');
        return;
    }

    movimentacoes.push({ descricao, valor, tipo });
    localStorage.setItem('movimentacoes', JSON.stringify(movimentacoes));

    atualizarInterface();
    
    inputDescricao.value = '';
    inputValor.value = '';
}

function deletarItem(index) {
    movimentacoes.splice(index, 1);
    localStorage.setItem('movimentacoes', JSON.stringify(movimentacoes));
    
    atualizarInterface(); 
}

function limparDados() {
    if (confirm("Tem certeza que deseja limpar todo o seu histórico e o salário?")) {
        localStorage.clear();
        salarioBase = 0;
        movimentacoes = [];
        atualizarInterface();
    }
}