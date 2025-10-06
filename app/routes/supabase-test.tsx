import React, { useCallback, useMemo, useState } from "react";
import type { Route } from "../+types/root";

export const meta: Route.MetaFunction = () => [{ title: "Prueba Supabase Storage" }];

type SupabaseConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  bucketName: string;
  basePath?: string;
};

const LOCAL_KEYS = {
  url: "supabase.url",
  anon: "supabase.anonKey",
  bucket: "supabase.bucket",
  basePath: "supabase.basePath",
};

function loadConfigFromLocalStorage(): SupabaseConfig {
  return {
    supabaseUrl: localStorage.getItem(LOCAL_KEYS.url) || "",
    supabaseAnonKey: localStorage.getItem(LOCAL_KEYS.anon) || "",
    bucketName: localStorage.getItem(LOCAL_KEYS.bucket) || "",
    basePath: localStorage.getItem(LOCAL_KEYS.basePath) || "",
  };
}

function saveConfigToLocalStorage(config: SupabaseConfig) {
  localStorage.setItem(LOCAL_KEYS.url, config.supabaseUrl.trim());
  localStorage.setItem(LOCAL_KEYS.anon, config.supabaseAnonKey.trim());
  localStorage.setItem(LOCAL_KEYS.bucket, config.bucketName.trim());
  localStorage.setItem(LOCAL_KEYS.basePath, (config.basePath || "").trim());
}

export default function SupabaseTestRoute() {
  const [config, setConfig] = useState<SupabaseConfig>(() => loadConfigFromLocalStorage());
  const [status, setStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const isConfigComplete = useMemo(() => {
    return (
      config.supabaseUrl.trim().length > 0 &&
      config.supabaseAnonKey.trim().length > 0 &&
      config.bucketName.trim().length > 0
    );
  }, [config]);

  const handleSaveConfig = useCallback(() => {
    saveConfigToLocalStorage(config);
    setStatus("Configuración guardada en este dispositivo.");
  }, [config]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!isConfigComplete) {
      setStatus("Faltan datos de configuración (URL, anon key o bucket).");
      return;
    }

    try {
      setIsUploading(true);
      setStatus("Subiendo imagen...");

      // Lazy import to avoid adding SDK to initial bundle if not used here
      const { createClient } = await import("@supabase/supabase-js");
      const client = createClient(config.supabaseUrl.trim(), config.supabaseAnonKey.trim());

      // Build timestamp filename without subfolders
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}-${String(now.getMilliseconds()).padStart(3, "0")}`;

      const originalExt = (file.name.split(".").pop() || "").toLowerCase();
      const safeExt = originalExt && originalExt.length <= 6 ? originalExt : "jpg";
      const basePath = (config.basePath || "").trim();
      const objectName = basePath ? `${basePath}-${timestamp}.${safeExt}` : `${timestamp}.${safeExt}`;

      const { error } = await client.storage
        .from(config.bucketName.trim())
        .upload(objectName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });

      if (error) {
        setStatus(`Error al subir: ${error.message}`);
        return;
      }

      setStatus(`Subida exitosa: ${objectName}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setStatus(`Error: ${message}`);
    } finally {
      setIsUploading(false);
    }
  }, [config, isConfigComplete]);

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Prueba de subida a Supabase Storage</h1>

      <section className="mb-6">
        <h2 className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Configuración</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Supabase URL"
            value={config.supabaseUrl}
            onChange={(e) => setConfig((c) => ({ ...c, supabaseUrl: e.target.value }))}
            className="w-full p-2 rounded border"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)'}}
            autoComplete="off"
          />
          <input
            type="password"
            placeholder="Anon public API key"
            value={config.supabaseAnonKey}
            onChange={(e) => setConfig((c) => ({ ...c, supabaseAnonKey: e.target.value }))}
            className="w-full p-2 rounded border"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)'}}
            autoComplete="off"
          />
          <input
            type="text"
            placeholder="Bucket name (privado)"
            value={config.bucketName}
            onChange={(e) => setConfig((c) => ({ ...c, bucketName: e.target.value }))}
            className="w-full p-2 rounded border"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)'}}
            autoComplete="off"
          />
          <input
            type="text"
            placeholder="Prefijo base (opcional, sin subcarpetas)"
            value={config.basePath || ""}
            onChange={(e) => setConfig((c) => ({ ...c, basePath: e.target.value }))}
            className="w-full p-2 rounded border"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)'}}
            autoComplete="off"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSaveConfig}
              className="px-4 py-2 rounded font-medium"
              style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
            >
              Guardar configuración
            </button>
            <button
              onClick={() => {
                const fresh = loadConfigFromLocalStorage();
                setConfig(fresh);
                setStatus("Configuración cargada desde este dispositivo.");
              }}
              className="px-4 py-2 rounded font-medium border"
              style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)'}}
            >
              Cargar configuración
            </button>
            <button
              onClick={() => {
                localStorage.removeItem(LOCAL_KEYS.url);
                localStorage.removeItem(LOCAL_KEYS.anon);
                localStorage.removeItem(LOCAL_KEYS.bucket);
                localStorage.removeItem(LOCAL_KEYS.basePath);
                setStatus("Configuración eliminada de este dispositivo.");
              }}
              className="px-4 py-2 rounded font-medium border"
              style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)'}}
            >
              Borrar configuración local
            </button>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Subir imagen</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={!isConfigComplete || isUploading}
          className="w-full"
        />
        <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Se permite una sola imagen por intento. Se usará un nombre basado en timestamp, sin subcarpetas.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-base font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>¿Cómo obtener y configurar los datos?</h3>
        <ul className="list-disc ml-5 space-y-1" style={{ color: 'var(--color-text-tertiary)' }}>
          <li>Supabase URL y Anon key: en tu proyecto de Supabase, ve a <em>Settings → API</em> y copia <em>Project URL</em> y <em>anon public API key</em>.</li>
          <li>Bucket privado: en <em>Storage → New bucket</em>, crea o selecciona tu bucket privado.</li>
          <li>Prefijo base (opcional): texto simple para anteponer al nombre (p. ej. <code>personal</code>), sin usar "/" ni subcarpetas.</li>
          <li>Políticas: si el bucket es privado, podrás verificar subidas en el dashboard. No se generan URLs públicas desde esta página.</li>
        </ul>
      </section>

      {status && (
        <div className="mt-4 p-3 rounded border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)'}}>
          {status}
        </div>
      )}
    </main>
  );
}


