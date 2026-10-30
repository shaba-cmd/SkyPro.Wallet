import type { CategoryId } from "../types";

export interface Category {
  id: CategoryId;
  label: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: "food", label: "Еда", color: "#D9B6FF" },
  { id: "transport", label: "Транспорт", color: "#FFB53D" },
  { id: "housing", label: "Жилье", color: "#6EE4FE" },
  { id: "joy", label: "Развлечения", color: "#B0AEFF" },
  { id: "education", label: "Образование", color: "#BCEC30" },
  { id: "others", label: "Другое", color: "#FFB9B8" },
];

export const CATEGORY_BY_ID = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category]),
) as Record<CategoryId, Category>;
