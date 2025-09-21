export class MathpixService {
  private static readonly API_BASE_URL = 'https://api.mathpix.com/v3';

  static async processImage(
    imageFile: File,
    options: {
      appId: string;
      appKey: string;
      includeMath?: boolean;
      outputFormats?: string[];
    }
  ): Promise<{
    status: number;
    data: any;
    error?: string;
    request?: {
      url: string;
      method: string;
      headers: Record<string, string>;
      body: FormData;
      parameters: Record<string, any>;
    };
  }> {
    try {
      // Validar que tenemos las credenciales necesarias
      if (!options.appId || !options.appKey) {
        throw new Error('App ID y App Key son requeridos');
      }

      // Crear FormData para la imagen
      const formData = new FormData();
      formData.append('file', imageFile);

      // Configurar opciones de procesamiento
      const processingOptions: any = {
        include_math: options.includeMath ?? true,
        include_latex: options.outputFormats?.includes('latex') ?? true,
        include_mathml: options.outputFormats?.includes('mathml') ?? true,
        include_text: options.outputFormats?.includes('text') ?? true,
      };

      // Agregar opciones al FormData
      Object.entries(processingOptions).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      // Preparar información de la request
      const requestUrl = `${this.API_BASE_URL}/text`;
      const requestHeaders = {
        'app_id': options.appId,
        'app_key': options.appKey,
      };

      // Realizar la petición
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: formData,
      });

      // Obtener el body de la respuesta
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      return {
        status: response.status,
        data: responseData,
        error: response.ok ? undefined : `Error ${response.status}: ${response.statusText}`,
        request: {
          url: requestUrl,
          method: 'POST',
          headers: requestHeaders,
          body: formData,
          parameters: {
            file: {
              name: imageFile.name,
              size: imageFile.size,
              type: imageFile.type
            },
            ...processingOptions
          }
        }
      };

    } catch (error) {
      console.error('Error processing image with Mathpix:', error);
      return {
        status: 0,
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido',
        request: {
          url: `${this.API_BASE_URL}/text`,
          method: 'POST',
          headers: {
            'app_id': options.appId,
            'app_key': options.appKey,
          },
          body: new FormData(),
          parameters: {
            file: {
              name: imageFile.name,
              size: imageFile.size,
              type: imageFile.type
            },
            include_math: options.includeMath ?? true,
            include_latex: options.outputFormats?.includes('latex') ?? true,
            include_mathml: options.outputFormats?.includes('mathml') ?? true,
            include_text: options.outputFormats?.includes('text') ?? true,
          }
        }
      };
    }
  }

  static validateImageFile(file: File): { valid: boolean; error?: string } {
    // Validar tipo de archivo
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'application/pdf'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de archivo no soportado. Use JPG, PNG, GIF, BMP, WebP o PDF.'
      };
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'El archivo es demasiado grande. Máximo 10MB.'
      };
    }

    return { valid: true };
  }

  static formatResponseData(data: any): string {
    if (typeof data === 'string') {
      return data;
    }
    
    if (typeof data === 'object' && data !== null) {
      return JSON.stringify(data, null, 2);
    }
    
    return String(data);
  }
}
