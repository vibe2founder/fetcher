/**
 * Validadores de conteúdo para campos específicos
 * Podem ser usados nos schemas para validação inteligente
 */
export class FieldValidators {
  
  static email(value: any): boolean {
    if (typeof value !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  static phone(value: any): boolean {
    if (typeof value !== 'string') return false;
    // Remove espaços, parênteses, hífens e pontos
    const cleaned = value.replace(/[\s\(\)\-\.]/g, '');
    // Verifica se tem entre 8 e 15 dígitos (padrões internacionais)
    return /^[\+]?[0-9]{8,15}$/.test(cleaned);
  }

  static zipCode(value: any): boolean {
    if (typeof value !== 'string') return false;
    // Padrões mais específicos: 12345, 12345-6789, A1B 2C3, etc.
    // Deve ter pelo menos um número ou seguir padrões conhecidos
    return /^[A-Z0-9]{3,10}[\s\-]?[A-Z0-9]{0,4}$/i.test(value) && 
           (/\d/.test(value) || /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(value));
  }

  static url(value: any): boolean {
    if (typeof value !== 'string') return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  static date(value: any): boolean {
    if (!value) return false;
    
    // Rejeitar números simples (como IDs)
    if (typeof value === 'number' && value < 1000000000) return false; // Timestamp deve ser maior
    
    // Aceitar apenas strings que parecem datas ou timestamps grandes
    if (typeof value === 'string') {
      // Deve ter pelo menos 4 caracteres e conter separadores de data
      if (value.length < 4 || !/[\-\/\s:]/.test(value)) return false;
    }
    
    const date = new Date(value);
    return !isNaN(date.getTime()) && date.getFullYear() > 1900 && date.getFullYear() < 2100;
  }

  static currency(value: any): boolean {
    if (typeof value !== 'string') return false;
    // Códigos de moeda ISO 4217 (3 letras)
    return /^[A-Z]{3}$/.test(value);
  }

  static country(value: any): boolean {
    if (typeof value !== 'string') return false;
    // Lista básica de países comuns
    const countries = ['Brazil', 'United States', 'Canada', 'Mexico', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Uruguay', 'Paraguay', 'Bolivia', 'Ecuador', 'Guyana', 'Suriname', 'French Guiana'];
    return countries.some(country => 
      country.toLowerCase().includes(value.toLowerCase()) || 
      value.toLowerCase().includes(country.toLowerCase())
    );
  }

  static state(value: any): boolean {
    if (typeof value !== 'string') return false;
    // Códigos de estado (2-3 caracteres) ou nomes
    return /^[A-Z]{2,3}$/.test(value) || (value.length > 3 && value.length < 20);
  }

  static city(value: any): boolean {
    if (typeof value !== 'string') return false;
    // Nome de cidade (entre 2 e 50 caracteres, sem números no início)
    return /^[A-Za-z\s\-\.]{2,50}$/.test(value) && value.trim().length > 1;
  }

  // Validadores compostos
  static birthDate(value: any): boolean {
    if (!FieldValidators.date(value)) return false;
    const date = new Date(value);
    const now = new Date();
    
    // Deve ser uma data no passado (com margem de 1 dia para timezone)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date >= tomorrow) return false;
    
    const age = now.getFullYear() - date.getFullYear();
    // Deve ser uma data de nascimento realista (entre 0 e 150 anos)
    return age >= 0 && age <= 150;
  }

  static createdAt(value: any): boolean {
    if (!FieldValidators.date(value)) return false;
    const date = new Date(value);
    const now = new Date();
    // Deve ser uma data no passado ou presente
    return date <= now;
  }

  static updatedAt(value: any): boolean {
    return FieldValidators.createdAt(value); // Mesma lógica
  }
}