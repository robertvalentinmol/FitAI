import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { DietType, DietPlan, Meal, FoodItem } from '@/types';
import { generateDietPlan } from '@/services/nutritionService';
import { saveDietPlan, getProfile } from '@/services/storage';
import { FOODS } from '@/data/foods';
import { FOOD_EMOJIS, CATEGORY_VISUALS, getFoodEmoji } from '@/data/visuals';

const DIET_TYPES: Array<{ id: DietType; label: string; emoji: string; desc: string; color: string }> = [
  { id: 'volumen', label: 'Volumen', emoji: '🥩', desc: 'Superávit calórico', color: '#E09A3A' },
  { id: 'definicion', label: 'Definición', emoji: '🥗', desc: 'Déficit calórico', color: Colors.primary },
  { id: 'mantenimiento', label: 'Mantenimiento', emoji: '⚖️', desc: 'Equilibrio energético', color: Colors.info },
  { id: 'vegetariana', label: 'Vegetariana', emoji: '🌱', desc: 'Sin carne / vegana', color: '#639922' },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentario', label: 'Sedentario', desc: 'Poco o nada de ejercicio' },
  { id: 'ligero', label: 'Ligero', desc: '1-3 días/semana' },
  { id: 'moderado', label: 'Moderado', desc: '3-5 días/semana' },
  { id: 'activo', label: 'Activo', desc: '6-7 días/semana' },
  { id: 'muy_activo', label: 'Muy activo', desc: 'Entrena 2x/día' },
];

// Busca el emoji de un alimento por su nombre en la DB
function getFoodEmojiByName(name: string): string {
  const food = FOODS.find((f) => f.name === name);
  if (food) return getFoodEmoji(food.id, food.category);
  return '🍽️';
}

// Busca el color de un alimento por su nombre
function getFoodColorByName(name: string): string {
  const food = FOODS.find((f) => f.name === name);
  if (food) return CATEGORY_VISUALS[food.category]?.color ?? Colors.primary;
  return Colors.primary;
}

// Intenta cargar imagen local del alimento
function getLocalFoodImage(name: string): number | null {
  const food = FOODS.find((f) => f.name === name);
  if (!food) return null;
  const imageMap: Record<string, number> = {
    // Añade aquí imágenes cuando las tengas:
    // prot_01: require('@/assets/images/foods/prot_01.jpg'),
  };
  return imageMap[food.id] ?? null;
}

const MEAL_EMOJIS: Record<string, string> = {
  Desayuno: '🌅',
  'Media mañana': '🍎',
  Almuerzo: '🍽️',
  Merienda: '☕',
  Cena: '🌙',
};

