from django.shortcuts import render
from django.http import JsonResponse
import subprocess
<<<<<<< HEAD

# Create your views here.
=======
import platform

>>>>>>> edcce92 (ajuste github)
def simulator_view(request):
    return render(request, 'simula/simulator.html')

def capture_processes(request):
    try:
<<<<<<< HEAD
        # Pega processos aleatórios que já consumiram algum tempo de CPU
        # Isso garante exemplos variados (curtos e longos) para a simulação
        cmd = "ps -eo comm,time --no-headers | awk '$2 != \"00:00:00\"' | shuf | head -n 4"
        output = subprocess.check_output(cmd, shell=True).decode('utf-8')
        # Adiciona um cabeçalho fictício para o JS processar corretamente
        output = "COMMAND TIME\n" + output
        return JsonResponse({'output': output})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
=======
        os_type = platform.system()
        if os_type == 'Darwin':
            os_type = 'Mac'
        
        if os_type == 'Windows':
            # Comando Windows para listar processos: nome e tempo (se disponível)
            # Simplificado para compatibilidade: tasklist
            result = subprocess.run(['tasklist', '/FO', 'CSV', '/NH'], capture_output=True, text=True, check=True)
            return JsonResponse({'status': 'success', 'os': 'Windows', 'output': result.stdout})
        else:
            # Comando macOS/Linux: -A (todos), -o comm,time (nome e tempo CPU)
            # No Mac/Linux o comando 'ps' é padrão
            result = subprocess.run(['ps', '-Ao', 'comm,time'], capture_output=True, text=True, check=True)
            return JsonResponse({'status': 'success', 'os': os_type, 'output': result.stdout})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
>>>>>>> edcce92 (ajuste github)
