export type PhoneType = 'Celular' | 'Residencial' | 'Comercial';

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  phoneType: PhoneType;
}

export type UserPayload = Omit<User, 'id'>;
