import { useState, useEffect } from 'react';
import { N8nConfig } from '@/types/medical';

const CONFIG_KEY = 'n8n_config';

export const useN8nConfig = () => {
  const [config, setConfig] = useState<N8nConfig | null>(() => {
    const stored = localStorage.getItem(CONFIG_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const saveConfig = (newConfig: N8nConfig) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
    setConfig(newConfig);
  };

  const clearConfig = () => {
    localStorage.removeItem(CONFIG_KEY);
    setConfig(null);
  };

  return { config, saveConfig, clearConfig, hasConfig: !!config };
};