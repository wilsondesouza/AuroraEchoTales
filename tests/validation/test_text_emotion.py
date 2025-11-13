from transformers import pipeline
from test_llama2_story import get_memory_usage

def test_text_emotion():
    print("=" * 60)
    print("📝 TESTE: DistilRoBERTa - Text Emotion Analysis")
    print("=" * 60)
    
    ram_before, vram_before = get_memory_usage()
    
    print("\n⏳ Carregando classificador...")
    classifier = pipeline(
        "text-classification",
        model="j-hartmann/emotion-english-distilroberta-base",
        device=0,  # GPU
        top_k=None
    )
    
    ram_after, vram_after = get_memory_usage()
    print(f"✅ Carregado")
    print(f"📊 Memória: VRAM {vram_after:.2f}GB (+{vram_after-vram_before:.2f})")
    
    # Testes
    test_texts = [
        "I am so happy and excited about this wonderful day!",
        "This is the saddest moment of my life...",
        "I'm furious! This is completely unacceptable!",
        "I'm terrified of what might happen next.",
        "Just another ordinary day, nothing special."
    ]
    
    print("\n🎭 Analisando textos...")
    for text in test_texts:
        result = classifier(text)[0]
        top_emotion = max(result, key=lambda x: x['score'])
        print(f"\n📝 Texto: {text[:50]}...")
        print(f"   😊 Emoção: {top_emotion['label']} ({top_emotion['score']:.2%})")
    
    print("\n✅ TESTE CONCLUÍDO")
    return True

if __name__ == "__main__":
    test_text_emotion()