import { createClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  bucketName: string;
  basePath?: string;
}

export interface UploadResult {
  success: boolean;
  path?: string;
  error?: string;
}

class SupabaseStorageService {
  private config: SupabaseConfig | null = null;
  private client: any = null;

  constructor() {
    this.loadConfigFromLocalStorage();
  }

  private loadConfigFromLocalStorage(): void {
    // Verificar que estamos en el cliente (navegador)
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    const config: SupabaseConfig = {
      supabaseUrl: localStorage.getItem('supabase.url') || '',
      supabaseAnonKey: localStorage.getItem('supabase.anonKey') || '',
      bucketName: localStorage.getItem('supabase.bucket') || '',
      basePath: localStorage.getItem('supabase.basePath') || '',
    };

    if (this.isConfigValid(config)) {
      this.config = config;
      this.client = createClient(config.supabaseUrl, config.supabaseAnonKey);
    }
  }

  private isConfigValid(config: SupabaseConfig): boolean {
    return (
      config.supabaseUrl.trim().length > 0 &&
      config.supabaseAnonKey.trim().length > 0 &&
      config.bucketName.trim().length > 0
    );
  }

  public isConfigured(): boolean {
    return this.config !== null && this.isConfigValid(this.config);
  }

  public async uploadPhotoAsync(file: File): Promise<UploadResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Supabase no está configurado. Ve a la página de configuración.'
      };
    }

    try {
      // Generar nombre de archivo con timestamp
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}-${String(now.getMilliseconds()).padStart(3, '0')}`;

      const originalExt = (file.name.split('.').pop() || '').toLowerCase();
      const safeExt = originalExt && originalExt.length <= 6 ? originalExt : 'jpg';
      const basePath = (this.config!.basePath || '').trim();
      const objectName = basePath ? `${basePath}-${timestamp}.${safeExt}` : `${timestamp}.${safeExt}`;

      const { error } = await this.client.storage
        .from(this.config!.bucketName)
        .upload(objectName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || undefined,
        });

      if (error) {
        return {
          success: false,
          error: `Error al subir: ${error.message}`
        };
      }

      return {
        success: true,
        path: objectName
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        error: `Error: ${message}`
      };
    }
  }

  public async uploadMultiplePhotosAsync(files: File[]): Promise<UploadResult[]> {
    // Ejecutar todas las subidas en paralelo para máxima velocidad
    const uploadPromises = files.map(file => this.uploadPhotoAsync(file));
    return Promise.all(uploadPromises);
  }

  public refreshConfig(): void {
    // Verificar que estamos en el cliente (navegador)
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    this.loadConfigFromLocalStorage();
  }
}

// Singleton instance
export const supabaseStorageService = new SupabaseStorageService();
