export interface Brand {
  id: string;
  name: string;
  logoUrl?: string; // Lo hacemos opcional con "?" por si alguna marca no tiene logo
}
