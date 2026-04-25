import { Brand } from "../types";

export const GLOBAL_BRANDS: Brand[] = [
  // dejamos una con logo de ejemplo y el resto sin logo para probar ambos casos
  {
    id: "nestle",
    name: "nestle",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Nestl%C3%A9_logo.svg/200px-Nestl%C3%A9_logo.svg.png",
  },
  { id: "coca-cola", name: "coca-cola" },
  { id: "pepsi", name: "pepsi" },
  { id: "danone", name: "danone" },
  { id: "kelloggs", name: "kelloggs" },
  { id: "unilever", name: "unilever" },
  { id: "mondelez", name: "mondelez" },
  { id: "mars", name: "mars" },
  { id: "ferrero", name: "ferrero" },
  { id: "lactalis", name: "lactalis" },
];
