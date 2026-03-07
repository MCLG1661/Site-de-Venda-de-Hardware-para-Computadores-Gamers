// ===== script.js =====
// CARRINHO DE COMPRAS RADICAL

// Classe para gerenciar o carrinho
class CarrinhoGamer {
    constructor() {
        this.itens = this.carregarDoStorage();
        this.atualizarContador();
    }

    // Salvar no localStorage
    salvarNoStorage() {
        localStorage.setItem('carrinhoMestre', JSON.stringify(this.itens));
    }

    // Carregar do localStorage
    carregarDoStorage() {
        const dados = localStorage.getItem('carrinhoMestre');
        return dados ? JSON.parse(dados) : [];
    }

    // Adicionar item
    adicionarItem(produto) {
        // Verifica se o item já existe (pelo ID)
        const existente = this.itens.find(item => item.id === produto.id);
        
        if (existente) {
            existente.quantidade = (existente.quantidade || 1) + 1;
        } else {
            this.itens.push({
                ...produto,
                quantidade: 1
            });
        }
        
        this.salvarNoStorage();
        this.atualizarContador();
        this.exibirNotificacao(`${produto.nome} adicionado!`, 'success');
        this.renderizarCarrinho(); // Atualiza a visualização do carrinho
        
        // Efeito sonoro (opcional - descomente se quiser)
        // this.tocarSom('add');
    }

    // Remover item
    removerItem(id) {
        const index = this.itens.findIndex(item => item.id === id);
        if (index !== -1) {
            const item = this.itens[index];
            this.itens.splice(index, 1);
            this.salvarNoStorage();
            this.atualizarContador();
            this.exibirNotificacao(`${item.nome} removido!`, 'info');
        }
    }

    // Atualizar quantidade
    atualizarQuantidade(id, novaQuantidade) {
        if (novaQuantidade <= 0) {
            this.removerItem(id);
            return;
        }
        
        const item = this.itens.find(item => item.id === id);
        if (item) {
            item.quantidade = novaQuantidade;
            this.salvarNoStorage();
            this.atualizarContador();
        }
    }

    // Calcular total
    calcularTotal() {
        return this.itens.reduce((total, item) => {
            return total + (item.preco * (item.quantidade || 1));
        }, 0);
    }

    // Limpar carrinho
    limpar() {
        this.itens = [];
        this.salvarNoStorage();
        this.atualizarContador();
        this.exibirNotificacao('Carrinho limpo!', 'warning');
    }

    // Atualizar contador no ícone
    atualizarContador() {
        const contador = document.getElementById('carrinho-contador');
        if (contador) {
            const totalItens = this.itens.reduce((acc, item) => acc + (item.quantidade || 1), 0);
            contador.textContent = totalItens;
            
            // Efeito visual se tiver itens
            if (totalItens > 0) {
                contador.style.background = '#ff4d7d';
                contador.style.padding = '0.2rem 0.6rem';
                contador.style.borderRadius = '50%';
            } else {
                contador.style.background = 'transparent';
            }
        }
    }

    // Notificação estilosa
    exibirNotificacao(mensagem, tipo = 'success') {
        const notificacao = document.createElement('div');
        notificacao.textContent = mensagem;
        notificacao.style.position = 'fixed';
        notificacao.style.top = '20px';
        notificacao.style.right = '20px';
        notificacao.style.background = tipo === 'success' ? '#00ff87' : '#ff4d7d';
        notificacao.style.color = 'black';
        notificacao.style.fontWeight = 'bold';
        notificacao.style.padding = '1rem 2rem';
        notificacao.style.borderRadius = '60px';
        notificacao.style.zIndex = '9999';
        notificacao.style.boxShadow = '0 0 30px cyan';
        notificacao.style.animation = 'slideIn 0.3s';
        
        document.body.appendChild(notificacao);
        
        setTimeout(() => {
            notificacao.remove();
        }, 2000);
    }

    // Renderizar carrinho no modal
    renderizarCarrinho() {
        const container = document.getElementById('carrinho-itens');
        if (!container) return;
        
        if (this.itens.length === 0) {
            container.innerHTML = '<p style="text-align: center; font-size: 2rem; color: #ff4d7d;">🕹️ CARRINHO VAZIO</p>';
            document.getElementById('carrinho-total').textContent = 'Total: R$ 0,00';
            return;
        }
        
        let html = '';
        this.itens.forEach(item => {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; background: #1f2a38; margin: 1rem 0; padding: 1rem; border-radius: 20px; border-left: 6px solid #ff4d7d;">
                    <div>
                        <h4 style="color: white;">${item.nome}</h4>
                        <p style="color: #f5e56b;">R$ ${item.preco.toFixed(2)}</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <button class="btn-qtd" data-id="${item.id}" data-acao="diminuir" style="padding: 0.5rem 1rem; font-size: 1.5rem;">-</button>
                        <span style="font-size: 1.5rem; color: cyan;">${item.quantidade || 1}</span>
                        <button class="btn-qtd" data-id="${item.id}" data-acao="aumentar" style="padding: 0.5rem 1rem; font-size: 1.5rem;">+</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        document.getElementById('carrinho-total').textContent = `Total: R$ ${this.calcularTotal().toFixed(2).replace('.', ',')}`;

        // Adiciona listeners para os botões de quantidade recém-criados
        this.adicionarListenersQtd();
    }

    adicionarListenersQtd() {
        document.querySelectorAll('.btn-qtd').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const acao = e.target.dataset.acao;
                const item = this.itens.find(i => i.id === id);

                if (item) {
                    let quantidade = item.quantidade || 1;
                    if (acao === 'aumentar') {
                        quantidade++;
                    } else {
                        quantidade--;
                    }
                    this.atualizarQuantidade(id, quantidade);
                    this.renderizarCarrinho(); // Re-renderiza o carrinho para refletir a mudança
                }
            });
        });
    }
} // Fim da classe CarrinhoGamer

/**
 * INICIALIZAÇÃO DO SCRIPT
 * Este código será executado quando o DOM estiver totalmente carregado.
 */
document.addEventListener('DOMContentLoaded', () => {
    const carrinho = new CarrinhoGamer();

    document.querySelectorAll('article button').forEach(botao => {
        botao.addEventListener('click', () => {
            const article = botao.closest('article');
            const nome = article.querySelector('h3').textContent;
            const precoTexto = article.querySelector('strong').textContent;
            const preco = parseFloat(precoTexto.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
            const id = nome.replace(/\s+/g, '-').toLowerCase();
            carrinho.adicionarItem({ id, nome, preco });
        });
    });

    // Lógica para abrir e fechar o modal do carrinho
    const modal = document.getElementById('modal-carrinho');
    const abrirBtn = document.getElementById('abrir-carrinho-btn');
    const fecharBtn = document.getElementById('fechar-carrinho-btn');
    const limparBtn = document.getElementById('limpar-carrinho-btn');

    const toggleModal = () => {
        if (modal.classList.contains('ativo')) {
            modal.classList.remove('ativo');
        } else {
            carrinho.renderizarCarrinho(); // Renderiza o carrinho sempre que abrir
            modal.classList.add('ativo');
        }
    };

    abrirBtn.addEventListener('click', toggleModal);
    fecharBtn.addEventListener('click', toggleModal);
    
    // Fecha o modal se clicar fora do conteúdo (no overlay)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            toggleModal();
        }
    });

    // Lógica para o botão de limpar carrinho
    limparBtn.addEventListener('click', () => {
        carrinho.limpar();
        carrinho.renderizarCarrinho(); // Atualiza a exibição no modal
    });
});