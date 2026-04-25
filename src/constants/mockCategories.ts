import { Category } from "../types";

// Este archivo es donde definimos un arreglo con datos simulados (mock) para usar en nuestra aplicación.
// Se usa mucho esto de 'mock data' para tener una fuente de datos mientras desarrollamos, sin depender de una API que aún no conectamos.

// Creamos el arreglo simulando la respuesta de la API
export const MOCK_CATEGORIES: Category[] = [
  {
    id: "beverages",
    title: "beverages",
    icon: "glass-cocktail",
    colors: ["#4DA0E6", "#2E86C1"],
  },
  {
    id: "dairies",
    title: "dairies",
    icon: "egg",
    colors: ["#F9E79F", "#F4D03F"],
  },
  {
    id: "snacks",
    title: "snacks",
    icon: "candycane",
    colors: ["#F1948A", "#E74C3C"],
  },
  {
    id: "breakfasts",
    title: "breakfasts",
    icon: "bread-slice",
    colors: ["#F8C471", "#F39C12"],
  },
  {
    id: "desserts",
    title: "desserts",
    icon: "cupcake",
    colors: ["#BB8FCE", "#8E44AD"],
  },
  {
    id: "chocolates",
    title: "chocolates",
    icon: "candy",
    colors: ["#5D6D7E", "#34495E"],
  },
  {
    id: "biscuits-and-cakes",
    title: "biscuits-and-cakes",
    icon: "cookie",
    colors: ["#CA6F1E", "#A04000"],
  },
  {
    id: "cereals-and-potatoes",
    title: "cereals-and-potatoes",
    icon: "grain",
    colors: ["#32cf98", "#0f9689"],
  },
  {
    id: "meals",
    title: "meals",
    icon: "silverware-fork-knife",
    colors: ["#E59866", "#D35400"],
  },
  {
    id: "plant-based-foods",
    title: "plant-based-foods",
    icon: "leaf",
    colors: ["#58D68D", "#27AE60"],
  },
];
