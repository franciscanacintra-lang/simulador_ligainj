document.addEventListener('DOMContentLoaded', () => {
    let resourcesCount = 3;
    let processCount = 5;

    const setupBtn = document.getElementById('setup-banker-btn');
    const checkBtn = document.getElementById('check-safety-btn');
    const resetBtn = document.getElementById('reset-dl-btn');
    const bankerHeader = document.getElementById('banker-header');
    const bankerBody = document.getElementById('banker-body');
    const availableDiv = document.getElementById('available-inputs');
    const statusText = document.getElementById('status-text');
    const safetyResult = document.getElementById('safety-result');
    const sequenceContainer = document.getElementById('safety-sequence-container');
    const sequenceDiv = document.getElementById('safety-sequence');
    const dlLog = document.getElementById('banker-log');

    function log(msg) {
        const div = document.createElement('div');
        div.style.marginBottom = '4px';
        div.innerHTML = `> ${msg}`;
        dlLog.appendChild(div);
        dlLog.scrollTop = dlLog.scrollHeight;
    }

    function createTables() {
        resourcesCount = parseInt(document.getElementById('resource-count').value);
        processCount = parseInt(document.getElementById('process-count-dl').value);
        
        // 1. Header
        bankerHeader.innerHTML = '<th>Processo</th>';
        for (let i = 0; i < resourcesCount; i++) {
            const char = String.fromCharCode(65 + i);
            bankerHeader.innerHTML += `<th>Aloc. ${char}</th>`;
        }
        for (let i = 0; i < resourcesCount; i++) {
            const char = String.fromCharCode(65 + i);
            bankerHeader.innerHTML += `<th>Máx. ${char}</th>`;
        }

        // 2. Body
        bankerBody.innerHTML = '';
        for (let p = 0; p < processCount; p++) {
            let row = `<tr><td><strong>P${p}</strong></td>`;
            // Alocação
            for (let r = 0; r < resourcesCount; r++) {
                row += `<td><input type="number" class="dl-input alloc-p${p}-r${r}" value="0" min="0" style="width: 50px; padding: 4px; border-radius: 4px; border: 1px solid #ddd;"></td>`;
            }
            // Máximo
            for (let r = 0; r < resourcesCount; r++) {
                row += `<td><input type="number" class="dl-input max-p${p}-r${r}" value="0" min="0" style="width: 50px; padding: 4px; border-radius: 4px; border: 1px solid #ddd;"></td>`;
            }
            row += '</tr>';
            bankerBody.innerHTML += row;
        }

        // 3. Available
        availableDiv.innerHTML = '';
        for (let i = 0; i < resourcesCount; i++) {
            const char = String.fromCharCode(65 + i);
            availableDiv.innerHTML += `
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <label style="font-size: 10px;">${char}</label>
                    <input type="number" class="dl-input avail-r${i}" value="3" min="0" style="width: 50px; padding: 8px; border-radius: 6px; border: 1px solid #E2E8F0;">
                </div>
            `;
        }

        log(`Tabelas geradas: ${processCount} processos e ${resourcesCount} recursos.`);
        statusText.innerText = 'Aguardando Verificação';
        statusText.style.color = 'var(--text-main)';
        sequenceContainer.style.display = 'none';
    }

    function checkSafety() {
        dlLog.innerHTML = '';
        log('Iniciando Algoritmo do Banqueiro...');

        let avail = [];
        for (let r = 0; r < resourcesCount; r++) {
            avail.push(parseInt(document.querySelector(`.avail-r${r}`).value));
        }

        let alloc = [];
        let max = [];
        let need = [];

        for (let p = 0; p < processCount; p++) {
            let pAlloc = [];
            let pMax = [];
            let pNeed = [];
            for (let r = 0; r < resourcesCount; r++) {
                const a = parseInt(document.querySelector(`.alloc-p${p}-r${r}`).value);
                const m = parseInt(document.querySelector(`.max-p${p}-r${r}`).value);
                pAlloc.push(a);
                pMax.push(m);
                pNeed.push(m - a);
                
                if (m < a) {
                    alert(`Erro no Processo P${p}: Alocação maior que o Máximo!`);
                    return;
                }
            }
            alloc.push(pAlloc);
            max.push(pMax);
            need.push(pNeed);
        }

        let finish = new Array(processCount).fill(false);
        let work = [...avail];
        let safeSequence = [];

        for (let k = 0; k < processCount; k++) {
            let found = false;
            for (let p = 0; p < processCount; p++) {
                if (!finish[p]) {
                    let possible = true;
                    for (let r = 0; r < resourcesCount; r++) {
                        if (need[p][r] > work[r]) {
                            possible = false;
                            break;
                        }
                    }

                    if (possible) {
                        log(`P${p} pode executar. Recursos Necessários: [${need[p]}] <= Disponíveis: [${work}]`);
                        for (let r = 0; r < resourcesCount; r++) {
                            work[r] += alloc[p][r];
                        }
                        finish[p] = true;
                        safeSequence.push(`P${p}`);
                        found = true;
                        log(`P${p} terminou. Liberou recursos. Novo de Trabalho: [${work}]`);
                        break;
                    }
                }
            }

            if (!found) break;
        }

        if (safeSequence.length === processCount) {
            statusText.innerText = 'ESTADO SEGURO ✅';
            statusText.style.color = 'var(--success)';
            sequenceContainer.style.display = 'block';
            sequenceDiv.innerHTML = safeSequence.join(' ➔ ');
            log('Sistema está em estado seguro. Nenhuma possibilidade de deadlock.');
        } else {
            statusText.innerText = 'ESTADO INSEGURO ❌';
            statusText.style.color = 'var(--danger)';
            sequenceContainer.style.display = 'none';
            log('AVISO: Sistema em estado inseguro! Risco de Deadlock detectado.');
        }
    }

    setupBtn.addEventListener('click', createTables);
    checkBtn.addEventListener('click', checkSafety);
    resetBtn.addEventListener('click', () => {
        document.getElementById('resource-count').value = 3;
        document.getElementById('process-count-dl').value = 5;
        createTables();
        dlLog.innerHTML = '';
    });

    // Iniciar
    createTables();
});
