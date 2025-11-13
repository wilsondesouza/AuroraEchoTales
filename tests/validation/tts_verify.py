import torch
from TTS.api import TTS

# Get device
device = "cuda" if torch.cuda.is_available() else "cpu"

# List available 🐸TTS models

# Load a specific model
tts = TTS(model_name="tts_models/multilingual/multi-dataset/xtts_v2")
print(tts.speakers)


