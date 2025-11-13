"""
Utilidades compartilhadas para testes de validação.
"""
import psutil
import torch

def get_memory_usage():
    """
    Retorna uso atual de RAM e VRAM.
    
    Returns:
        tuple: (ram_gb, vram_gb)
    """
    # RAM
    ram_bytes = psutil.Process().memory_info().rss
    ram_gb = ram_bytes / (1024 ** 3)
    
    # VRAM
    vram_gb = 0
    if torch.cuda.is_available():
        vram_bytes = torch.cuda.memory_allocated(0)
        vram_gb = vram_bytes / (1024 ** 3)
    
    return ram_gb, vram_gb

def print_memory_stats(label=""):
    """Imprime estatísticas de memória formatadas."""
    ram, vram = get_memory_usage()
    print(f"\n{'='*60}")
    print(f"📊 Memória {label}")
    print(f"{'='*60}")
    print(f"  💾 RAM:  {ram:.2f} GB")
    print(f"  🎮 VRAM: {vram:.2f} GB")
    print(f"{'='*60}\n")

def cleanup_memory():
    """Libera memória GPU e força garbage collection."""
    import gc
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    gc.collect()
