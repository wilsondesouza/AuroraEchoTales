from bark import SAMPLE_RATE, generate_audio, preload_models
from scipy.io.wavfile import write as write_wav
from test_llama2_story import get_memory_usage
import time
import torch

def test_bark():
    print("=" * 60)
    print("🎤 TESTE: Bark - TTS Narrator")
    print("=" * 60)
    
    ram_before, vram_before = get_memory_usage()
    
    print("\n⏳ Pré-carregando modelos Bark...")
    start = time.time()
    preload_models()
    load_time = time.time() - start
    
    ram_after, vram_after = get_memory_usage()
    print(f"✅ Carregado em {load_time:.2f}s")
    print(f"📊 VRAM: {vram_after:.2f}GB (+{vram_after-vram_before:.2f})")
    
    # Testes com diferentes emoções
    test_cases = [
        {
            "text": "Era uma vez, em uma floresta mágica, vivia uma pequena raposa corajosa.",
            "preset": "v2/pt_speaker_6",
            "emotion": "neutral"
        },
        {
            "text": "Oh não! [gasp] O dragão está vindo! Precisamos nos esconder!",
            "preset": "v2/pt_speaker_3",
            "emotion": "fear"
        },
        {
            "text": "Este é o MELHOR dia de todos! [laugh] Estou tão feliz!",
            "preset": "v2/pt_speaker_6",
            "emotion": "joy"
        },
        {
            "text": "Eu me sinto tão triste... [sigh] Tudo está perdido.",
            "preset": "v2/pt_speaker_9",
            "emotion": "sadness"
        }
    ]
    
    for i, test in enumerate(test_cases, 1):
        print(f"\n--- Teste {i}/4: {test['emotion']} ---")
        print(f"📝 Texto: {test['text'][:50]}...")
        
        start = time.time()
        audio_array = generate_audio(
            test['text'],
            history_prompt=test['preset']
        )
        gen_time = time.time() - start
        
        print(f"⏱️  Tempo: {gen_time:.2f}s")
        print(f"📊 Áudio: {len(audio_array)/SAMPLE_RATE:.2f}s de duração")
        
        # Salvar
        output_file = f"test_bark_output_{i}_{test['emotion']}.wav"
        write_wav(output_file, SAMPLE_RATE, audio_array)
        print(f"💾 Salvo: {output_file}")
        
        if gen_time > 20:
            print("⚠️  AVISO: Tempo alto")
        
        # Limpar cache
        torch.cuda.empty_cache()
    
    print("\n✅ TESTE CONCLUÍDO")
    print("🎧 Ouça os arquivos WAV gerados para avaliar qualidade")
    return True

if __name__ == "__main__":
    test_bark()