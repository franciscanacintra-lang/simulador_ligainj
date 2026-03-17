from django.shortcuts import render
from django.http import JsonResponse
import subprocess

# Create your views here.
def simulator_view(request):
    return render(request, 'simula/simulator.html')

def capture_processes(request):
    try:
        # Pega processos aleatórios que já consumiram algum tempo de CPU
        # Isso garante exemplos variados (curtos e longos) para a simulação
        cmd = "ps -eo comm,time --no-headers | awk '$2 != \"00:00:00\"' | shuf | head -n 4"
        output = subprocess.check_output(cmd, shell=True).decode('utf-8')
        # Adiciona um cabeçalho fictício para o JS processar corretamente
        output = "COMMAND TIME\n" + output
        return JsonResponse({'output': output})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
