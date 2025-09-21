/**
 * TTSManager - Servicio para manejar Text-to-Speech con cola de reproducción
 * Asegura que las lecturas no se superpongan y se reproduzcan secuencialmente
 */

export interface TTSQueueItem {
  id: string;
  text: string;
  agentName: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

class TTSManager {
  private queue: TTSQueueItem[] = [];
  private isPlaying = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isEnabled = false;

  constructor() {
    // Verificar si el navegador soporta speech synthesis
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis no está soportado en este navegador');
    }
  }

  /**
   * Habilita o deshabilita el TTS
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  /**
   * Agrega un texto a la cola de reproducción
   */
  addToQueue(item: Omit<TTSQueueItem, 'id'>) {
    if (!this.isEnabled) return;

    const queueItem: TTSQueueItem = {
      ...item,
      id: `tts-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.queue.push(queueItem);
    console.log(`TTS: Agregado a la cola - ${queueItem.agentName}`, queueItem.text.substring(0, 100) + '...');

    // Si no está reproduciendo, empezar
    if (!this.isPlaying) {
      this.processQueue();
    }
  }

  /**
   * Procesa la cola de reproducción
   */
  private async processQueue() {
    if (this.queue.length === 0 || this.isPlaying) return;

    const item = this.queue.shift();
    if (!item) return;

    this.isPlaying = true;
    console.log(`TTS: Iniciando lectura - ${item.agentName}`);

    try {
      await this.speak(item);
    } catch (error) {
      console.error('TTS: Error en la lectura:', error);
      item.onError?.(error as Error);
    } finally {
      this.isPlaying = false;
      item.onEnd?.();
      
      // Procesar siguiente elemento en la cola
      setTimeout(() => this.processQueue(), 100);
    }
  }

  /**
   * Reproduce un texto usando la Web Speech API
   */
  private speak(item: TTSQueueItem): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis no está soportado'));
        return;
      }

      // Cancelar cualquier reproducción anterior
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(item.text);
      this.currentUtterance = utterance;

      // Configurar la voz (preferir español si está disponible)
      const voices = speechSynthesis.getVoices();
      const spanishVoice = voices.find(voice => 
        voice.lang.startsWith('es') || 
        voice.name.toLowerCase().includes('spanish') ||
        voice.name.toLowerCase().includes('español')
      );
      
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      // Configurar parámetros de voz
      utterance.rate = 0.9; // Velocidad ligeramente más lenta para mejor comprensión
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      // Eventos
      utterance.onstart = () => {
        console.log(`TTS: Reproduciendo - ${item.agentName}`);
        item.onStart?.();
      };

      utterance.onend = () => {
        console.log(`TTS: Completado - ${item.agentName}`);
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('TTS: Error en utterance:', event);
        this.currentUtterance = null;
        reject(new Error(`Error de speech synthesis: ${event.error}`));
      };

      // Iniciar reproducción
      speechSynthesis.speak(utterance);
    });
  }

  /**
   * Detiene la reproducción actual y limpia la cola
   */
  stop() {
    speechSynthesis.cancel();
    this.queue = [];
    this.isPlaying = false;
    this.currentUtterance = null;
    console.log('TTS: Detenido y cola limpiada');
  }

  /**
   * Pausa la reproducción actual
   */
  pause() {
    if (this.isPlaying) {
      speechSynthesis.pause();
    }
  }

  /**
   * Reanuda la reproducción pausada
   */
  resume() {
    if (this.isPlaying) {
      speechSynthesis.resume();
    }
  }

  /**
   * Obtiene el estado actual del TTS
   */
  getStatus() {
    return {
      isEnabled: this.isEnabled,
      isPlaying: this.isPlaying,
      queueLength: this.queue.length,
      currentItem: this.queue[0] || null
    };
  }

  /**
   * Limpia la cola sin detener la reproducción actual
   */
  clearQueue() {
    this.queue = [];
    console.log('TTS: Cola limpiada');
  }

  /**
   * Resetea completamente el estado del TTS
   */
  reset() {
    speechSynthesis.cancel();
    this.queue = [];
    this.isPlaying = false;
    this.currentUtterance = null;
    console.log('TTS: Estado completamente reseteado');
  }
}

// Instancia singleton
export const ttsManager = new TTSManager();

// Exportar también la clase para testing
export { TTSManager };
