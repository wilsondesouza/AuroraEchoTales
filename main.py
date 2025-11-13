"""
Aurora EchoTales - Main Entry Point
====================================
Ponto de entrada principal da aplicação.
Demonstra inicialização e uso básico do backend.
"""

import sys
from pathlib import Path

# Adicionar backend ao path
sys.path.insert(0, str(Path(__file__).parent))

from backend import initialize_backend, get_resource_manager, get_logger
from backend.config import print_config_summary


def demo_initialization():
    """Demonstra inicialização do backend"""
    print("\n" + "🎭 "*30)
    print("   AURORA ECHOTALES - SISTEMA DE STORYTELLING COM IA")
    print("🎭 "*30 + "\n")
    
    # Imprimir configurações
    print_config_summary()
    
    # Inicializar backend
    print("🚀 Inicializando backend...\n")
    logger, rm = initialize_backend()
    
    # Demonstrar funcionalidades
    logger.log_section("DEMONSTRAÇÃO DE FUNCIONALIDADES")
    
    # 1. Monitoramento de recursos
    logger.info("1️⃣ Capturando snapshot de recursos...")
    snapshot = rm.get_snapshot()
    logger.log_resource_usage(
        snapshot.vram_used_gb,
        snapshot.cpu_percent,
        snapshot.ram_used_gb
    )
    
    # 2. Teste de limpeza de memória
    logger.info("2️⃣ Testando limpeza de memória...")
    rm.clear_memory()
    logger.info("   ✅ Cache limpo")
    
    # 3. Verificação de limites
    logger.info("3️⃣ Verificando limites de VRAM...")
    within_limit = rm.check_vram_limit()
    if within_limit:
        logger.info("   ✅ VRAM dentro do limite")
    else:
        logger.warning("   ⚠️ VRAM próxima do limite!")
    
    # 4. Resumo final
    logger.log_section("RESUMO FINAL")
    rm.print_summary()
    
    logger.info("✅ Demonstração concluída!")
    logger.info(f"📝 Logs salvos em: logs/")
    
    return logger, rm


def demo_audio_utils():
    """Demonstra utilitários de áudio"""
    from backend.utils.audio_utils import AudioProcessor, create_silence
    
    logger = get_logger()
    logger.log_section("DEMONSTRAÇÃO DE ÁUDIO")
    
    processor = AudioProcessor()
    
    # Criar áudio de teste
    logger.info("🎵 Criando áudio sintético...")
    test_audio = create_silence(1000)  # 1 segundo
    logger.info(f"   Duração: {processor.get_duration_seconds(test_audio):.2f}s")
    
    # Aplicar efeitos
    logger.info("✨ Aplicando efeitos (fade in/out, normalização)...")
    processed = processor.apply_effects(
        test_audio,
        fade_in_ms=200,
        fade_out_ms=200,
        normalize=True
    )
    logger.info("   ✅ Efeitos aplicados")
    
    # Mixagem
    logger.info("🎚️ Mixando áudios...")
    mixed = processor.mix_audio([test_audio, test_audio], mode="sequential")
    logger.info(f"   Duração mixada: {processor.get_duration_seconds(mixed):.2f}s")
    
    logger.info("✅ Demonstração de áudio concluída!")


def show_menu():
    """Mostra menu de opções"""
    print("\n" + "="*60)
    print("🎭 MENU PRINCIPAL")
    print("="*60)
    print("1. Demo: Inicialização do Backend")
    print("2. Demo: Utilitários de Áudio")
    print("3. Verificar Ambiente")
    print("4. Imprimir Configurações")
    print("5. Monitorar Recursos")
    print("0. Sair")
    print("="*60)


def main():
    """Função principal"""
    
    while True:
        show_menu()
        
        try:
            choice = input("\n👉 Escolha uma opção: ").strip()
            
            if choice == "1":
                demo_initialization()
            
            elif choice == "2":
                demo_audio_utils()
            
            elif choice == "3":
                print("\n🔍 Executando verificação de ambiente...\n")
                import check_environment
                check_environment.main()
            
            elif choice == "4":
                print_config_summary()
            
            elif choice == "5":
                rm = get_resource_manager()
                rm.print_summary()
            
            elif choice == "0":
                print("\n👋 Encerrando Aurora EchoTales. Até logo!\n")
                break
            
            else:
                print("\n❌ Opção inválida. Tente novamente.")
        
        except KeyboardInterrupt:
            print("\n\n👋 Encerrando Aurora EchoTales. Até logo!\n")
            break
        except Exception as e:
            print(f"\n❌ Erro: {e}")
            import traceback
            traceback.print_exc()


if __name__ == "__main__":
    main()
