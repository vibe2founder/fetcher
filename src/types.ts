// Enum para os métodos HTTP
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

// Enum para tipos de dados suportados no schema
export enum SchemaDataType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY = 'array',
  DATE = 'date',
  EMAIL = 'email',
  URL = 'url',
  PHONE = 'phone',
  UUID = 'uuid'
}

// Interface para propriedades do schema com validadores
export interface SchemaProperty {
  type: SchemaDataType;
  required?: boolean;
  validator?: (value: any) => boolean;
  description?: string;
  format?: string; // Para tipos específicos como 'date-time', 'email', etc.
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string; // Regex pattern
  enum?: any[]; // Valores permitidos
  default?: any; // Valor padrão
}

// Interface para o schema de resposta
export interface ResponseSchema {
  properties: Record<string, SchemaProperty>;
}

export interface FetchEntityConfig {
  url: string;
  jwt?: string;
  entity: string;
  method?: HttpMethod;
  responseSchema: ResponseSchema;
  timeout?: number;
  strictMode?: boolean;
  maxAttempts?: number;
  jwtRefresher?: () => Promise<string>;
}
export interface FetchEntityOutput<T = any> { entity: string; data: T; }

// Enum para os métodos HTTP de criação/modificação
export enum CreateMethod {
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

// Enum para tipos de conteúdo
export enum ContentType {
  JSON = 'application/json',
  FORM_DATA = 'multipart/form-data',
  URL_ENCODED = 'application/x-www-form-urlencoded',
  TEXT = 'text/plain',
  XML = 'application/xml'
}

// Enum para estratégias de retry
export enum RetryStrategy {
  EXPONENTIAL = 'exponential',
  LINEAR = 'linear',
  FIXED = 'fixed'
}

// Interface para configuração de retry
export interface RetryConfig {
  maxAttempts?: number;
  strategy?: RetryStrategy;
  baseDelay?: number;
  maxDelay?: number;
  retryOn?: number[]; // Status codes para retry
}

// Interface para validação de dados
export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

// Interface para transformação de dados
export interface DataTransform {
  before?: (data: any) => any; // Transformar antes de enviar
  after?: (response: any) => any; // Transformar resposta
}

// Interface para contexto de erro
export interface ErrorContext {
  config: FetchEntityConfig;
  attempt: number;
  error: any;
  response?: any;
  output?: FetchEntityOutput;
  duration?: number;
}

// Interface para resultado de validação
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Interface para opções de execução
export interface ExecuteOptions {
  skipValidation?: boolean;
  skipTransform?: boolean;
  skipRetry?: boolean;
  customHeaders?: Record<string, string>;
}