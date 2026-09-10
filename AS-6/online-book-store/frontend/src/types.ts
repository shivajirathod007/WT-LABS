export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  price: number;
  coverUrl: string;
  featured?: boolean;
}

export interface LoginFormState {
  email: string;
  password: string;
}

export interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}
