import { DietPlan, DietType, Meal, FoodItem, Macros } from '@/types';
import { FOODS, FoodDB, FoodCategory, MealTime } from '@/data/foods';

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ACTIVITY_FACTORS: Record<string, number> = {
  sedentario: 1.2,
  ligero: 1.375,
  moderado: 1.55,
  activo: 1.725,
  muy_activo: 1.9,
};

const CALORIE_ADJUSTMENTS: Record<DietType, number> = {
  volumen: 400,
  definicion: -500,
  mantenimiento: 0,
  vegetariana: 0,
};

const MACRO_RATIOS: Record<DietType, { protein: number; carbs: number; fat: number }> = {
  volumen: { protein: 0.30, carbs: 0.50, fat: 0.20 },
  definicion: { protein: 0.40, carbs: 0.35, fat: 0.25 },
  mantenimiento: { protein: 0.30, carbs: 0.45, fat: 0.25 },
  vegetariana: { protein: 0.25, carbs: 0.50, fat: 0.25 },
};

const PLAN_NAMES: Record<DietType, string> = {
  volumen: 'Plan Volumen — Superávit calórico',
  definicion: 'Plan Definición — Déficit calórico',
  mantenimiento: 'Plan Mantenimiento — Equilibrio energético',
  vegetariana: 'Plan Vegetariano — Base vegetal',
};

const MEAL_DISTRIBUTION = [
  { name: 'Desayuno', time: '08:00', ratio: 0.25 },
  { name: 'Media mañana', time: '11:00', ratio: 0.10 },
  { name: 'Almuerzo', time: '14:00', ratio: 0.35 },
  { name: 'Merienda', time: '17:30', ratio: 0.10 },
  { name: 'Cena', time: '20:30', ratio: 0.20 },
];

function calcBMR(weight: number, height: number, age: number, gender: 'hombre' | 'mujer'): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'hombre' ? base + 5 : base - 161;
}

function getFoodPool(
  dietType: DietType,
  mealTime: MealTime,
  categories: FoodCategory[]
): FoodDB[] {
  const isVeg = dietType === 'vegetariana';
  return shuffle(
    FOODS.filter(
      (f) =>
        categories.includes(f.category) &&
        f.meals.includes(mealTime) &&
        (!isVeg || f.vegetariano)
    )
  );
}

function pickFood(pool: FoodDB[], targetCals: number): FoodItem | null {
  for (const food of pool) {
    if (food.caloriasPor100g <= 0) continue;
    const grams = Math.round((targetCals / food.caloriasPor100g) * 100);
    const clampedGrams = Math.max(15, Math.min(grams, food.porcionTipica * 1.5));
    const actualCals = Math.round((food.caloriasPor100g * clampedGrams) / 100);
    const protein = Math.round((food.proteinaPor100g * clampedGrams) / 100 * 10) / 10;
    return {
      name: food.name,
      amount: `${clampedGrams}g`,
      calories: actualCals,
      protein,
    };
  }
  return null;
}

