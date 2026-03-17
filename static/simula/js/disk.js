document.addEventListener('DOMContentLoaded', () => {
    let requests = [];
    const canvas = document.getElementById('disk-canvas');
    const ctx = canvas.getContext('2d');
    const diskSizeInput = document.getElementById('disk-size');
    const initialPosInput = document.getElementById('initial-pos');
    const labelMaxTrack = document.getElementById('label-max-track');
    const totalSeekEl = document.getElementById('total-seek-time');
    const diskOrderEl = document.getElementById('disk-order');
    const requestsListEl = document.getElementById('disk-requests-list');

    // Ajustar o canvas para alta resolução
    function resizeCanvas() {
        const width = canvas.clientWidth || canvas.offsetWidth || 800; // Fallback se estiver oculto
        canvas.width = width;
        canvas.height = 350;
        console.log("Canvas resized to:", canvas.width, canvas.height);
    }
    window.addEventListener('resize', resizeCanvas);
    setTimeout(resizeCanvas, 500); // Garante que o layout carregou

    function renderRequests() {
        requestsListEl.innerHTML = '';
        requests.forEach((r, i) => {
            const span = document.createElement('span');
            span.className = 'process-item';
            span.style.padding = '0.4rem 0.8rem';
            span.style.fontSize = '0.8rem';
            span.innerHTML = `#${r} <button onclick="removeDiskReq(${i})" style="border:none; background:none; cursor:pointer; margin-left:5px; color:var(--danger);">✕</button>`;
            requestsListEl.appendChild(span);
        });
    }

    window.removeDiskReq = (i) => {
        requests.splice(i, 1);
        renderRequests();
    };

    document.getElementById('add-request-btn').addEventListener('click', () => {
        const val = parseInt(document.getElementById('request-track').value);
        const max = parseInt(diskSizeInput.value);
        if(!isNaN(val) && val >= 0 && val < max) {
            requests.push(val);
            renderRequests();
            document.getElementById('request-track').value = ''; // Limpa o campo
            document.getElementById('request-track').focus();
        } else {
            alert(`Trilha inválida. Deve ser entre 0 e ${max-1}`);
        }
    });

    document.getElementById('clear-disk-btn').addEventListener('click', () => {
        requests = [];
        renderRequests();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        totalSeekEl.innerText = '0';
        diskOrderEl.innerText = 'Aguardando simulação...';
    });

    function drawSimulation(sequence) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const maxTrack = parseInt(diskSizeInput.value);
        labelMaxTrack.innerText = `Trilha ${maxTrack - 1}`;

        const margin = 30;
        const width = canvas.width - (margin * 2);
        const height = canvas.height - (margin * 2);
        
        const getX = (track) => margin + (track / (maxTrack - 1)) * width;
        const getY = (index) => {
            if (sequence.length <= 1) return margin;
            return margin + (index / (sequence.length - 1)) * height;
        };

        // Desenhar grades verticais
        ctx.strokeStyle = '#e2e8f0';
        ctx.setLineDash([5, 5]);
        for(let i=0; i <= 4; i++) {
            const x = margin + (i/4) * width;
            ctx.beginPath();
            ctx.moveTo(x, margin);
            ctx.lineTo(x, canvas.height - margin);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Desenhar Trajetória
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#1565C0';
        ctx.lineJoin = 'round';

        sequence.forEach((track, i) => {
            const x = getX(track);
            const y = getY(i);
            if(i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Desenhar Pontos
        sequence.forEach((track, i) => {
            const x = getX(track);
            const y = getY(i);
            
            ctx.fillStyle = i === 0 ? '#FFb300' : '#1565C0';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 10px Outfit';
            ctx.fillText(track, x + 8, y + 4);
        });

        // Calcular Seek Time
        let totalSeek = 0;
        for(let i=1; i < sequence.length; i++) {
            totalSeek += Math.abs(sequence[i] - sequence[i-1]);
        }
        totalSeekEl.innerText = totalSeek;
        
        // Mostrar Ordem
        diskOrderEl.innerHTML = sequence.join(' ➔ ');
    }

    document.getElementById('run-disk-btn').addEventListener('click', () => {
        resizeCanvas(); // Garante que o tamanho está correto antes de desenhar
        if(requests.length === 0) {
            alert('Adicione requisições primeiro!');
            return;
        }

        const start = parseInt(initialPosInput.value);
        const max = parseInt(diskSizeInput.value);
        const algo = document.getElementById('disk-algo').value;
        let sequence = [start];
        let pending = [...requests];

        if(algo === 'fcfs') {
            sequence = [start, ...pending];
        } 
        else if(algo === 'sstf') {
            let curr = start;
            while(pending.length > 0) {
                pending.sort((a, b) => Math.abs(a - curr) - Math.abs(b - curr));
                curr = pending.shift();
                sequence.push(curr);
            }
        }
        else if(algo === 'scan') {
            pending.sort((a, b) => a - b);
            let left = pending.filter(x => x < start).reverse();
            let right = pending.filter(x => x >= start);
            // Direção padrão: para o Final (0 -> max)
            sequence = [start, ...right, max - 1, ...left];
        }
        else if(algo === 'c-scan') {
            pending.sort((a, b) => a - b);
            let left = pending.filter(x => x < start);
            let right = pending.filter(x => x >= start);
            sequence = [start, ...right, max - 1, 0, ...left];
        }
        else if(algo === 'look') {
            pending.sort((a, b) => a - b);
            let left = pending.filter(x => x < start).reverse();
            let right = pending.filter(x => x >= start);
            sequence = [start, ...right, ...left];
        }
        else if(algo === 'c-look') {
            pending.sort((a, b) => a - b);
            let left = pending.filter(x => x < start);
            let right = pending.filter(x => x >= start);
            sequence = [start, ...right, ...left];
        }

        drawSimulation(sequence);
    });
});
