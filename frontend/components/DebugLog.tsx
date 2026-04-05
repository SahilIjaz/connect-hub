'use client';

import { useEffect, useState } from 'react';

export default function DebugLog() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Capture console logs
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    const addLog = (type: string, args: any[]) => {
      const message = args
        .map((arg) =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        )
        .join(' ');
      setLogs((prev) => [...prev, `[${type}] ${message}`].slice(-50)); // Keep last 50 logs
    };

    console.log = (...args) => {
      originalLog(...args);
      addLog('LOG', args);
    };

    console.error = (...args) => {
      originalError(...args);
      addLog('ERROR', args);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addLog('WARN', args);
    };

    // Log initial info
    console.log('🚀 DEBUG LOG INITIALIZED');
    console.log('📍 URL:', window.location.href);
    console.log('🌍 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 bg-black/90 border border-red-500 rounded-lg p-4 overflow-y-auto font-mono text-xs text-green-400">
      <div className="mb-2 font-bold text-red-400">DEBUG LOG</div>
      {logs.length === 0 ? (
        <div className="text-gray-500">Waiting for logs...</div>
      ) : (
        logs.map((log, i) => (
          <div key={i} className="mb-1 break-all">
            {log}
          </div>
        ))
      )}
    </div>
  );
}
