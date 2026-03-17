document.addEventListener('DOMContentLoaded', () => {
    let ramSize = 1024;
    let memoryBlocks = [{ start: 0, size: 1024, type: 'free', process: null }];
    let allocatedProcesses = [];
    let colorIndex = 0;

    const memoryBar = document.getElementById('memory-bar');
    const memProcessList = document.getElementById('mem-process-list');
    const memLog = document.getElementById('mem-log');
    const ramSizeInput = document.getElementById('ram-size');
    const labelTotalRam = document.getElementById('label-total-ram');
    const memUsedEl = document.getElementById('mem-used');
    const memFreeEl = document.getElementById('mem-free');

    const iceaPalette = [
        '#1565C0', '#FF9800', '#455A64', '#2E7D32', 
        '#D32F2F', '#00838F', '#6A1B9A', '#EF6C00'
    ];

    function log(message) {
        const div = document.createElement('div');
        div.innerText = `> ${message}`;
        memLog.prepend(div);
    }

    function updateStats() {
        const used = memoryBlocks
            .filter(b => b.type === 'allocated')
            .reduce((sum, b) => sum + b.size, 0);
        
        memUsedEl.innerText = `${used} MB`;
        memFreeEl.innerText = `${ramSize - used} MB`;
    }

    function renderMemory() {
        memoryBar.innerHTML = '';
        memoryBlocks.forEach((block, index) => {
            const div = document.createElement('div');
            div.className = `memory-block ${block.type}`;
            const widthPercent = (block.size / ramSize) * 100;
            div.style.width = `${widthPercent}%`;
            
            if (block.type === 'allocated') {
                div.style.backgroundColor = block.color;
                div.innerHTML = `<strong>${block.process}</strong><br><small>${block.size}MB</small>`;
                div.title = `${block.process}: ${block.size}MB (Início: ${block.start})`;
            } else {
                div.innerText = `${block.size}MB Livre`;
            }
            
            // Clique para desalocar
            if (block.type === 'allocated') {
                div.style.cursor = 'pointer';
                div.onclick = () => deallocate(index);
            }

            memoryBar.appendChild(div);
        });
        updateStats();
        updateProcessList();
    }

    function updateProcessList() {
        memProcessList.innerHTML = '';
        memoryBlocks.forEach((block, index) => {
            if (block.type === 'allocated') {
                const div = document.createElement('div');
                div.className = 'process-item';
                div.innerHTML = `
                    <div class="process-info">
                        <span class="process-id" style="color: ${block.color}">${block.process}</span>
                        <span class="process-sub">${block.size} MB | Início: ${block.start}</span>
                    </div>
                    <button class="remove-btn" onclick="deallocateByProcess('${block.process}')">✕</button>
                `;
                memProcessList.appendChild(div);
            }
        });
    }

    window.deallocateByProcess = (name) => {
        const index = memoryBlocks.findIndex(b => b.process === name);
        if (index !== -1) deallocate(index);
    };

    function deallocate(index) {
        const block = memoryBlocks[index];
        log(`Processo ${block.process} finalizado. Liberação de ${block.size}MB.`);
        block.type = 'free';
        block.process = null;
        block.color = null;

        // Mesclar blocos livres adjacentes
        mergeFreeBlocks();
        renderMemory();
    }

    function mergeFreeBlocks() {
        for (let i = 0; i < memoryBlocks.length - 1; i++) {
            if (memoryBlocks[i].type === 'free' && memoryBlocks[i+1].type === 'free') {
                memoryBlocks[i].size += memoryBlocks[i+1].size;
                memoryBlocks.splice(i + 1, 1);
                i--; // Verificar novamente a posição atual
            }
        }
    }

    function allocate() {
        const name = document.getElementById('process-name-mem').value || `Proc_${Math.floor(Math.random()*100)}`;
        const size = parseInt(document.getElementById('process-size').value);
        const algo = document.getElementById('mem-algo').value;

        if (isNaN(size) || size <= 0) {
            alert('Tamanho inválido.');
            return;
        }

        let targetIndex = -1;

        if (algo === 'first-fit') {
            targetIndex = memoryBlocks.findIndex(b => b.type === 'free' && b.size >= size);
        } else if (algo === 'best-fit') {
            let bestSize = Infinity;
            memoryBlocks.forEach((b, i) => {
                if (b.type === 'free' && b.size >= size && b.size < bestSize) {
                    bestSize = b.size;
                    targetIndex = i;
                }
            });
        } else if (algo === 'worst-fit') {
            let worstSize = -1;
            memoryBlocks.forEach((b, i) => {
                if (b.type === 'free' && b.size >= size && b.size > worstSize) {
                    worstSize = b.size;
                    targetIndex = i;
                }
            });
        }

        if (targetIndex === -1) {
            log(`ERRO: Falha ao alocar ${name} (${size}MB). Sem espaço contíguo suficiente.`);
            alert('Não há espaço livre contíguo suficiente para este processo!');
            return;
        }

        const freeBlock = memoryBlocks[targetIndex];
        const remainingSize = freeBlock.size - size;
        const color = iceaPalette[colorIndex % iceaPalette.length];
        colorIndex++;

        // Atualiza bloco livre para alocado
        const start = freeBlock.start;
        freeBlock.type = 'allocated';
        freeBlock.process = name;
        freeBlock.size = size;
        freeBlock.color = color;

        // Se sobrou espaço, cria novo bloco livre
        if (remainingSize > 0) {
            memoryBlocks.splice(targetIndex + 1, 0, {
                start: start + size,
                size: remainingSize,
                type: 'free',
                process: null
            });
        }

        log(`Processo ${name} alocado (${size}MB) usando ${algo}.`);
        renderMemory();
        document.getElementById('process-name-mem').value = '';
    }

    // Event Listeners
    document.getElementById('alloc-btn').addEventListener('click', allocate);
    
    document.getElementById('reset-mem-btn').addEventListener('click', () => {
        ramSize = parseInt(ramSizeInput.value) || 1024;
        labelTotalRam.innerText = `${ramSize} MB`;
        memoryBlocks = [{ start: 0, size: ramSize, type: 'free', process: null }];
        colorIndex = 0;
        log(`Memória resetada para ${ramSize}MB.`);
        renderMemory();
    });

    // Inicialização
    renderMemory();
});
