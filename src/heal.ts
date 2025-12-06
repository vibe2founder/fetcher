import { FetchEntityConfig, FetchEntityOutput, ErrorContext } from './types';

export interface HealResult {
  config?: FetchEntityConfig;
  shouldRetry: boolean;
  message?: string;
  output?: FetchEntityOutput;
}
export class AutoHealer {
  /**
   * Mapeamento semântico de campos comuns
   * Mapeia campos da resposta para campos esperados no schema
   */
  private static readonly SEMANTIC_FIELD_MAPPING: Record<string, string[]> = {
    // Nome
    'name': ['firstName', 'first_name', 'fullName', 'full_name', 'displayName', 'display_name', 'username', 'title'],
    'firstName': ['first_name', 'fname', 'givenName', 'given_name'],
    'lastName': ['last_name', 'lname', 'surname', 'familyName', 'family_name'],
    
    // Email
    'email': ['emailAddress', 'email_address', 'mail', 'e_mail'],
    
    // Telefone
    'phone': ['phoneNumber', 'phone_number', 'telephone', 'mobile', 'cellphone'],
    
    // Endereço
    'address': ['street', 'streetAddress', 'street_address', 'location'],
    'city': ['locality', 'town'],
    'state': ['province', 'region', 'stateCode', 'state_code'],
    'zipCode': ['zip', 'postalCode', 'postal_code', 'postcode'],
    'country': ['countryCode', 'country_code', 'nation'],
    
    // Identificadores
    'id': ['_id', 'uuid', 'identifier', 'key', 'pk'],
    'userId': ['user_id', 'uid', 'user_identifier'],
    
    // Datas
    'createdAt': ['created_at', 'dateCreated', 'date_created', 'timestamp', 'created'],
    'updatedAt': ['updated_at', 'dateUpdated', 'date_updated', 'modified', 'lastModified'],
    'birthDate': ['birth_date', 'dateOfBirth', 'date_of_birth', 'birthday', 'dob'],
    
    // Status
    'status': ['state', 'condition', 'isActive', 'is_active', 'enabled'],
    'active': ['isActive', 'is_active', 'enabled', 'status'],
    
    // Descrição
    'description': ['desc', 'summary', 'details', 'notes', 'comment'],
    
    // Preço/Valor
    'price': ['cost', 'amount', 'value', 'total'],
    'currency': ['currencyCode', 'currency_code'],
    
    // Imagem
    'image': ['imageUrl', 'image_url', 'picture', 'photo', 'avatar', 'thumbnail'],
    
    // Categoria
    'category': ['type', 'kind', 'group', 'classification'],
    
    // Quantidade
    'quantity': ['qty', 'amount', 'count', 'number'],
    
    // Peso/Tamanho
    'weight': ['mass', 'size'],
    'height': ['length', 'tall'],
    'width': ['breadth', 'wide']
  };

  /**
   * Tenta curar automaticamente erros comuns
   */
  static async heal(context: ErrorContext): Promise<HealResult> {
    const { error, config, response, output } = context;

    // NOVO: Healing para mapeamento semântico de campos
    if (error.message?.includes('Validação semântica falhou') && output?.data) {
      return this.healSemanticMapping(config, output);
    }

    // Healing para erro 401 (Unauthorized)
    if (response?.status === 401 || error.message?.includes('401')) {
      return await this.healUnauthorized(config);
    }

    // Healing para erro 403 (Forbidden)
    if (response?.status === 403 || error.message?.includes('403')) {
      return await this.healForbidden(config);
    }

    // Healing para erro 413 (Payload Too Large)
    if (response?.status === 413 || error.message?.includes('413')) {
      return this.healPayloadTooLarge(config);
    }

    // Healing para erro 422 (Unprocessable Entity)
    if (response?.status === 422 || error.message?.includes('422')) {
      return this.healValidationError(config, response);
    }

    // Healing para erro 429 (Too Many Requests)
    if (response?.status === 429 || error.message?.includes('429')) {
      return this.healRateLimit(config, response);
    }

    // Healing para timeout
    if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
      return this.healTimeout(config);
    }