function buildMeal(
  mealLabel: { name: string; time: string; ratio: number },
  totalCals: number,
  dietType: DietType
): Meal {
  const mealCals = Math.round(totalCals * mealLabel.ratio);
  const isVeg = dietType === 'vegetariana';
  const mealTime = mealLabel.name.toLowerCase().includes('desayuno')
    ? 'desayuno'
    : mealLabel.name.toLowerCase().includes('mañana') || mealLabel.name.toLowerCase().includes('merienda')
    ? 'snack'
    : mealLabel.name.toLowerCase().includes('almuerzo')
    ? 'almuerzo'
    : 'cena';

  const foods: FoodItem[] = [];
  let remaining = mealCals;

  if (mealTime === 'desayuno') {
    // Proteína 30% + Carb 50% + Fruta 20%
    const protPool = getFoodPool(dietType, 'desayuno', isVeg ? ['lacteo', 'legumbre'] : ['proteina', 'lacteo']);
    const carbPool = getFoodPool(dietType, 'desayuno', ['carbohidrato']);
    const fruitPool = getFoodPool(dietType, 'desayuno', ['fruta']);

    const protItem = pickFood(protPool, mealCals * 0.30);
    const carbItem = pickFood(carbPool, mealCals * 0.50);
    const fruitItem = pickFood(fruitPool, mealCals * 0.20);

    if (protItem) foods.push(protItem);
    if (carbItem) foods.push(carbItem);
    if (fruitItem) foods.push(fruitItem);

  } else if (mealTime === 'snack') {
    // Proteína 60% + Fruta/Carb 40%
    const protPool = getFoodPool(dietType, 'snack', isVeg ? ['lacteo', 'legumbre'] : ['proteina', 'lacteo']);
    const carbPool = getFoodPool(dietType, 'snack', ['fruta', 'carbohidrato']);

    const protItem = pickFood(protPool, mealCals * 0.60);
    const carbItem = pickFood(carbPool, mealCals * 0.40);

    if (protItem) foods.push(protItem);
    if (carbItem) foods.push(carbItem);

  } else if (mealTime === 'almuerzo') {
    // Proteína 40% + Carb 35% + Verdura 15% + Grasa 10%
    const protPool = getFoodPool(
      dietType,
      'almuerzo',
      isVeg ? ['legumbre'] : ['proteina']
    );
    const carbPool = getFoodPool(dietType, 'almuerzo', ['carbohidrato']);
    const vegPool = getFoodPool(dietType, 'almuerzo', ['verdura']);
    const fatPool = getFoodPool(dietType, 'almuerzo', ['grasa']);

    const protItem = pickFood(protPool, mealCals * 0.40);
    const carbItem = pickFood(carbPool, mealCals * 0.35);
    const vegItem = pickFood(vegPool, mealCals * 0.15);
    const fatItem = pickFood(fatPool, mealCals * 0.10);

    if (protItem) foods.push(protItem);
    if (carbItem) foods.push(carbItem);
    if (vegItem) foods.push(vegItem);
    if (fatItem) foods.push(fatItem);

  } else {
    // Cena: Proteína 50% + Verdura 30% + Grasa 20%
    const protPool = getFoodPool(
      dietType,
      'cena',
      isVeg ? ['legumbre'] : ['proteina']
    );
    const vegPool = getFoodPool(dietType, 'cena', ['verdura']);
    const fatPool = getFoodPool(dietType, 'cena', ['grasa']);

    const protItem = pickFood(protPool, mealCals * 0.50);
    const vegItem = pickFood(vegPool, mealCals * 0.30);
    const fatItem = pickFood(fatPool, mealCals * 0.20);

    if (protItem) foods.push(protItem);
    if (vegItem) foods.push(vegItem);
    if (fatItem) foods.push(fatItem);
  }

  const actualCals = foods.reduce((s, f) => s + f.calories, 0);

  return {
    name: mealLabel.name,
    time: mealLabel.time,
    foods,
    calories: actualCals,
  };
}

export function generateDietPlan(
  dietType: DietType,
  weight: number,
  height: number,
  age: number,
  activityLevel: string = 'moderado',
  gender: 'hombre' | 'mujer' = 'hombre'
): DietPlan {
  const bmr = calcBMR(weight, height, age, gender);
  const tdee = bmr * (ACTIVITY_FACTORS[activityLevel] ?? 1.55);
  const targetCals = Math.round(tdee + CALORIE_ADJUSTMENTS[dietType]);

  const ratios = MACRO_RATIOS[dietType];
  const macros: Macros = {
    protein: Math.round((targetCals * ratios.protein) / 4),
    carbs: Math.round((targetCals * ratios.carbs) / 4),
    fat: Math.round((targetCals * ratios.fat) / 9),
  };

  const meals: Meal[] = MEAL_DISTRIBUTION.map((ml) =>
    buildMeal(ml, targetCals, dietType)
  );

  return {
    id: generateId(),
    name: PLAN_NAMES[dietType],
    type: dietType,
    calories: targetCals,
    macros,
    meals,
    createdAt: new Date(),
  };
}
