import torch
import torchaudio
from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
import numpy as np
from test_llama2_story import get_memory_usage

def test_emotion2vec():
    print("=" * 60)
    print("😊 TESTE: Emotion2Vec - Audio Emotion Analysis")
    print("=" * 60)
    
        # Usando modelo pré-treinado para português
    model_name = "jonatasgrosman/wav2vec2-large-xlsr-53-portuguese"
    
    ram_before, vram_before = get_memory_usage()
    print(f"\n📊 Memória Antes: RAM {ram_before:.2f}GB | VRAM {vram_before:.2f}GB")
    
    print("\n⏳ Carregando Emotion2Vec...")
    processor = Wav2Vec2Processor.from_pretrained(model_name, do_lower_case=True)
    print("\n⏳ Carregando modelo de português...")
    # Para reconhecimento de fala, não de emoção
    model = Wav2Vec2ForCTC.from_pretrained(model_name).to("cuda")
    
    ram_after, vram_after = get_memory_usage()
    print(f"✅ Carregado")
    print(f"📊 Memória: RAM {ram_after:.2f}GB | VRAM {vram_after:.2f}GB")
    
    # Áudio de teste
    sample_rate = 16000
    audio = torch.randn(1, sample_rate * 5).numpy()  # 5s de áudio
    
    # Reconhecimento de fala (transcrição)
    print("\n🗣️ Transcrevendo áudio...")
    inputs = processor(audio[0], sampling_rate=sample_rate, return_tensors="pt", padding=True)
    inputs = {k: v.to("cuda") for k, v in inputs.items()}
    with torch.no_grad():
        logits = model(**inputs).logits
    predicted_ids = torch.argmax(logits, dim=-1)
    transcription = processor.batch_decode(predicted_ids)[0]
    print(f"� Transcrição: {transcription}")
    print("\n✅ TESTE CONCLUÍDO")
    print("\n⚠️  Para análise de emoção, é necessário realizar fine-tuning supervisionado com dataset de emoções em português.")
    # Reconhecimento de fala (transcrição)
    print("\n🗣️ Transcrevendo áudio...")
    inputs = processor(audio[0], sampling_rate=sample_rate, return_tensors="pt", padding=True)
    inputs = {k: v.to("cuda") for k, v in inputs.items()}
    
    with torch.no_grad():
        logits = model(**inputs).logits
        predicted_ids = torch.argmax(logits, dim=-1)
        transcription = processor.batch_decode(predicted_ids)[0]
    
        print(f"📝 Transcrição: {transcription}")
        print("\n✅ TESTE CONCLUÍDO")
        print("\n⚠️  Para análise de emoção, é necessário realizar fine-tuning supervisionado com dataset de emoções em português.")
    return True

if __name__ == "__main__":
    test_emotion2vec()