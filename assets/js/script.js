function lerCarrinho() {
    try {
        const conteudo = JSON.parse(localStorage.getItem("carrinho"));
        return Array.isArray(conteudo) ? conteudo : [];
    } catch {
        return [];
    }
}

// === FUNÇÃO GERAL PARA ADICIONAR BEBIDA AO CARRINHO ===
function adicionarBebidaAoCarrinho(nome, preco, idQuantidade) {
    const campoQuantidade = document.getElementById(idQuantidade);
    const quantidade = Number(campoQuantidade.value);

    if (quantidade > 0) {
        const carrinho = lerCarrinho();

        // Verifica se o item já existe no carrinho
        const indexExistente = carrinho.findIndex(item => item.nome === nome);

        if (indexExistente !== -1) {
            carrinho[indexExistente].quantidade += quantidade;
        } else {
            carrinho.push({
                nome: nome,
                preco: preco,
                quantidade: quantidade
            });
        }

        localStorage.setItem("carrinho", JSON.stringify(carrinho));

        // Redireciona para o carrinho
        window.location.href = "carrinho.html";
    } else {
        alert('Por favor, insira a quantidade.');
    }
}

// === EVENTOS DE CADA BEBIDA ===
document.getElementById("comprar_coca").addEventListener("click", function() {
    adicionarBebidaAoCarrinho("Coca-Cola Lata 350ml", 6.00, "qt_coca");
});

document.getElementById("comprar_guarana").addEventListener("click", function() {
    adicionarBebidaAoCarrinho("Dolly Guaraná 2L", 2.90, "qt_guarana");
});

document.getElementById("comprar_suco").addEventListener("click", function() {
    adicionarBebidaAoCarrinho("Refrigerante IT Sabor Cola 2L", 24.90, "qt_suco");
});

function atualizarTotalCarrinho() {
    const totalTexto = document.querySelector(".valor h2");
    const carrinho = lerCarrinho();

    if (carrinho.length === 0) {
        totalTexto.textContent = "R$ 0,00";
        return;
    }

    // soma todos os valores (preço × quantidade)
    const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
    totalTexto.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

window.addEventListener("DOMContentLoaded", atualizarTotalCarrinho);

window.addEventListener("storage", atualizarTotalCarrinho);
