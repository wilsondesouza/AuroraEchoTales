import torch
import time
from llama_cpp import Llama
import psutil
import GPUtil

def get_memory_usage():
    """Retorna uso de RAM e VRAM"""
    ram = psutil.Process().memory_info().rss / 1024**3  # GB
    gpus = GPUtil.getGPUs()
    vram = gpus[0].memoryUsed / 1024 if gpus else 0  # GB
    return ram, vram

def test_llama2():
    print("=" * 60)
    print("🦙 TESTE: Llama-3.1-8B-Instruct-Q4_K_M - Story Generator")
    print("=" * 60)

    # Parâmetros do modelo GGUF
    n_gpu_layers = 40  # Ajuste conforme sua GPU
    n_ctx = 2048

    # Baseline de memória
    ram_before, vram_before = get_memory_usage()
    print(f"\n📊 Memória Antes:")
    print(f"   RAM: {ram_before:.2f} GB")
    print(f"   VRAM: {vram_before:.2f} GB")

    # Carregamento do modelo
    print("\n⏳ Carregando modelo...")
    start_load = time.time()

    # Caminho local do modelo GGUF
    local_model_path = "models/Llama-3.1-8B-Instruct-Q4_K_M.gguf"
    model = Llama(
        model_path=local_model_path,
        n_gpu_layers=n_gpu_layers,
        n_ctx=n_ctx,
        verbose=True
    )

    load_time = time.time() - start_load
    ram_after, vram_after = get_memory_usage()

    print(f"✅ Modelo carregado em {load_time:.2f}s")
    print(f"\n📊 Memória Depois:")
    print(f"   RAM: {ram_after:.2f} GB (+{ram_after - ram_before:.2f} GB)")
    print(f"   VRAM: {vram_after:.2f} GB (+{vram_after - vram_before:.2f} GB)")

    # Verificação de uso da GPU (alternativa)
    print(f"\n🔎 Parâmetro n_gpu_layers informado: {n_gpu_layers}")
    print("Se você instalou a wheel CUDA e passou n_gpu_layers > 0, a GPU deve ser utilizada.")
    print("Para confirmação, monitore o uso de VRAM pelo gerenciador de tarefas ou observe logs do llama-cpp-python.")
    print("Se a VRAM não aumentar, verifique se a wheel instalada é realmente CUDA/cuBLAS e se o modelo GGUF é compatível.")
    
    # Teste de geração
    print("\n📝 Testando geração de história...")
    
    prompts = [
        "Write the beginning of a fantasy story about a brave knight:",
        "Create a mysterious sci-fi opening about a space explorer:",
        "Tell a heartwarming story about a child and their pet:"
    ]

    for i, prompt in enumerate(prompts, 1):
        print(f"\n--- Teste {i}/3 ---")
        print(f"Prompt: {prompt[:50]}...")

        start_gen = time.time()
        output = model(
            prompt,
            max_tokens=100,
            temperature=0.7,
            top_p=0.9,
            stop=["\n"]
        )
        gen_time = time.time() - start_gen
        result = output["choices"][0]["text"]

        print(f"⏱️  Tempo: {gen_time:.2f}s")
        print(f"📄 Output ({len(result)} chars):\n{result[:200]}...")

        # Verifica critérios
        if gen_time > 15:
            print("⚠️  AVISO: Tempo acima do esperado (>15s)")
        if vram_after > 7:
            print("❌ FALHA: VRAM excedeu 7GB")
            return False
    
    print("\n" + "=" * 60)
    print("✅ TESTE CONCLUÍDO COM SUCESSO")
    print("=" * 60)
    return True

if __name__ == "__main__":
    try:
        success = test_llama2()
        exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        import traceback
        traceback.print_exc()
        exit(1)