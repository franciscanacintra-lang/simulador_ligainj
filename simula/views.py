from django.shortcuts import render
from django.http import JsonResponse
import subprocess
import platform

def simulator_view(request):
    return render(request, 'simula/simulator.html')

def capture_processes(request):
    try:
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
