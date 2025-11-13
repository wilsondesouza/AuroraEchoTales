# 🧪 Guia de Validação de Modelos - Aurora EchoTales

Este guia orienta a validação individual de cada modelo de IA antes da integração completa.

---

## 🚀 Instalação

### Passo 1: Criar Ambiente Virtual

```powershell
# Na raiz do projeto
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### Passo 2: Instalar Dependências

```powershell
# Instalar PyTorch com CUDA
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Instalar Llama-cpp-Python com CUDA
pip install llama-cpp-python --prefer-binary --extra-index-url https://abetlen.github.io/llama-cpp-python/whl/cu121

# Instalar Hugging Face Hub
pip install huggingface-hub

# Instalar demais dependências
pip install -r requirements-validation.txt

# Instalar Bark (TTS)
pip install git+https://github.com/suno-ai/bark.git
```

### Passo 3: Verificar Ambiente

```powershell
python check_environment.py
```

**Output esperado:**
```
✅ PyTorch
✅ Transformers (Hugging Face)
✅ CUDA disponível
   GPU: NVIDIA GeForce RTX 4060
   VRAM: 8.0 GB

🎉 Ambiente pronto para validação!
```

---

## 🧪 Executando os Testes

### Ordem Recomendada

Execute os testes na seguinte ordem (do mais leve ao mais pesado):

#### 1️⃣ Análise de Emoção de Texto (mais rápido)

```powershell
python test_text_emotion.py
```

**Tempo estimado**: 30 segundos  
**VRAM**: ~0.5GB  
**O que valida**: Detecção de emoções em texto (joy, sadness, anger, etc.)
**Teste VRAM**: 0.5GB

---

#### 2️⃣ Whisper Speech-to-Text

```powershell
python test_whisper_stt.py
```

**Tempo estimado**: 1-2 minutos  
**VRAM**: ~2GB  
**O que valida**: Transcrição de áudio para texto
**Teste VRAM**: 1.60GB

---

#### 3️⃣ Emotion2Vec (Análise de Áudio)

```powershell
python test_emotion2vec.py
```

**Tempo estimado**: 1 minuto  
**VRAM**: ~1-2GB  
**O que valida**: Detecção de emoções em áudio
**Teste VRAM**: 1.30GB (possível aumento após fine-tuning)

---

#### 4️⃣ LLaMA 3.1 8B (Geração de Histórias)

```powershell
python test_llama2_story.py
```

**Tempo estimado**: 3-5 minutos  
**VRAM**: ~3.5GB  
**O que valida**: Geração de narrativas interativas
**Teste VRAM**: 4.90GB

⚠️ **Importante**: Este teste baixará o modelo (~13GB). Primeira execução demora mais.

---

#### 5️⃣ Riffusion (Geração de Música)

```powershell
python test_riffusion.py
```

**Tempo estimado**: 5-10 minutos  
**VRAM**: ~3GB  
**O que valida**: Geração de música procedural via prompts
**Teste VRAM**: 3GB

🎵 **Output**: Arquivos PNG de espectrogramas em `test_riffusion_output_*.png`

---

#### 6️⃣ XTTS v2 (TTS Narrador)

```powershell
python test_bark_tts.py
```

**Tempo estimado**: 5-10 minutos  
**VRAM**: ~4GB  
**O que valida**: Síntese de voz natural com emoções
**Teste VRAM**: 2GB

🎧 **Output**: Arquivos WAV em `test_bark_output_*.wav`

---

## 🎯 Próximos Passos

Após validação bem-sucedida:

1. ✅ Todos os testes PASS → Prosseguir para integração
2. 📋 Documentar quaisquer otimizações necessárias
3. 🔧 Implementar Module Manager
4. 🔄 Criar Orchestrator Service
5. 🚀 Integração incremental dos módulos

---

## 💡 Dicas de Performance

### Otimização de VRAM
```python
# Em cada teste, adicionar:
torch.cuda.empty_cache()
gc.collect()
```

### Quantização Agressiva
```python
# Para modelos maiores:
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16
)
```

### Attention Slicing (Riffusion)
```python
# Reduz pico de VRAM:
pipe.enable_attention_slicing()
pipe.enable_vae_slicing()
```

---

## 📚 Recursos Adicionais

- [VALIDATION_PLAN.md](../../VALIDATION_PLAN.md) - Plano completo com scripts
- [Hugging Face Docs](https://huggingface.co/docs)
- [PyTorch CUDA Guide](https://pytorch.org/docs/stable/cuda.html)
- [Bark GitHub](https://github.com/suno-ai/bark)
- [Riffusion Docs](https://www.riffusion.com/about)
