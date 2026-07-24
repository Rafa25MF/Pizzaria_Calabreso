document.querySelector(".btn-cancelar").addEventListener("click", (e) => {
    e.preventDefault(); // impede o redirecionamento imediato

    const confirmar = confirm("Tem certeza que deseja cancelar o pedido e esvaziar o carrinho?");
    if (confirmar) {
        localStorage.removeItem("carrinho"); // apaga todos os itens do carrinho
        window.location.href = "index.html"; // redireciona para a página inicial
    }
});

function lerCarrinho() {
    try {
        const conteudo = JSON.parse(localStorage.getItem("carrinho"));
        return Array.isArray(conteudo) ? conteudo : [];
    } catch {
        return [];
    }
}

// Função para formatar preços
function formatarPreco(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function criarCelula(rotulo, conteudo) {
    const celula = document.createElement("td");
    celula.dataset.label = rotulo;
    if (conteudo instanceof Node) {
        celula.appendChild(conteudo);
    } else {
        celula.textContent = conteudo;
    }
    return celula;
}

// Função para carregar o carrinho do localStorage
function carregarCarrinho() {
    const carrinho = lerCarrinho();
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // limpa tabela antes de renderizar

    let totalGeral = 0;

    carrinho.forEach((item, index) => {
        const totalItem = item.preco * item.quantidade;
        totalGeral += totalItem;

        const tr = document.createElement("tr");
        const quantidade = document.createElement("input");
        quantidade.type = "number";
        quantidade.value = item.quantidade;
        quantidade.min = "1";
        quantidade.dataset.index = index;

        const excluir = document.createElement("button");
        excluir.type = "button";
        excluir.className = "btn-excluir";
        excluir.dataset.index = index;
        excluir.textContent = "Excluir";

        tr.append(
            criarCelula("Pizza", String(item.nome)),
            criarCelula("Preço Unitário", formatarPreco(Number(item.preco))),
            criarCelula("Quantidade", quantidade),
            criarCelula("Total", formatarPreco(totalItem)),
            criarCelula("Ações", excluir)
        );
        tbody.appendChild(tr);
    });

    document.querySelector(".total span").textContent = formatarPreco(totalGeral);

    adicionarEventos();
}

// Função para adicionar eventos aos botões e inputs
function adicionarEventos() {
    // Remover item
    document.querySelectorAll(".btn-excluir").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.getAttribute("data-index");
            removerItem(index);
        });
    });

    // Atualizar quantidade
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener("change", (e) => {
            const index = e.target.getAttribute("data-index");
            const novaQtd = parseInt(e.target.value);
            atualizarQuantidade(index, novaQtd);
        });
    });
}

// Função para remover item do carrinho
function removerItem(index) {
    const carrinho = lerCarrinho();
    carrinho.splice(index, 1);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    carregarCarrinho();
}

// Função para atualizar a quantidade
function atualizarQuantidade(index, novaQtd) {
    const carrinho = lerCarrinho();
    if (novaQtd < 1) novaQtd = 1;
    carrinho[index].quantidade = novaQtd;
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    carregarCarrinho();
}
// Finalizar pedido
document.querySelector(".btn-finalizar").addEventListener("click", () => {
    const carrinho = lerCarrinho();
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    alert("Pedido finalizado com sucesso! 🍕");
    localStorage.removeItem("carrinho");
    carregarCarrinho();
});

// Inicializa ao carregar a página
window.addEventListener("DOMContentLoaded", carregarCarrinho);
