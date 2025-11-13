

import os
import time
from test_llama2_story import get_memory_usage
from scipy.io.wavfile import write as write_wav
from TTS.api import TTS  # Fork idiap/coqui-ai-TTS
import torch
import numpy as np

def test_xtts():
    print("=" * 60)
    print("🗣️ TESTE: XTTS v2 - Coqui TTS")
    print("=" * 60)
    ram_before, vram_before = get_memory_usage()
    print("\n⏳ Carregando modelo XTTS...")
    start = time.time()
    tts = TTS(model_name="tts_models/multilingual/multi-dataset/xtts_v2")
    tts.to("cuda")
    load_time = time.time() - start
    ram_after, vram_after = get_memory_usage()
    print(f"✅ Carregado em {load_time:.2f}s")
    print(f"� VRAM: {vram_after:.2f}GB (+{vram_after-vram_before:.2f})")
    # Testes com diferentes emoções (XTTS não tem preset de emoção direta, mas aceita variações de texto)
    test_cases = [
        {
            "text": "Era uma vez, em uma floresta mágica, vivia uma pequena raposa corajosa.",
            "speaker_wav": None,
            "emotion": "neutral"
        },
        {
            "text": "Oh não! O dragão está vindo! Precisamos nos esconder!",
            "speaker_wav": None,
            "emotion": "fear"
        },
        {
            "text": "Este é o MELHOR dia de todos! Estou tão feliz!",
            "speaker_wav": None,
            "emotion": "joy"
        },
        {
            "text": "Eu me sinto tão triste... Tudo está perdido.",
            "speaker_wav": None,
            "emotion": "sadness"
        }]
    
    for i, test in enumerate(test_cases, 1):
        print(f"\n--- Teste {i}/4: {test['emotion']} ---")
        print(f"📝 Texto: {test['text'][:50]}...")
        start = time.time()
        # XTTS aceita speaker_wav para customização de voz, aqui None para voz padrão
        try:
            audio_array = tts.tts(
                text=test['text'],
                speaker="Brenda Stern",
                language="pt"
            )
            gen_time = time.time() - start
            print(f"⏱️  Tempo: {gen_time:.2f}s")

            # Normalizar o retorno para um numpy array unidimensional
            try:
                wav = audio_array
                # Caso o TTS retorne (wav, sample_rate) ou similar
                if isinstance(wav, tuple) and len(wav) >= 1:
                    wav = wav[0]

                # Lista de arrays/frames -> concatenar
                if isinstance(wav, list):
                    try:
                        wav = np.concatenate([np.asarray(x) for x in wav])
                    except Exception:
                        wav = np.asarray(wav)
                # Torch tensor -> numpy
                if torch.is_tensor(wav):
                    wav = wav.detach().cpu().numpy()
                # Garantir numpy
                wav = np.asarray(wav)

                # Debug: tipo/shape
                print(f"📊 Áudio (tipo): {type(wav)}, shape={getattr(wav, 'shape', None)}, dtype={wav.dtype}")

                # Converter para int16 para salvar WAV
                if np.issubdtype(wav.dtype, np.integer):
                    audio_int16 = wav.astype(np.int16)
                else:
                    wav = np.clip(wav, -1.0, 1.0)
                    audio_int16 = (wav * 32767).astype(np.int16)

                output_file = f"test_xtts_output_{i}_{test['emotion']}.wav"
                write_wav(output_file, tts.synthesizer.output_sample_rate, audio_int16)
                print(f"💾 Salvo: {output_file}")
                if gen_time > 20:
                    print("⚠️  AVISO: Tempo alto")
            except Exception as ex_inner:
                print(f"❌ Erro processando áudio gerado: {ex_inner}")
        except Exception as e:
            print(f"❌ Erro ao gerar áudio: {e}")
        # Limpar cache
        try:
            torch.cuda.empty_cache()
        except Exception:
            pass
    print("\n✅ TESTE CONCLUÍDO")
    print("🎧 Ouça os arquivos WAV gerados para avaliar qualidade")
    return True
if __name__ == "__main__":
    test_xtts()