function MacroBar({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <View style={styles.macroCard}>
      <View style={[styles.macroIcon, { backgroundColor: color + '22' }]}>
        <View style={[styles.macroDot, { backgroundColor: color }]} />
      </View>
      <Text style={styles.macroValue}>{value}{unit}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

function FoodRow({ food, index }: { food: FoodItem; index: number }) {
  const emoji = getFoodEmojiByName(food.name);
  const color = getFoodColorByName(food.name);
  const localImg = getLocalFoodImage(food.name);

  return (
    <View style={styles.foodRow}>
      {/* Imagen o emoji del alimento */}
      <View style={[styles.foodImgBox, { backgroundColor: color + '22' }]}>
        {localImg ? (
          <Image source={localImg} style={styles.foodImg} resizeMode="cover" />
        ) : (
          <Text style={styles.foodEmoji}>{emoji}</Text>
        )}
      </View>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{food.name}</Text>
        <View style={styles.foodMetaRow}>
          <View style={[styles.foodAmountBadge, { backgroundColor: color + '22' }]}>
            <Text style={[styles.foodAmountText, { color }]}>{food.amount}</Text>
          </View>
          <Text style={styles.foodCals}>{food.calories} kcal</Text>
          {food.protein ? (
            <Text style={styles.foodProt}>{food.protein}g prot</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function MealCard({ meal }: { meal: Meal }) {
  const mealEmoji = MEAL_EMOJIS[meal.name] ?? '🍽️';
  return (
    <View style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <View style={styles.mealTitleRow}>
          <Text style={styles.mealEmoji}>{mealEmoji}</Text>
          <View>
            <Text style={styles.mealName}>{meal.name}</Text>
            <Text style={styles.mealTime}>{meal.time}</Text>
          </View>
        </View>
        <View style={styles.mealCalBadge}>
          <Text style={styles.mealCalText}>{meal.calories} kcal</Text>
        </View>
      </View>
      <View style={styles.mealFoods}>
        {meal.foods.map((food, i) => (
          <FoodRow key={i} food={food} index={i} />
        ))}
      </View>
    </View>
  );
}

export default function DietScreen() {
  const [selectedDiet, setSelectedDiet] = useState<DietType>('definicion');
  const [weight, setWeight] = useState('75');
  const [height, setHeight] = useState('175');
  const [age, setAge] = useState('30');
  const [gender, setGender] = useState<'hombre' | 'mujer'>('hombre');
  const [activityLevel, setActivityLevel] = useState('moderado');
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProfile().then((profile) => {
      if (!profile) return;
      if (profile.weight) setWeight(String(profile.weight));
      if (profile.height) setHeight(String(profile.height));
      if (profile.age) setAge(String(profile.age));
      if (profile.activityLevel) setActivityLevel(profile.activityLevel);
    });
  }, []);

  function handleGenerate() {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age, 10);
    if (!w || !h || !a || w < 30 || h < 100 || a < 10) {
      Alert.alert('Datos incompletos', 'Introduce peso (kg), altura (cm) y edad válidos.');
      return;
    }
    setGenerating(true);
    setSaved(false);
    setTimeout(() => {
      const p = generateDietPlan(selectedDiet, w, h, a, activityLevel, gender);
      setPlan(p);
      setGenerating(false);
    }, 300);
  }

  async function handleSave() {
    if (!plan) return;
    try {
      await saveDietPlan(plan);
      setSaved(true);
      Alert.alert('Guardado', 'Plan nutricional guardado correctamente.');
    } catch {
      Alert.alert('Error', 'No se pudo guardar el plan.');
    }
  }

  function handleReset() {
    setPlan(null);
    setSaved(false);
  }

  if (plan) {
    const dietInfo = DIET_TYPES.find((d) => d.id === plan.type)!;
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.resultContent} showsVerticalScrollIndicator={false}>
          {/* Encabezado */}
          <View style={[styles.planHeader, { borderLeftColor: dietInfo.color }]}>
            <Text style={styles.planEmoji}>{dietInfo.emoji}</Text>
            <View style={styles.planHeaderText}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={[styles.planCals, { color: dietInfo.color }]}>
                {plan.calories} kcal / día
              </Text>
            </View>
          </View>

          {/* Macros */}
          <View style={styles.macrosRow}>
            <MacroBar label="Proteínas" value={plan.macros.protein} unit="g" color={Colors.primary} />
            <MacroBar label="Carbos" value={plan.macros.carbs} unit="g" color={Colors.warning} />
            <MacroBar label="Grasas" value={plan.macros.fat} unit="g" color={Colors.info} />
          </View>

          {/* Comidas */}
          {plan.meals.map((meal, i) => (
            <MealCard key={i} meal={meal} />
          ))}

          {/* Acciones */}
          <View style={styles.resultActions}>
            <TouchableOpacity
              style={[styles.saveBtn, saved && styles.saveBtnDone]}
              onPress={handleSave}
              disabled={saved}
              activeOpacity={0.8}
            >
              <Ionicons
                name={saved ? 'checkmark-circle' : 'bookmark-outline'}
                size={18}
                color={saved ? Colors.primary : '#0F1117'}
              />
              <Text style={[styles.saveBtnText, saved && styles.saveBtnTextDone]}>
                {saved ? 'Guardado' : 'Guardar plan'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.newBtn} onPress={handleGenerate} activeOpacity={0.8}>
              <Ionicons name="refresh" size={18} color={Colors.textSecondary} />
              <Text style={styles.newBtnText}>Regenerar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.newBtn} onPress={handleReset} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={18} color={Colors.textSecondary} />
              <Text style={styles.newBtnText}>Nuevo</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.configContent} showsVerticalScrollIndicator={false}>
        {/* Tipo de dieta */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tipo de plan</Text>
          <View style={styles.dietGrid}>
            {DIET_TYPES.map((d) => (
              <TouchableOpacity
                key={d.id}
                style={[
                  styles.dietCard,
                  selectedDiet === d.id && { borderColor: d.color, backgroundColor: d.color + '18' },
                ]}
                onPress={() => setSelectedDiet(d.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.dietEmoji}>{d.emoji}</Text>
                <Text style={[styles.dietLabel, selectedDiet === d.id && { color: d.color }]}>
                  {d.label}
                </Text>
                <Text style={styles.dietDesc}>{d.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Datos personales */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tus datos</Text>
          <View style={styles.inputsGrid}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Peso (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="75"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Altura (cm)</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholder="175"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Edad</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholder="30"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            {/* Género */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Género</Text>
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[styles.genderBtn, gender === 'hombre' && styles.genderBtnActive]}
                  onPress={() => setGender('hombre')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.genderBtnText, gender === 'hombre' && styles.genderBtnTextActive]}>
                    Hombre
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderBtn, gender === 'mujer' && styles.genderBtnActive]}
                  onPress={() => setGender('mujer')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.genderBtnText, gender === 'mujer' && styles.genderBtnTextActive]}>
                    Mujer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Nivel de actividad */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Nivel de actividad</Text>
          <View style={styles.activityList}>
            {ACTIVITY_LEVELS.map((al) => (
              <TouchableOpacity
                key={al.id}
                style={[styles.activityBtn, activityLevel === al.id && styles.activityBtnActive]}
                onPress={() => setActivityLevel(al.id)}
                activeOpacity={0.7}
              >
                <View style={styles.activityBtnInner}>
                  <Text style={[styles.activityLabel, activityLevel === al.id && styles.activityLabelActive]}>
                    {al.label}
                  </Text>
                  <Text style={styles.activityDesc}>{al.desc}</Text>
                </View>
                {activityLevel === al.id && (
                  <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botón calcular */}
        <TouchableOpacity
          style={[styles.generateBtn, generating && styles.generateBtnLoading]}
          onPress={handleGenerate}
          disabled={generating}
          activeOpacity={0.8}
        >
          {generating ? (
            <ActivityIndicator color="#0F1117" size="small" />
          ) : (
            <>
              <Ionicons name="nutrition-outline" size={20} color="#0F1117" />
              <Text style={styles.generateBtnText}>Calcular mi plan</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  // Config view
  configContent: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  section: { marginBottom: Spacing.xl },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  dietGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  dietCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  dietEmoji: { fontSize: 20, marginBottom: 4 },
  dietLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  dietDesc: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  inputsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  inputGroup: { width: '47%' },
  inputLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: 6,
    fontWeight: FontWeight.medium,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  genderRow: { flexDirection: 'row', gap: Spacing.sm },
  genderBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  genderBtnActive: { backgroundColor: Colors.primaryMuted, borderColor: Colors.primary },
  genderBtnText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  genderBtnTextActive: { color: Colors.primary },
  activityList: { gap: Spacing.sm },
  activityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  activityBtnActive: { backgroundColor: Colors.primaryMuted, borderColor: Colors.primary },
  activityBtnInner: { flex: 1 },
  activityLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  activityLabelActive: { color: Colors.primary },
  activityDesc: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
  },
  generateBtnLoading: { opacity: 0.7 },
  generateBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: '#0F1117',
  },

  // Result view
  resultContent: { padding: Spacing.lg, paddingBottom: Spacing.xxxl, gap: Spacing.md },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    marginBottom: Spacing.sm,
  },
  planEmoji: { fontSize: 32 },
  planHeaderText: { flex: 1 },
  planName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  planCals: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
  },
  macrosRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  macroCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  macroIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  macroDot: { width: 10, height: 10, borderRadius: 5 },
  macroValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
  },
  macroLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },

  // Meal card
  mealCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  mealEmoji: { fontSize: 22 },
  mealName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  mealTime: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  mealCalBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    backgroundColor: Colors.primaryMuted,
    borderRadius: Radius.full,
  },
  mealCalText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.bold },
  mealFoods: { padding: Spacing.md, gap: Spacing.md },

  // Food row
  foodRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  foodImgBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  foodImg: { width: 44, height: 44 },
  foodEmoji: { fontSize: 22 },
  foodInfo: { flex: 1 },
  foodName: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    marginBottom: 4,
  },
  foodMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  foodAmountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  foodAmountText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
  },
  foodCals: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  foodProt: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },

  // Actions
  resultActions: { flexDirection: 'row', gap: Spacing.sm },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
  },
  saveBtnDone: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: Colors.primary },
  saveBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: '#0F1117' },
  saveBtnTextDone: { color: Colors.primary },
  newBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  newBtnText: { fontSize: FontSize.sm, color: Colors.textSecondary },
});
