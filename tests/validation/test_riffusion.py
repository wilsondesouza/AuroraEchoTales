import torch
from diffusers import StableDiffusionPipeline
from PIL import Image
import numpy as np
from scipy.io import wavfile
from test_llama2_story import get_memory_usage
import time

def spectrogram_to_audio(spectrogram_image):
    """Converte espectrograma para áudio (simplificado)"""
    # Implementação real requer conversão via Riffusion utils
    # Aqui é placeholder
    return np.random.randn(16000 * 5)  # 5s de áudio

def test_riffusion():
    print("=" * 60)
    print("🎵 TESTE: Riffusion - Music Generation")
    print("=" * 60)
    
    ram_before, vram_before = get_memory_usage()
    
    print("\n⏳ Carregando Riffusion...")
    start = time.time()
    pipe = StableDiffusionPipeline.from_pretrained(
        "riffusion/riffusion-model-v1",
        torch_dtype=torch.float16,
        safety_checker=None
    ).to("cuda")
    
    # Otimização
    pipe.enable_attention_slicing()
    
    load_time = time.time() - start
    ram_after, vram_after = get_memory_usage()
    
    print(f"✅ Carregado em {load_time:.2f}s")
    print(f"📊 VRAM: {vram_after:.2f}GB (+{vram_after-vram_before:.2f})")
    
    # Testes de prompts
    test_prompts = [
        "calm piano melody, peaceful, slow tempo",
        "upbeat jazz guitar, energetic and joyful",
        "dark ambient synthesizer, tense and mysterious"
    ]
    
    for i, prompt in enumerate(test_prompts, 1):
        print(f"\n--- Teste {i}/3 ---")
        print(f"🎼 Prompt: {prompt}")
        
        start = time.time()
        image = pipe(
            prompt,
            height=512,
            width=512,
            num_inference_steps=20  # Reduzido para teste rápido
        ).images[0]
        gen_time = time.time() - start
        
        print(f"⏱️  Tempo: {gen_time:.2f}s")
        print(f"📊 Espectrograma gerado: {image.size}")
        
        # Salvar para inspeção
        image.save(f"test_riffusion_output_{i}.png")
        
        if gen_time > 45:
            print("⚠️  AVISO: Tempo alto")
    
    print("\n✅ TESTE CONCLUÍDO")
    print("💡 Verifique as imagens geradas para qualidade")
    return True

if __name__ == "__main__":
    test_riffusion()