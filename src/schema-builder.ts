import { SchemaProperty, SchemaDataType, ResponseSchema } from './types';
import { FieldValidators } from './validators';

/**
 * Builder para criar schemas de forma mais fácil e tipada
 */
export class SchemaBuilder {
  private properties: Record<string, SchemaProperty> = {};

  /**
   * Adiciona uma propriedade string ao schema
   */
  string(name: string, options?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    enum?: string[];
    default?: string;
    description?: string;
  }): SchemaBuilder {
    this.properties[name] = {
      type: SchemaDataType.STRING,
      ...options
    };
    return this;
  }

  /**
   * Adiciona uma propriedade number ao schema
   */
  number(name: string, options?: {
    required?: boolean;
    minimum?: number;
    maximum?: number;
    default?: number;
    description?: string;
  }): SchemaBuilder {
    this.properties[name] = {
      type: SchemaDataType.NUMBER,
      ...options
    };
    return this;
  }

  /**
   * Adiciona uma propriedade boolean ao schema
   */
  boolean(name: string, options?: {
    required?: boolean;
    default?: boolean;
    description?: string;
  }): SchemaBuilder {
    this.properties[name] = {
      type: SchemaDataType.BOOLEAN,
      ...options
    };
    return this;
  }

  /**
   * Adiciona uma propriedade email ao schema (com validador automático)
   */
  email(name: string, options?: {
    required?: boolean;
    description?: string;
  }): SchemaBuilder {
    this.properties[name] = {
      type: SchemaDataType.EMAIL,
      validator: FieldValidators.email,
      format: 'email',
      ...options
    };
    return this;
  }

  /**
   * Adiciona uma propriedade phone ao schema (com validador automático)
   */
  phone(name: string, options?: {
    required?: boolean;
    description?: string;
  }): SchemaBuilder {
    this.properties[name] = {
      type: SchemaDataType.PHONE,
      validator: FieldValidators.phone,
      format: 'phone',
      ...options
    };
    return this;
  }

  /**
   * Adiciona uma propriedade URL ao schema (com validador automático)
   */
  url(name: string, options?: {
    required?: boolean;
    description?: string;
  }): SchemaBuilder {
    this.properties[name] = {
      type: SchemaDataType.URL,
      validator: FieldValidators.url,
      format: 'uri',
      ...options
    };
    return this;
  }

  /**
   * Adiciona uma propriedade date ao schema (com validador automático)
   */
  date(name: string, options?: {
    required?: boolean;
    description?: string;
  }): SchemaBuilder {
    this.properties[name] = {
      type: SchemaDataType.DATE,
      validator: FieldValidators.date,
      format: 'date',
      ...options
    };
    return this;
  }

  /**
   * Adiciona uma propriedade birthDate ao schema (com validador automático)
   */
  birthDate(name: string, options?: {
    required?: boolean;
    description?: string;
  }): SchemaBuilder {
    this.properties[name] = {
      type: SchemaDataType.DATE,
      validator: FieldValidators.birthDate,
      format: 'date',
      description: options?.description || 'Data de nascimento',
      ...options
    };
    return this;
  }

  /**
   * Adiciona uma propriedade object ao schema
   */
  object(name: string, options?: {
    required?: boolean;
    description?: string;
  }): SchemaBuilder {
    this.properties[name] = {
      type: SchemaDataType.OBJECT,
      ...options
    };
    return this;
  }

  /**
   * Adiciona uma propriedade array ao schema
   */
  array(name: string, options?: {
    required?: boolean;
    description?: string;
  }): SchemaBuilder {
    this.properties[name] = {
      type: SchemaDataType.ARRAY,
      ...options
    };
    return this;
  }

  /**
   * Adiciona uma propriedade customizada ao schema
   */
  custom(name: string, property: SchemaProperty): SchemaBuilder {
    this.properties[name] = property;
    return this;
  }

  /**
   * Constrói o schema final
   */
  build(): ResponseSchema {
    return {
      properties: { ...this.properties }
    };
  }

  /**
   * Método estático para criar um novo builder
   */
  static create(): SchemaBuilder {
    return new SchemaBuilder();
  }
}

/**
 * Schemas pré-definidos comuns
 */
export const CommonSchemas = {
  /**
   * Schema básico de usuário
   */
  user: () => SchemaBuilder.create()
    .number('id', { required: true, description: 'ID único do usuário' })
    .string('name', { required: true, description: 'Nome completo' })
    .email('email', { required: true, description: 'Email do usuário' })
    .phone('phone', { description: 'Telefone de contato' })
    .birthDate('birthDate', { description: 'Data de nascimento' })
    .build(),

  /**
   * Schema básico de produto
   */
  product: () => SchemaBuilder.create()
    .number('id', { required: true, description: 'ID único do produto' })
    .string('name', { required: true, description: 'Nome do produto' })
    .string('description', { description: 'Descrição do produto' })
    .number('price', { required: true, minimum: 0, description: 'Preço do produto' })
    .string('category', { description: 'Categoria do produto' })
    .url('image', { description: 'URL da imagem do produto' })
    .build(),

  /**
   * Schema básico de endereço
   */
  address: () => SchemaBuilder.create()
    .string('street', { required: true, description: 'Logradouro' })
    .string('city', { required: true, description: 'Cidade' })
    .string('state', { required: true, description: 'Estado' })
    .string('zipCode', { required: true, description: 'CEP' })
    .string('country', { default: 'Brasil', description: 'País' })
    .build()
};