import { Brand } from "../types";

// Data simulada (Mocking Data)
export const GLOBAL_BRANDS: Brand[] = [
  {
    id: "nestle",
    name: "nestle",
    // Almacenamiento estático local (offline-first ready) para la entrega parcial
    logo: require("../../assets/images/brands/nestle.png"),
  },
  {
    id: "coca-cola",
    name: "coca-cola",
    logo: require("../../assets/images/brands/coca-cola.png"),
  },
  {
    id: "pepsi",
    name: "pepsi",
    logo: require("../../assets/images/brands/pepsi.png"),
  },
  {
    id: "danone",
    name: "danone",
    logo: require("../../assets/images/brands/danone.png"),
  },
  {
    id: "kelloggs",
    name: "kelloggs",
    logo: require("../../assets/images/brands/kelloggs.png"),
  },
  {
    id: "unilever",
    name: "unilever",
    logo: require("../../assets/images/brands/unilever.png"),
  },
  {
    id: "mondelez",
    name: "mondelez",
    logo: require("../../assets/images/brands/mondelez.png"),
  },
  {
    id: "mars",
    name: "mars",
    logo: require("../../assets/images/brands/mars.png"),
  },
  {
    id: "ferrero",
    name: "ferrero",
    logo: require("../../assets/images/brands/ferrero.png"),
  },
  {
    id: "lactalis",
    name: "lactalis",
    logo: require("../../assets/images/brands/lactalis.png"),
  },
];
