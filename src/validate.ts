import { FetchEntityConfig, FetchEntityOutput } from './types.js';

export async function validate<T>(
  output: FetchEntityOutput<T> | null,
  config: FetchEntityConfig
): Promise<boolean> {
  if (!output?.data) return false;
  const data = output.data as Record<string, any>;
  const required = Object.keys(config.responseSchema.properties);
  
  for (const key of required) {
    if (!(key in data)) return false;
    if (data[key] === null || data[key] === undefined) return false;
  }
  if (data.email && !/^[^@]+@[^@]+\.[^@]+$/.test(data.email)) return false;
  return true;
}