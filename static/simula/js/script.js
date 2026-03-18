document.addEventListener('DOMContentLoaded', () => {
    const processes = [];
    let pidCounter = 1;

    const addProcessBtn = document.getElementById('add-process-btn');
    const runBtn = document.getElementById('run-btn');
    const processListContainer = document.getElementById('process-list');
    const ganttContainerAll = document.getElementById('gantt-container-all');
    const comparisonTableBody = document.querySelector('#comparison-table tbody');

    // Add Process
    addProcessBtn.addEventListener('click', () => {
        const arrival = parseInt(document.getElementById('arrival-time').value);
        const burst = parseInt(document.getElementById('burst-time').value);
        const priority = parseInt(document.getElementById('priority').value);

        if (isNaN(arrival) || isNaN(burst) || isNaN(priority) || burst <= 0) {
            alert('Por favor, insira valores válidos.');
            return;
        }

        const process = {
            id: `P${pidCounter++}`,
            arrival,
            burst,
            priority,
            color: generateColor()
        };

        processes.push(process);
        updateProcessList();
    });

    function generateColor() {
        const iceaPalette = [
            '#1565C0', // Azul ICEA
            '#FF9800', // Dourado/Laranja
            '#455A64', // Cinza Azulado
            '#2E7D32', // Verde Militar
            '#D32F2F', // Vermelho Alerta
            '#00838F', // Teal
            '#6A1B9A', // Roxo Profundo
            '#EF6C00'  // Laranja Escuro
        ];
        return iceaPalette[(pidCounter - 1) % iceaPalette.length];
    }

    function updateProcessList() {
        processListContainer.innerHTML = '';
        processes.forEach((p, index) => {
            const div = document.createElement('div');
            div.className = 'process-item';
            div.innerHTML = `
                <div class="process-info">
                    <span class="process-id" style="color: ${p.color}">${p.id} ${p.command ? `<span style="font-size: 0.8rem; font-weight: 400; opacity: 0.7;">(${p.command})</span>` : ''}</span>
                    <span class="process-sub">Chegada: ${p.arrival} | Burst: ${p.burst} | Prioridade: ${p.priority}</span>
                </div>
                <button class="remove-btn" data-index="${index}">✕</button>
            `;
            processListContainer.appendChild(div);
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.onclick = (e) => {
                const index = e.target.getAttribute('data-index');
                processes.splice(index, 1);
                updateProcessList();
            };
        });
    }

    // SYSTEM IMPORT LOGIC
    document.getElementById('import-btn').addEventListener('click', () => {
<<<<<<< HEAD
        const input = document.getElementById('import-area').value;
        const lines = input.trim().split('\n').slice(1); // Ignora o cabeçalho

        lines.forEach((line, index) => {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 2) {
                const name = parts[0];
                const timeStr = parts[1]; // Formato HH:MM:SS
                
                // Converter tempo de CPU em segundos (simulando Burst Time)
                const timeParts = timeStr.split(':').reverse();
                let burstSeconds = 0;
=======
        const area = document.getElementById('import-area');
        const btn = document.getElementById('import-btn');

        if (area.style.display === 'none') {
            area.style.display = 'block';
            btn.innerText = 'Confirmar Importação';
            btn.style.background = 'var(--primary)';
            btn.style.color = 'white';
            return;
        }

        const input = area.value;
        if (!input.trim()) {
            area.style.display = 'none';
            btn.innerText = 'Importação Manual (Texto)';
            btn.style.background = '';
            btn.style.color = '';
            return;
        }

        const lines = input.trim().split('\n');
        
        lines.forEach((line) => {
            // Ignora cabeçalhos comuns ou linhas vazias
            if (line.includes('COMM') || line.includes('TIME') || !line.trim()) return;

            const parts = line.trim().split(/\s+/);
            if (parts.length >= 2) {
                const name = parts[0];
                const timeStr = parts[parts.length - 1]; // Pega o último elemento como tempo
                
                // Converter tempo (HH:MM:SS ou MM:SS.CC)
                const cleanTime = timeStr.split('.')[0]; // Remove centésimos se houver
                const timeParts = cleanTime.split(':').reverse();
                let burstSeconds = 0;
                
>>>>>>> edcce92 (ajuste github)
                if (timeParts[0]) burstSeconds += parseInt(timeParts[0]); // seg
                if (timeParts[1]) burstSeconds += parseInt(timeParts[1]) * 60; // min
                if (timeParts[2]) burstSeconds += parseInt(timeParts[2]) * 3600; // horas

                if (burstSeconds > 0) {
                    processes.push({
                        id: `P${pidCounter++}`,
                        command: name,
                        arrival: Math.floor(Math.random() * 5),
                        burst: Math.min(burstSeconds, 20),
                        priority: Math.floor(Math.random() * 5) + 1,
                        color: generateColor()
                    });
                }
            }
        });
<<<<<<< HEAD
        updateProcessList();
        document.getElementById('import-area').value = '';
=======

        updateProcessList();
        area.value = '';
        area.style.display = 'none';
        btn.innerText = 'Importação Manual (Texto)';
        btn.style.background = '';
        btn.style.color = '';
        alert('Processos importados com sucesso!');
>>>>>>> edcce92 (ajuste github)
    });

    // CAPTURE REAL SYSTEM PROCESSES VIA DJANGO API
    document.getElementById('capture-real-btn').addEventListener('click', async () => {
        const btn = document.getElementById('capture-real-btn');
        const originalText = btn.innerText;
        
        try {
            btn.innerText = 'Capturando...';
            btn.disabled = true;
            
            const response = await fetch('/api/capture/');
            const data = await response.json();
            
            if (data.output) {
                const lines = data.output.trim().split('\n').filter(line => !line.includes('COMMAND'));
                
<<<<<<< HEAD
                lines.forEach((line, index) => {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length >= 2) {
                        const name = parts[0];
                        const timeStr = parts[1];
                        
                        const timeParts = timeStr.split(':').reverse();
                        let burstSeconds = 0;
                        if (timeParts[0]) burstSeconds += parseInt(timeParts[0]);
                        if (timeParts[1]) burstSeconds += parseInt(timeParts[1]) * 60;
                        if (timeParts[2]) burstSeconds += parseInt(timeParts[2]) * 3600;

                        if (burstSeconds > 0) {
=======
                // Embaralhar e pegar apenas 5 processos para não sobrecarregar o simulador
                const shuffled = lines.sort(() => 0.5 - Math.random());
                const selectedLines = shuffled.slice(0, 5);
                
                selectedLines.forEach((line, index) => {
                    if (data.os === 'Windows') {
                        // Lógica para parsear CSV do Windows tasklist
                        const parts = line.split('","');
                        if (parts.length >= 1) {
                            const name = parts[0].replace(/"/g, '');
>>>>>>> edcce92 (ajuste github)
                            processes.push({
                                id: `P${pidCounter++}`,
                                command: name,
                                arrival: Math.floor(Math.random() * 8),
<<<<<<< HEAD
                                burst: Math.min(burstSeconds, 20),
=======
                                burst: Math.floor(Math.random() * 10) + 1, // Simulando tempo para Windows
>>>>>>> edcce92 (ajuste github)
                                priority: Math.floor(Math.random() * 5) + 1,
                                color: generateColor()
                            });
                        }
<<<<<<< HEAD
                    }
                });
                updateProcessList();
                alert('Processos capturados diretamente do seu Linux!');
=======
                    } else {
                        // Lógica Unix (Mac/Linux)
                        const parts = line.trim().split(/\s+/);
                        if (parts.length >= 2) {
                            const name = parts[0];
                            const timeStr = parts[1];
                            
                            const timeParts = timeStr.split(':').reverse();
                            let burstSeconds = 0;
                            if (timeParts[0]) burstSeconds += parseInt(timeParts[0]);
                            if (timeParts[1]) burstSeconds += parseInt(timeParts[1]) * 60;
                            if (timeParts[2]) burstSeconds += parseInt(timeParts[2]) * 3600;

                            if (burstSeconds > 0) {
                                processes.push({
                                    id: `P${pidCounter++}`,
                                    command: name,
                                    arrival: Math.floor(Math.random() * 8),
                                    burst: Math.min(burstSeconds, 20),
                                    priority: Math.floor(Math.random() * 5) + 1,
                                    color: generateColor()
                                });
                            }
                        }
                    }
                });
                updateProcessList();
                alert(`Processos capturados do seu sistema (${data.os || 'OS Unknown'})!`);
>>>>>>> edcce92 (ajuste github)
            }
        } catch (error) {
            console.error('Erro ao capturar processos:', error);
            alert('Erro ao conectar com o backend Django.');
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });

    // SIMULATION LOGIC
    runBtn.addEventListener('click', () => {
        if (processes.length === 0) {
            alert('Adicione pelo menos um processo.');
            return;
        }

        const quantum = parseInt(document.getElementById('quantum').value) || 2;
        
        const algorithms = [
            { name: 'FCFS', func: (p, t) => simulateFCFS(p, t) },
            { name: 'SJF (Não-Preemptivo)', func: (p, t) => simulateSJFNon(p, t) },
            { name: 'SRTF (SJF Preemptivo)', func: (p, t) => simulateSJFPre(p, t) },
            { name: 'Prioridade (Não-Preemptivo)', func: (p, t) => simulatePriorityNon(p, t) },
            { name: 'Prioridade (Preemptivo)', func: (p, t) => simulatePriorityPre(p, t) },
            { name: 'Round Robin', func: (p, quantum, t) => simulateRR(p, quantum, t) }
        ];

        ganttContainerAll.innerHTML = '';
        comparisonTableBody.innerHTML = '';

        algorithms.forEach(algo => {
            const timeline = [];
            const results = algo.func(JSON.parse(JSON.stringify(processes)), timeline);
            renderGanttRow(algo.name, timeline);
            renderComparisonRow(algo.name, results);
        });
    });

    function renderGanttRow(name, timeline) {
        const row = document.createElement('div');
        row.className = 'gantt-algo-row';
        
        const label = document.createElement('h3');
        label.innerText = name;
        label.className = 'algo-title';
        
        const chartWrapper = document.createElement('div');
        chartWrapper.className = 'gantt-chart-container';
        
        const chart = document.createElement('div');
        chart.className = 'gantt-chart';
        
        const totalTime = timeline[timeline.length - 1].end;
        
        timeline.forEach(step => {
            const duration = step.end - step.start;
            const block = document.createElement('div');
            block.className = 'gantt-block';
            block.style.width = `${(duration / totalTime) * 100}%`;
            block.style.backgroundColor = step.color || '#334155';
            
            // Exibir ID e Duração
            if (step.id !== 'IDLE') {
                block.innerHTML = `<strong>${step.id}</strong> <span class="block-duration">(${duration}u)</span>`;
            } else {
                block.innerHTML = `<span class="block-duration" style="opacity: 0.4">(${duration}u)</span>`;
            }
            
            block.setAttribute('data-time', step.end);
            chart.appendChild(block);
        });

        chartWrapper.appendChild(chart);
        row.appendChild(label);
        row.appendChild(chartWrapper);
        ganttContainerAll.appendChild(row);
    }

    function renderComparisonRow(name, results) {
        let totalW = 0, totalT = 0;
        results.forEach(p => {
            totalW += p.waiting;
            totalT += p.turnaround;
        });
        const n = results.length;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${name}</strong></td>
            <td class="stat-value">${(totalW / n).toFixed(2)}</td>
            <td class="stat-value">${(totalT / n).toFixed(2)}</td>
        `;
        comparisonTableBody.appendChild(tr);
    }

    // ALGORITHM IMPLEMENTATIONS (Same as before but returning results/filling timeline)
    
    function simulateFCFS(procList, timeline) {
        const sorted = [...procList].sort((a, b) => a.arrival - b.arrival);
        const results = [];
        let currentTime = 0;

        sorted.forEach(p => {
            if (currentTime < p.arrival) {
                timeline.push({ id: 'IDLE', start: currentTime, end: p.arrival, color: '#334155' });
                currentTime = p.arrival;
            }
            const start = currentTime;
            currentTime += p.burst;
            const end = currentTime;
            
            timeline.push({ ...p, start, end });
            results.push({ ...p, finish: end, turnaround: end - p.arrival, waiting: (end - p.arrival) - p.burst });
        });
        return results;
    }

    function simulateSJFNon(procList, timeline) {
        let readyQueue = [];
        let remaining = [...procList];
        let currentTime = 0;
        const results = [];

        while (remaining.length > 0 || readyQueue.length > 0) {
            const arrived = remaining.filter(p => p.arrival <= currentTime);
            readyQueue.push(...arrived);
            remaining = remaining.filter(p => p.arrival > currentTime);

            if (readyQueue.length === 0) {
                const nextArrival = Math.min(...remaining.map(p => p.arrival));
                timeline.push({ id: 'IDLE', start: currentTime, end: nextArrival, color: '#334155' });
                currentTime = nextArrival;
                continue;
            }

            readyQueue.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival);
            const p = readyQueue.shift();
            const start = currentTime;
            currentTime += p.burst;
            const end = currentTime;

            timeline.push({ ...p, start, end });
            results.push({ ...p, finish: end, turnaround: end - p.arrival, waiting: (end - p.arrival) - p.burst });
        }
        return results;
    }

    function simulateSJFPre(procList, timeline) {
        let remaining = procList.map(p => ({ ...p, remainingTime: p.burst }));
        let currentTime = 0;
        const results = [];
        let lastProcess = null;
        let segmentStart = 0;
        let finishedCount = 0;

        while (finishedCount < procList.length) {
            const available = remaining.filter(p => p.arrival <= currentTime && p.remainingTime > 0);
            
            let currentP = null;
            if (available.length > 0) {
                available.sort((a, b) => a.remainingTime - b.remainingTime || a.arrival - b.arrival);
                currentP = available[0];
            }

            if (lastProcess !== currentP) {
                if (currentTime > segmentStart) {
                    timeline.push({ 
                        id: lastProcess ? lastProcess.id : 'IDLE',
                        color: lastProcess ? lastProcess.color : '#334155',
                        start: segmentStart, 
                        end: currentTime 
                    });
                }
                segmentStart = currentTime;
                lastProcess = currentP;
            }

            currentTime++;
            if (currentP) {
                currentP.remainingTime--;
                if (currentP.remainingTime === 0) {
                    finishedCount++;
                    results.push({
                        ...currentP,
                        finish: currentTime,
                        turnaround: currentTime - currentP.arrival,
                        waiting: (currentTime - currentP.arrival) - currentP.burst
                    });
                }
            }
        }
        if (currentTime > segmentStart) {
            timeline.push({ 
                id: lastProcess ? lastProcess.id : 'IDLE',
                color: lastProcess ? lastProcess.color : '#334155',
                start: segmentStart, 
                end: currentTime 
            });
        }
        return results;
    }

    function simulateRR(procList, quantum, timeline) {
        let queue = [];
        let remaining = procList.map(p => ({ ...p, remainingTime: p.burst, inQueue: false }));
        let currentTime = 0;
        let finishedCount = 0;
        const results = [];

        while (finishedCount < procList.length) {
            remaining.forEach(p => {
                if (p.arrival <= currentTime && !p.inQueue && p.remainingTime > 0) {
                    queue.push(p);
                    p.inQueue = true;
                }
            });

            if (queue.length === 0) {
                const pending = remaining.filter(p => p.remainingTime > 0);
                if (pending.length > 0) {
                    const nextArrival = Math.min(...pending.map(p => p.arrival));
                    timeline.push({ id: 'IDLE', start: currentTime, end: nextArrival, color: '#334155' });
                    currentTime = nextArrival;
                    continue;
                }
                break;
            }

            const p = queue.shift();
            const start = currentTime;
            const executionTime = Math.min(p.remainingTime, quantum);
            
            p.remainingTime -= executionTime;
            currentTime += executionTime;
            
            timeline.push({ ...p, start, end: currentTime });

            remaining.forEach(r => {
                if (r.arrival <= currentTime && !r.inQueue && r.remainingTime > 0) {
                    queue.push(r);
                    r.inQueue = true;
                }
            });

            if (p.remainingTime > 0) {
                queue.push(p);
            } else {
                finishedCount++;
                results.push({ ...p, finish: currentTime, turnaround: currentTime - p.arrival, waiting: (currentTime - p.arrival) - p.burst });
            }
        }
        return results;
    }

    function simulatePriorityNon(procList, timeline) {
        let readyQueue = [];
        let remaining = [...procList];
        let currentTime = 0;
        const results = [];

        while (remaining.length > 0 || readyQueue.length > 0) {
            const arrived = remaining.filter(p => p.arrival <= currentTime);
            readyQueue.push(...arrived);
            remaining = remaining.filter(p => p.arrival > currentTime);

            if (readyQueue.length === 0) {
                const nextArrival = Math.min(...remaining.map(p => p.arrival));
                timeline.push({ id: 'IDLE', start: currentTime, end: nextArrival, color: '#334155' });
                currentTime = nextArrival;
                continue;
            }

            // Prioridade: Menor número = Maior prioridade
            readyQueue.sort((a, b) => a.priority - b.priority || a.arrival - b.arrival);
            const p = readyQueue.shift();
            const start = currentTime;
            currentTime += p.burst;
            const end = currentTime;

            timeline.push({ ...p, start, end });
            results.push({ ...p, finish: end, turnaround: end - p.arrival, waiting: (end - p.arrival) - p.burst });
        }
        return results;
    }

    function simulatePriorityPre(procList, timeline) {
        let remaining = procList.map(p => ({ ...p, remainingTime: p.burst }));
        let currentTime = 0;
        const results = [];
        let lastProcess = null;
        let segmentStart = 0;
        let finishedCount = 0;

        while (finishedCount < procList.length) {
            const available = remaining.filter(p => p.arrival <= currentTime && p.remainingTime > 0);
            
            let currentP = null;
            if (available.length > 0) {
                // Prioridade Preemptiva: Menor número = Maior prioridade
                available.sort((a, b) => a.priority - b.priority || a.arrival - b.arrival);
                currentP = available[0];
            }

            if (lastProcess !== currentP) {
                if (currentTime > segmentStart) {
                    timeline.push({ 
                        id: lastProcess ? lastProcess.id : 'IDLE',
                        color: lastProcess ? lastProcess.color : '#334155',
                        start: segmentStart, 
                        end: currentTime 
                    });
                }
                segmentStart = currentTime;
                lastProcess = currentP;
            }

            currentTime++;
            if (currentP) {
                currentP.remainingTime--;
                if (currentP.remainingTime === 0) {
                    finishedCount++;
                    results.push({
                        ...currentP,
                        finish: currentTime,
                        turnaround: currentTime - currentP.arrival,
                        waiting: (currentTime - currentP.arrival) - currentP.burst
                    });
                }
            }
        }
        if (currentTime > segmentStart) {
            timeline.push({ 
                id: lastProcess ? lastProcess.id : 'IDLE',
                color: lastProcess ? lastProcess.color : '#334155',
                start: segmentStart, 
                end: currentTime 
            });
        }
        return results;
    }
});
