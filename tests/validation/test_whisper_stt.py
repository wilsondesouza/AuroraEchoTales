import whisper
import time
import torch
import numpy as np
from test_llama2_story import get_memory_usage

def test_whisper():
    print("=" * 60)
    print("🎙️  TESTE: Whisper Small - Speech-to-Text")
    print("=" * 60)
    
    ram_before, vram_before = get_memory_usage()
    print(f"\n📊 Memória Antes: RAM {ram_before:.2f}GB | VRAM {vram_before:.2f}GB")
    
    # Carregar modelo
    print("\n⏳ Carregando Whisper Small...")
    start = time.time()
    model = whisper.load_model("small", device="cuda")
    load_time = time.time() - start
    
    ram_after, vram_after = get_memory_usage()
    print(f"✅ Carregado em {load_time:.2f}s")
    print(f"📊 Memória: RAM {ram_after:.2f}GB (+{ram_after-ram_before:.2f}) | VRAM {vram_after:.2f}GB (+{vram_after-vram_before:.2f})")
    
    # Teste com áudio sintético (simulação)
    print("\n🎵 Gerando áudio de teste...")
    # Simula 10s de áudio (16kHz, mono)
    sample_rate = 16000
    duration = 10
    audio = np.random.randn(sample_rate * duration).astype(np.float32)
    
    # Transcrição
    print("\n📝 Transcrevendo...")
    start = time.time()
    result = model.transcribe(audio, language="en")
    transcribe_time = time.time() - start
    
    print(f"⏱️  Tempo: {transcribe_time:.2f}s para {duration}s de áudio")
    print(f"📄 Texto detectado: {result['text']}")
    
    # Critérios
    if vram_after > 3:
        print("⚠️  AVISO: VRAM alto para Whisper")
    if transcribe_time > 15:
        print("⚠️  AVISO: Tempo de transcrição lento")
    
    print("\n✅ TESTE CONCLUÍDO")
    return True

if __name__ == "__main__":
    test_whisper()