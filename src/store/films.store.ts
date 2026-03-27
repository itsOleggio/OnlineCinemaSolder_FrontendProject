import { create } from "zustand";
import { persist } from "zustand/middleware";

type FilmColorStore = {
  colors: Record<number, string>;
  initColor: (id: number) => void;
};

const getRandomColor = () => {
  const colors = ["#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const useFilmColorStore = create<FilmColorStore>()(
  persist(
    (set, get) => ({
      colors: {},

      initColor: (id) => {
        const existing = get().colors[id];
        if (existing) return;

        set((state) => ({
          colors: {
            ...state.colors,
            [id]: getRandomColor(),
          },
        }));
      },
    }),
    {
      name: "film-colors",
    },
  ),
);