    // Healing para erro de rede
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND') {
      return this.healNetworkError(config);
    }

    // Healing para Content-Type incorreto
    if (error.message?.includes('content-type') || error.message?.includes('Content-Type')) {
      return this.healContentType(config);
    }

    // Healing para dados malformados
    if (error.message?.includes('JSON') || error.message?.includes('parse')) {
      return this.healMalformedData(config);
    }

    return { shouldRetry: false, message: 'No healing strategy available' };
  }

  /**
   * Healing para mapeamento semântico de campos
   * Converte campos da resposta para os campos esperados no schema
   */
  private static healSemanticMapping(config: FetchEntityConfig, output: FetchEntityOutput): HealResult {
    const expectedFields = Object.keys(config.responseSchema.properties || {});
    const responseData = output.data as Record<string, any>;
    const mappedData: Record<string, any> = { ...responseData };
    let mappingsApplied = 0;

    for (const expectedField of expectedFields) {
      // Se o campo já existe, pular
      if (expectedField in responseData) continue;

      // 1. Tentativas especiais para campos de nome (prioridade alta)
      if (expectedField === 'name' && !mappedData.name) {
        // Tentar combinar firstName + lastName primeiro
        if (responseData.firstName || responseData.lastName) {
          const firstName = responseData.firstName || responseData.first_name || '';
          const lastName = responseData.lastName || responseData.last_name || '';
          mappedData.name = `${firstName} ${lastName}`.trim();
          mappingsApplied++;
          continue;
        }
      }

      // 2. Mapeamento por nome de campo (semântico)
      const possibleSources = this.SEMANTIC_FIELD_MAPPING[expectedField] || [];
      let fieldMapped = false;
      
      for (const sourceField of possibleSources) {
        if (sourceField in responseData) {
          mappedData[expectedField] = responseData[sourceField];
          mappingsApplied++;
          fieldMapped = true;
          break;
        }
      }

      // 3. NOVO: Mapeamento por validação de conteúdo (inteligente)
      if (!fieldMapped) {
        const contentMapping = this.findFieldByContent(expectedField, responseData, config);
        if (contentMapping) {
          mappedData[expectedField] = contentMapping.value;
          mappingsApplied++;
        }
      }
    }

    if (mappingsApplied > 0) {
      const healedOutput: FetchEntityOutput = {
        entity: output.entity,
        data: mappedData
      };

      return {
        shouldRetry: false,
        output: healedOutput,
        message: `Applied ${mappingsApplied} semantic field mappings`
      };
    }

    return {
      shouldRetry: false,
      message: 'No semantic mappings found'
    };
  }

  /**
   * Encontra um campo baseado na validação do conteúdo usando o schema
   * Faz um flatten do objeto e testa cada valor com o validador do schema
   */
  private static findFieldByContent(expectedField: string, data: Record<string, any>, config: FetchEntityConfig): { sourceField: string; value: any; type: string } | null {
    // Fazer flatten do objeto para pegar todos os valores
    const flattenedData = this.flattenObject(data);
    
    // Pegar o validador do schema para este campo
    const fieldSchema = config.responseSchema.properties[expectedField];
    if (!fieldSchema?.validator) return null;

    // Testar cada valor do objeto flattened com o validador do schema
    for (const [key, value] of Object.entries(flattenedData)) {
      if (fieldSchema.validator(value)) {
        return {
          sourceField: key,
          value: value,
          type: expectedField
        };
      }
    }

    return null;
  }

  /**
   * Faz flatten de um objeto aninhado
   */
  private static flattenObject(obj: any, prefix = ''): Record<string, any> {
    const flattened: Record<string, any> = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          // Recursivo para objetos aninhados
          Object.assign(flattened, this.flattenObject(value, newKey));
        } else {
          flattened[newKey] = value;
        }
      }
    }
    
    return flattened;
  }



  /**
   * Healing para erro 401 - Tentar renovar JWT
   */
  private static async healUnauthorized(config: FetchEntityConfig): Promise<HealResult> {
    if (config.jwtRefresher) {
      try {
        const newJwt = await config.jwtRefresher();
        const healedConfig = { 
          ...config, 
          jwt: newJwt
        };
        
        return {
          config: healedConfig,
          shouldRetry: true,
          message: 'JWT token refreshed'
        };
      } catch (refreshError) {
        return {
          shouldRetry: false,
          message: 'Failed to refresh JWT token'
        };
      }
    }

    return {
      shouldRetry: false,
      message: 'No JWT refresher available'
    };
  }

  /**
   * Healing para erro 403 - Tentar ajustar permissões
   */
  private static async healForbidden(config: FetchEntityConfig): Promise<HealResult> {
    // Para fetchEntity, não temos headers customizáveis, então ajustamos timeout
    const healedConfig = {
      ...config,
      timeout: (config.timeout || 8000) * 1.5
    };

    return {
      config: healedConfig,
      shouldRetry: true,
      message: 'Increased timeout for permissions'
    };
  }

  /**
   * Healing para payload muito grande
   */
  private static healPayloadTooLarge(config: FetchEntityConfig): Promise<HealResult> {
    // Para fetchEntity, não temos payload de saída, então ajustamos timeout
    const healedConfig = {
      ...config,
      timeout: (config.timeout || 8000) * 2
    };

    return Promise.resolve({
      config: healedConfig,
      shouldRetry: true,
      message: 'Increased timeout for large response'
    });
  }

  /**
   * Healing para erro de validação 422
   */
  private static healValidationError(config: FetchEntityConfig, _response: any): Promise<HealResult> {
    // Para fetchEntity, tentamos com timeout maior
    const healedConfig = {
      ...config,
      timeout: (config.timeout || 8000) * 1.5
    };

    return Promise.resolve({
      config: healedConfig,
      shouldRetry: true,
      message: 'Increased timeout for validation'
    });
  }

  /**
   * Healing para rate limiting
   */
  private static healRateLimit(config: FetchEntityConfig, response: any): Promise<HealResult> {
    // Extrair tempo de espera do header Retry-After
    const retryAfter = response?.headers?.['retry-after'] || response?.headers?.['Retry-After'];
    
    if (retryAfter) {
      const delay = parseInt(retryAfter) * 1000; // Converter para ms
      
      return Promise.resolve({
        config,
        shouldRetry: true,
        message: `Rate limited, will retry after ${delay}ms`
      });
    }

    return Promise.resolve({
      config,
      shouldRetry: true,
      message: 'Rate limited, will retry with exponential backoff'
    });
  }

  /**
   * Healing para timeout
   */
  private static healTimeout(config: FetchEntityConfig): Promise<HealResult> {
    const currentTimeout = config.timeout || 5000;
    const newTimeout = Math.min(currentTimeout * 2, 30000); // Dobrar timeout, máximo 30s

    const healedConfig = {
      ...config,
      timeout: newTimeout
    };

    return Promise.resolve({
      config: healedConfig,
      shouldRetry: true,
      message: `Increased timeout to ${newTimeout}ms`
    });
  }

  /**
   * Healing para erro de rede
   */
  private static healNetworkError(config: FetchEntityConfig): Promise<HealResult> {
    // Tentar com timeout maior
    const healedConfig = {
      ...config,
      timeout: (config.timeout || 5000) * 2
    };

    return Promise.resolve({
      config: healedConfig,
      shouldRetry: true,
      message: 'Increased timeout for network issues'
    });
  }

  /**
   * Healing para Content-Type incorreto
   */
  private static healContentType(config: FetchEntityConfig): Promise<HealResult> {
    // Para fetchEntity, ajustamos timeout
    const healedConfig = {
      ...config,
      timeout: (config.timeout || 8000) * 1.5
    };

    return Promise.resolve({
      config: healedConfig,
      shouldRetry: true,
      message: 'Increased timeout for content type issues'
    });
  }

  /**
   * Healing para dados malformados
   */
  private static healMalformedData(config: FetchEntityConfig): Promise<HealResult> {
    // Para fetchEntity, ajustamos timeout
    const healedConfig = {
      ...config,
      timeout: (config.timeout || 8000) * 2
    };

    return Promise.resolve({
      config: healedConfig,
      shouldRetry: true,
      message: 'Increased timeout for malformed data'
    });
  }

}
