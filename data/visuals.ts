import { MuscleGroup } from '@/types';
import { FoodCategory } from '@/data/foods';

// ═══════════════════════════════════════════
// GRUPOS MUSCULARES
// ═══════════════════════════════════════════
export interface MuscleVisual {
  emoji: string;
  color: string;       // Color principal
  bgLight: string;     // Color de fondo (20% opacidad)
  label: string;
}

export const MUSCLE_VISUALS: Record<MuscleGroup, MuscleVisual> = {
  pecho: {
    emoji: '💪',
    color: '#E05C5C',
    bgLight: '#E05C5C33',
    label: 'Pecho',
  },
  espalda: {
    emoji: '🔙',
    color: '#4A90D9',
    bgLight: '#4A90D933',
    label: 'Espalda',
  },
  piernas: {
    emoji: '🦵',
    color: '#E09A3A',
    bgLight: '#E09A3A33',
    label: 'Piernas',
  },
  hombros: {
    emoji: '🏋️',
    color: '#9B59B6',
    bgLight: '#9B59B633',
    label: 'Hombros',
  },
  brazos: {
    emoji: '💥',
    color: '#1DB97A',
    bgLight: '#1DB97A33',
    label: 'Brazos',
  },
  core: {
    emoji: '🔥',
    color: '#FF7043',
    bgLight: '#FF704333',
    label: 'Core',
  },
  cardio: {
    emoji: '🏃',
    color: '#2980B9',
    bgLight: '#2980B933',
    label: 'Cardio',
  },
};

// ═══════════════════════════════════════════
// CATEGORÍAS DE ALIMENTOS
// ═══════════════════════════════════════════
export interface CategoryVisual {
  emoji: string;
  color: string;
  bgLight: string;
  label: string;
}

export const CATEGORY_VISUALS: Record<FoodCategory, CategoryVisual> = {
  proteina: {
    emoji: '🥩',
    color: '#E05C5C',
    bgLight: '#E05C5C33',
    label: 'Proteína',
  },
  carbohidrato: {
    emoji: '🌾',
    color: '#E09A3A',
    bgLight: '#E09A3A33',
    label: 'Carbohidrato',
  },
  verdura: {
    emoji: '🥦',
    color: '#1DB97A',
    bgLight: '#1DB97A33',
    label: 'Verdura',
  },
  fruta: {
    emoji: '🍓',
    color: '#FF6B9D',
    bgLight: '#FF6B9D33',
    label: 'Fruta',
  },
  lacteo: {
    emoji: '🥛',
    color: '#4A90D9',
    bgLight: '#4A90D933',
    label: 'Lácteo',
  },
  legumbre: {
    emoji: '🫘',
    color: '#639922',
    bgLight: '#63992233',
    label: 'Legumbre',
  },
  grasa: {
    emoji: '🥑',
    color: '#9B59B6',
    bgLight: '#9B59B633',
    label: 'Grasa saludable',
  },
};

// ═══════════════════════════════════════════
// EMOJIS POR ALIMENTO
// ═══════════════════════════════════════════
export const FOOD_EMOJIS: Record<string, string> = {
  // Proteínas animales
  prot_01: '🍗', // Pechuga de pollo
  prot_02: '🦃', // Pechuga de pavo
  prot_03: '🥩', // Ternera magra
  prot_04: '🐟', // Salmón
  prot_05: '🐟', // Atún al natural
  prot_06: '🐠', // Merluza
  prot_07: '🥚', // Huevo entero
  prot_08: '🥚', // Clara de huevo
  prot_09: '💊', // Proteína whey
  prot_10: '🐡', // Bacalao
  prot_11: '🐟', // Sardinas
  prot_12: '🦐', // Gambas
  prot_13: '🥩', // Lomo de cerdo
  prot_14: '🥓', // Jamón serrano
  prot_15: '🥩', // Ternera picada

  // Carbohidratos
  carb_01: '🍚', // Arroz blanco
  carb_02: '🍚', // Arroz integral
  carb_03: '🌾', // Avena
  carb_04: '🍞', // Pan integral
  carb_05: '🍝', // Pasta
  carb_06: '🍠', // Batata
  carb_07: '🥔', // Patata
  carb_08: '🌾', // Quinoa
  carb_09: '🫓', // Tortitas de arroz
  carb_10: '🌾', // Cuscús
  carb_11: '🌾', // Trigo sarraceno
  carb_12: '🌽', // Maíz
  carb_13: '🍞', // Pan de centeno
  carb_14: '🥣', // Corn flakes
  carb_15: '🍝', // Pasta integral

  // Verduras
  verd_01: '🥦', // Brócoli
  verd_02: '🌿', // Espinacas
  verd_03: '🥬', // Lechuga
  verd_04: '🍅', // Tomate
  verd_05: '🥒', // Pepino
  verd_06: '🥕', // Zanahoria
  verd_07: '🫑', // Pimiento rojo
  verd_08: '🥒', // Calabacín
  verd_09: '🥦', // Coliflor
  verd_10: '🥬', // Kale
  verd_11: '🌱', // Espárragos
  verd_12: '🫘', // Judías verdes
  verd_13: '🍄', // Champiñones
  verd_14: '🍆', // Berenjena
  verd_15: '🟣', // Remolacha

  // Frutas
  frut_01: '🍌', // Plátano
  frut_02: '🍎', // Manzana
  frut_03: '🍊', // Naranja
  frut_04: '🍓', // Fresas
  frut_05: '🫐', // Arándanos
  frut_06: '🥝', // Kiwi
  frut_07: '🥭', // Mango
  frut_08: '🍑', // Melocotón
  frut_09: '🍐', // Pera
  frut_10: '🍉', // Sandía

  // Lácteos
  lact_01: '🥛', // Yogur griego
  lact_02: '🧀', // Queso cottage
  lact_03: '🧀', // Queso fresco
  lact_04: '🥛', // Leche desnatada
  lact_05: '🧀', // Requesón
  lact_06: '🥛', // Kéfir
  lact_07: '🥛', // Leche entera
  lact_08: '🍦', // Yogur natural
  lact_09: '🧀', // Mozzarella
  lact_10: '🧀', // Queso cheddar

  // Legumbres
  legu_01: '🫘', // Lentejas
  legu_02: '🫘', // Garbanzos
  legu_03: '🫘', // Alubias negras
  legu_04: '🌱', // Edamame
  legu_05: '⬜', // Tofu
  legu_06: '🌿', // Tempeh
  legu_07: '🟢', // Guisantes
  legu_08: '🫘', // Alubias blancas
  legu_09: '🫙', // Hummus
  legu_10: '🫘', // Judías rojas
  legu_11: '💚', // Proteína vegetal

  // Grasas saludables
  gras_01: '🥑', // Aguacate
  gras_02: '🌰', // Almendras
  gras_03: '🌰', // Nueces
  gras_04: '🌰', // Anacardos
  gras_05: '🫙', // Aceite de oliva
  gras_06: '🥜', // Mantequilla cacahuete
  gras_07: '🌱', // Semillas de chía
  gras_08: '🌱', // Semillas de calabaza
  gras_09: '🫒', // Aceitunas
  gras_10: '🌱', // Semillas de lino
};

