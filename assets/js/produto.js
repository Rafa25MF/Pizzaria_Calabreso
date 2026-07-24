const campoQuantidade = document.getElementById("qt_pizza");
const textoPreco = document.getElementById("preço");
const botaoComprar = document.getElementById("comprar");
const nomeProduto = document.body.dataset.produtoNome;
const precoProduto = Number(document.body.dataset.produtoPreco);
const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

// O conteúdo do localStorage é tratado como não confiável antes do uso.
function lerCarrinho() {
    try {
        const conteudo = JSON.parse(localStorage.getItem("carrinho"));
        return Array.isArray(conteudo) ? conteudo : [];
    } catch {
        return [];
    }
}

function lerQuantidade() {
    const quantidade = Number.parseInt(campoQuantidade.value, 10);
    return Number.isInteger(quantidade) && quantidade > 0 ? quantidade : 0;
}

function atualizarPreco() {
    const quantidade = lerQuantidade();
    textoPreco.textContent = `Total a Pagar: ${formatadorMoeda.format(quantidade * precoProduto)}`;
}

// Agrupa produtos repetidos para evitar linhas duplicadas no carrinho.
function adicionarAoCarrinho() {
    const quantidade = lerQuantidade();
    if (!quantidade) {
        alert("Por favor, insira a quantidade de pizzas.");
        campoQuantidade.focus();
        return;
    }

    const carrinho = lerCarrinho();
    const itemExistente = carrinho.find((item) => item.nome === nomeProduto);

    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({ nome: nomeProduto, preco: precoProduto, quantidade });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    window.location.href = "carrinho.html";
}

campoQuantidade.addEventListener("input", atualizarPreco);
botaoComprar.addEventListener("click", adicionarAoCarrinho);
atualizarPreco();
