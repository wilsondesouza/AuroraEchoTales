"""
🧪 Script Inicial de Validação - Aurora EchoTales

Este script verifica se o ambiente está pronto para os testes de validação.
Execute primeiro para garantir que todas as dependências estão instaladas.

Uso:
    python tests/validation/check_environment.py
"""

import sys
import importlib
from pathlib import Path

def check_package(package_name, display_name=None):
    """Verifica se um pacote Python está instalado."""
    if display_name is None:
        display_name = package_name
    
    try:
        importlib.import_module(package_name)
        print(f"✅ {display_name}")
        return True
    except ImportError:
        print(f"❌ {display_name} - NÃO INSTALADO")
        return False

def check_cuda():
    """Verifica disponibilidade de CUDA."""
    try:
        import torch
        if torch.cuda.is_available():
            gpu_name = torch.cuda.get_device_name(0)
            vram = torch.cuda.get_device_properties(0).total_memory / (1024**3)
            print(f"✅ CUDA disponível")
            print(f"   GPU: {gpu_name}")
            print(f"   VRAM: {vram:.1f} GB")
            return True
        else:
            print(f"⚠️  PyTorch instalado mas CUDA não disponível")
            return False
    except ImportError:
        print(f"❌ PyTorch não instalado")
        return False

def main():
    print("="*60)
    print("🔍 Verificação de Ambiente - Aurora EchoTales")
    print("="*60)
    
    print("\n📦 Verificando pacotes essenciais...")
    packages = [
        ("torch", "PyTorch"),
        ("transformers", "Transformers (Hugging Face)"),
        ("diffusers", "Diffusers (Stable Diffusion)"),
        ("whisper", "OpenAI Whisper"),
        ("scipy", "SciPy"),
        ("PIL", "Pillow"),
        ("psutil", "psutil"),
        ("numpy", "NumPy"),
    ]
    
    results = []
    for pkg, name in packages:
        results.append(check_package(pkg, name))
    
    print("\n🎮 Verificando GPU...")
    cuda_ok = check_cuda()
    
    print("\n📁 Verificando estrutura de diretórios...")
    required_dirs = [
        "tests/validation",
        "cache",
        "output"
    ]
    
    project_root = Path(__file__).parent.parent.parent
    for dir_path in required_dirs:
        full_path = project_root / dir_path
        if full_path.exists():
            print(f"✅ {dir_path}")
        else:
            print(f"⚠️  {dir_path} - Criando...")
            full_path.mkdir(parents=True, exist_ok=True)
    
    # Resumo
    print("\n" + "="*60)
    print("📊 RESUMO")
    print("="*60)
    
    total = len(results)
    passed = sum(results)
    
    print(f"Pacotes: {passed}/{total} instalados")
    print(f"CUDA: {'✅ OK' if cuda_ok else '❌ Não disponível'}")
    
    if passed == total and cuda_ok:
        print("\n🎉 Ambiente pronto para validação!")
        print("\n📝 Próximo passo:")
        print("   python tests/validation/run_all_tests.py")
        return 0
    else:
        print("\n⚠️  Ambiente incompleto.")
        print("\n📝 Instale as dependências:")
        print("   pip install -r requirements-validation.txt")
        print("   pip install git+https://github.com/suno-ai/bark.git")
        return 1

if __name__ == "__main__":
    sys.exit(main())