// ═══════════════════════════════════════════
// EMOJIS POR EJERCICIO
// ═══════════════════════════════════════════
export const EXERCISE_EMOJIS: Record<string, string> = {
  // Pecho
  pecho_01: '🏋️', pecho_02: '📐', pecho_03: '🏋️', pecho_04: '💪',
  pecho_05: '⬇️', pecho_06: '📉', pecho_07: '🖥️', pecho_08: '⬆️',
  pecho_09: '📲', pecho_10: '🦅', pecho_11: '🦅', pecho_12: '🔗',
  pecho_13: '🦋', pecho_14: '🌀', pecho_15: '✊',

  // Espalda
  espalda_01: '⚓', espalda_02: '🧗', espalda_03: '📏',
  espalda_04: '🧗', espalda_05: '⬇️', espalda_06: '💪',
  espalda_07: '🎯', espalda_08: '⬇️', espalda_09: '🔗',
  espalda_10: '🔗', espalda_11: '🖥️', espalda_12: '🔄',
  espalda_13: '⬆️', espalda_14: '🎯', espalda_15: '⬇️',

  // Piernas
  piernas_01: '🦵', piernas_02: '🖥️', piernas_03: '🦵',
  piernas_04: '⚖️', piernas_05: '🏔️', piernas_06: '🍑',
  piernas_07: '🚶', piernas_08: '🪜', piernas_09: '🦵',
  piernas_10: '🖥️', piernas_11: '🦵', piernas_12: '🦵',
  piernas_13: '⬆️', piernas_14: '🪑', piernas_15: '↔️',

  // Hombros
  hombros_01: '🏋️', hombros_02: '🔄', hombros_03: '💪',
  hombros_04: '🖥️', hombros_05: '🪑', hombros_06: '⬆️',
  hombros_07: '↔️', hombros_08: '🔗', hombros_09: '⬆️',
  hombros_10: '🔗', hombros_11: '🦅', hombros_12: '🎯',
  hombros_13: '🖥️', hombros_14: '⬆️', hombros_15: '🔄',

  // Brazos
  brazos_01: '💪', brazos_02: '💪', brazos_03: '🔨',
  brazos_04: '📖', brazos_05: '🔗', brazos_06: '🔍',
  brazos_07: '📐', brazos_08: '2️⃣', brazos_09: '✊',
  brazos_10: '⬇️', brazos_11: '💀', brazos_12: '⬇️',
  brazos_13: '⬆️', brazos_14: '🦅', brazos_15: '💪',

  // Core
  core_01: '⬜', core_02: '↔️', core_03: '⬆️',
  core_04: '🚲', core_05: '🦵', core_06: '🧗',
  core_07: '⚙️', core_08: '🌀', core_09: '🏃',
  core_10: '🔗', core_11: '🌊', core_12: '🐛',
  core_13: '🔗', core_14: '↔️', core_15: '🐉',

  // Cardio
  cardio_01: '🏃', cardio_02: '⚡', cardio_03: '🚴',
  cardio_04: '⚡', cardio_05: '🚣', cardio_06: '🪢',
  cardio_07: '🪢', cardio_08: '⚙️', cardio_09: '🪜',
  cardio_10: '⚡', cardio_11: '📦', cardio_12: '💥',
  cardio_13: '⭐', cardio_14: '⚡', cardio_15: '🐻',
};

// Helper: get food emoji with fallback to category emoji
export function getFoodEmoji(foodId: string, category: FoodCategory): string {
  return FOOD_EMOJIS[foodId] ?? CATEGORY_VISUALS[category]?.emoji ?? '🍽️';
}

// Helper: get exercise emoji with fallback to muscle emoji
export function getExerciseEmoji(exerciseId: string, muscle: MuscleGroup): string {
  return EXERCISE_EMOJIS[exerciseId] ?? MUSCLE_VISUALS[muscle]?.emoji ?? '💪';
}
