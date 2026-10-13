/**
 * Função para transformar a lista de tarefas do Zeev em um Kanban.
 * Desenvolvido para Javascript Nativo (ES2021).
 */
function custom_gerarKanbanZeev() {
    const corpoTabela = document.getElementById("taskListBody");

    // Validação inicial do elemento
    if (!corpoTabela) return;

    // Intervalo para aguardar o carregamento das tarefas (Zeev carrega via Ajax)
    const intervaloCarga = setInterval(() => {
        const tarefas = corpoTabela.querySelectorAll(".task-card");
        
        if (tarefas.length > 0) {
            clearInterval(intervaloCarga);
            custom_construirEstruturaKanban(tarefas);
        }
    }, 500);
}

function custom_construirEstruturaKanban(elementosTarefas) {
    const containerPrincipal = document.querySelector(".crud-list-table");
    if (!containerPrincipal) return;

    // Oculta a tabela original
    const tabelaOriginal = containerPrincipal.querySelector("table");
    if (tabelaOriginal) tabelaOriginal.style.display = "none";

    // Cria o container do Kanban
    const kanbanWrapper = document.createElement("div");
    kanbanWrapper.id = "custom-kanban-wrapper";
    kanbanWrapper.innerHTML = `
        <div class="kanban-col" id="col-vencidas"><div class="kanban-header">Vencidas</div><div class="kanban-cards"></div></div>
        <div class="kanban-col" id="col-hoje"><div class="kanban-header">Para Hoje</div><div class="kanban-cards"></div></div>
        <div class="kanban-col" id="col-futuro"><div class="kanban-header">A Vencer</div><div class="kanban-cards"></div></div>
    `;

    containerPrincipal.appendChild(kanbanWrapper);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    elementosTarefas.forEach(tr => {
        // Extração dos dados da TR
        const idTarefa = tr.getAttribute("data-key");
        const titulo = tr.querySelector(".task-title")?.innerText || "Sem título";
        const processo = tr.querySelector(".task-app-title")?.innerText || "";
        const numero = tr.querySelector(".task-number")?.innerText || "";
        const dataExpiraStr = tr.querySelector(".task-expire-date")?.innerText || "";
        const linkOriginal = tr.querySelector(".task-open-link")?.getAttribute("href") || "#";

        // Lógica de Data
        let destino = "col-futuro";
        if (dataExpiraStr) {
            const partes = dataExpiraStr.split("/");
            const dataExpira = new Date(partes[2], partes[1] - 1, partes[0]);
            
            if (dataExpira < hoje) {
                destino = "col-vencidas";
            } else if (dataExpira.getTime() === hoje.getTime()) {
                destino = "col-hoje";
            }
        }

        // Criar o Card
        const card = document.createElement("div");
        card.className = "kanban-card-item";
        card.innerHTML = `
            <div class="card-badge">${numero}</div>
            <div class="card-title">${titulo}</div>
            <div class="card-process">${processo}</div>
            <div class="card-footer">
                <span class="card-date ${destino === 'col-vencidas' ? 'text-danger' : ''}">
                    <i class="date-icon"></i> ${dataExpiraStr}
                </span>
                <a href="${linkOriginal}" class="btn-abrir-kanban">Abrir</a>
            </div>
        `;

        kanbanWrapper.querySelector(`#${destino} .kanban-cards`).appendChild(card);
    });

    custom_aplicarEstilosKanban();
}

function custom_aplicarEstilosKanban() {
    const estilos = `
        #custom-kanban-wrapper {
            display: flex;
            gap: 20px;
            padding: 20px 0;
            overflow-x: auto;
            align-items: flex-start;
        }
        .kanban-col {
            flex: 1;
            min-width: 300px;
            background: #f4f5f7;
            border-radius: 8px;
            padding: 10px;
            box-shadow: inset 0 0 5px rgba(0,0,0,0.05);
        }
        .kanban-header {
            font-weight: bold;
            padding: 10px;
            margin-bottom: 15px;
            text-transform: uppercase;
            font-size: 0.85rem;
            color: #5e6c84;
            border-bottom: 2px solid #dfe1e6;
        }
        .kanban-card-item {
            background: #fff;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
            border-left: 4px solid #0052cc;
            transition: transform 0.2s;
        }
        .kanban-card-item:hover {
            transform: translateY(-2px);
        }
        .card-badge {
            font-size: 0.75rem;
            background: #e3f2fd;
            color: #007bff;
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            margin-bottom: 8px;
        }
        .card-title {
            font-weight: 600;
            font-size: 0.95rem;
            margin-bottom: 5px;
            color: #172b4d;
        }
        .card-process {
            font-size: 0.8rem;
            color: #6b778c;
            margin-bottom: 15px;
        }
        .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #ebecf0;
            padding-top: 10px;
        }
        .card-date {
            font-size: 0.8rem;
            color: #5e6c84;
        }
        .btn-abrir-kanban {
            font-size: 0.8rem;
            text-decoration: none;
            color: #fff;
            background: #0052cc;
            padding: 4px 12px;
            border-radius: 4px;
        }
        .text-danger { color: #de350b !important; font-weight: bold; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = estilos;
    document.head.appendChild(styleSheet);
}

// Inicia a execução
document.addEventListener("DOMContentLoaded", custom_gerarKanbanZeev);
