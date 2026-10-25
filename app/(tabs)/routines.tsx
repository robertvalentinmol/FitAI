import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { TrainingGoal, Routine, RoutineDay, Exercise } from '@/types';
import { generateRoutine } from '@/services/routineService';
import { saveRoutine } from '@/services/storage';
import { MUSCLE_VISUALS, getExerciseEmoji } from '@/data/visuals';

const GOALS: Array<{ id: TrainingGoal; label: string; emoji: string; desc: string }> = [
  { id: 'masa', label: 'Ganar masa', emoji: '💪', desc: 'Hipertrofia' },
  { id: 'definicion', label: 'Definición', emoji: '🔥', desc: 'Perder grasa' },
  { id: 'fuerza', label: 'Fuerza', emoji: '⚡', desc: 'Powerlifting' },
  { id: 'resistencia', label: 'Resistencia', emoji: '🤸', desc: 'Funcional' },
];

const DAYS_OPTIONS = [2, 3, 4, 5, 6];

function ExerciseRow({ exercise }: { exercise: Exercise }) {
  const vis = MUSCLE_VISUALS[exercise.muscle];
  const exEmoji = getExerciseEmoji(exercise.id, exercise.muscle);
  return (
    <View style={styles.exerciseRow}>
      {/* Icono visual del grupo muscular */}
      <View style={[styles.exerciseIcon, { backgroundColor: vis.bgLight }]}>
        <Text style={styles.exerciseIconEmoji}>{vis.emoji}</Text>
      </View>
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <View style={styles.exerciseMeta}>
          <Text style={[styles.exerciseMetaText, { color: vis.color }]}>
            {exercise.sets} series × {exercise.reps}
          </Text>
          {exercise.rest && exercise.rest !== '-' && (
            <Text style={styles.exerciseMetaText}> · {exercise.rest}</Text>
          )}
        </View>
        <View style={styles.exerciseTags}>
          {exercise.equipment && (
            <View style={styles.equipTag}>
              <Text style={styles.equipTagText}>{exercise.equipment}</Text>
            </View>
          )}
          <View style={[styles.muscleTag, { backgroundColor: vis.bgLight }]}>
            <Text style={[styles.muscleTagText, { color: vis.color }]}>{vis.label}</Text>
          </View>
        </View>
        {exercise.notes && (
          <Text style={styles.exerciseNotes} numberOfLines={2}>{exercise.notes}</Text>
        )}
      </View>
    </View>
  );
}

function DayCard({ day, isExpanded, onToggle }: {
  day: RoutineDay;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.dayCard}>
      <TouchableOpacity style={styles.dayHeader} onPress={onToggle} activeOpacity={0.7}>
        <View style={styles.dayBadge}>
          <Text style={styles.dayBadgeText}>Día {day.day}</Text>
        </View>
        <View style={styles.dayTitleRow}>
          <Text style={styles.dayName}>{day.name}</Text>
          <Text style={styles.dayExCount}>{day.exercises.length} ejercicios</Text>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={Colors.textMuted}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.dayBody}>
          {day.exercises.map((ex) => (
            <ExerciseRow key={ex.id} exercise={ex} />
          ))}
        </View>
      )}
    </View>
  );
}

export default function RoutinesScreen() {
  const [selectedGoal, setSelectedGoal] = useState<TrainingGoal>('masa');
  const [selectedDays, setSelectedDays] = useState(4);
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [generating, setGenerating] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [saved, setSaved] = useState(false);

  function toggleDay(dayNum: number) {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      next.has(dayNum) ? next.delete(dayNum) : next.add(dayNum);
      return next;
    });
  }

  function handleGenerate() {
    setGenerating(true);
    setSaved(false);
    setTimeout(() => {
      const r = generateRoutine(selectedGoal, selectedDays);
      setRoutine(r);
      setExpandedDays(new Set([1]));
      setGenerating(false);
    }, 300);
  }

  async function handleSave() {
    if (!routine) return;
    try {
      await saveRoutine(routine);
      setSaved(true);
      Alert.alert('Guardada', 'Rutina guardada correctamente.');
    } catch {
      Alert.alert('Error', 'No se pudo guardar la rutina.');
    }
  }

  function handleReset() {
    setRoutine(null);
    setSaved(false);
  }

  if (routine) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.resultContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header rutina */}
          <View style={styles.routineHeader}>
            <Text style={styles.routineName}>{routine.name}</Text>
            <View style={styles.routineMeta}>
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>{routine.days} días/semana</Text>
              </View>
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>
                  {routine.schedule.reduce((acc, d) => acc + d.exercises.length, 0)} ejercicios totales
                </Text>
              </View>
            </View>
          </View>

          {/* Días */}
          {routine.schedule.map((day) => (
            <DayCard
              key={day.day}
              day={day}
              isExpanded={expandedDays.has(day.day)}
              onToggle={() => toggleDay(day.day)}
            />
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
                {saved ? 'Guardada' : 'Guardar rutina'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.newBtn} onPress={handleGenerate} activeOpacity={0.8}>
              <Ionicons name="refresh" size={18} color={Colors.textSecondary} />
              <Text style={styles.newBtnText}>Regenerar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.newBtn} onPress={handleReset} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={18} color={Colors.textSecondary} />
              <Text style={styles.newBtnText}>Nueva</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.configContent} showsVerticalScrollIndicator={false}>
        {/* Objetivo */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Objetivo</Text>
          <View style={styles.goalsGrid}>
            {GOALS.map((g) => (
              <TouchableOpacity
                key={g.id}
                style={[styles.goalCard, selectedGoal === g.id && styles.goalCardActive]}
                onPress={() => setSelectedGoal(g.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.goalEmoji}>{g.emoji}</Text>
                <Text style={[styles.goalLabel, selectedGoal === g.id && styles.goalLabelActive]}>
                  {g.label}
                </Text>
                <Text style={styles.goalDesc}>{g.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Días */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Días por semana</Text>
          <View style={styles.daysRow}>
            {DAYS_OPTIONS.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.dayBtn, selectedDays === d && styles.dayBtnActive]}
                onPress={() => setSelectedDays(d)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayBtnNum, selectedDays === d && styles.dayBtnNumActive]}>
                  {d}
                </Text>
                <Text style={[styles.dayBtnSub, selectedDays === d && styles.dayBtnSubActive]}>
                  días
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.info} />
          <Text style={styles.infoText}>
            Se generará una rutina con ejercicios seleccionados de nuestra base de datos, adaptada a tu objetivo y disponibilidad.
          </Text>
        </View>

        {/* Botón generar */}
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
              <Ionicons name="barbell-outline" size={20} color="#0F1117" />
              <Text style={styles.generateBtnText}>Generar rutina</Text>
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
  goalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  goalCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  goalCardActive: { backgroundColor: Colors.primaryMuted, borderColor: Colors.primary },
  goalEmoji: { fontSize: 20, marginBottom: 4 },
  goalLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  goalLabelActive: { color: Colors.primary },
  goalDesc: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  daysRow: { flexDirection: 'row', gap: Spacing.sm },
  dayBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  dayBtnActive: { backgroundColor: Colors.primaryMuted, borderColor: Colors.primary },
  dayBtnNum: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  dayBtnNumActive: { color: Colors.primary },
  dayBtnSub: { fontSize: 10, color: Colors.textMuted },
  dayBtnSubActive: { color: Colors.primaryDark },
  infoBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    borderLeftWidth: 3,
    borderLeftColor: Colors.info,
  },
  infoText: { flex: 1, fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },
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
  routineHeader: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  routineName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  routineMeta: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  metaChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    backgroundColor: Colors.primaryMuted,
    borderRadius: Radius.full,
  },
  metaChipText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.semibold },

  // Day card
  dayCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  dayBadge: {
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    minWidth: 48,
    alignItems: 'center',
  },
  dayBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  dayTitleRow: { flex: 1 },
  dayName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  dayExCount: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  dayBody: {
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.md,
  },

  // Exercise row
  exerciseRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  exerciseIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  exerciseIconEmoji: { fontSize: 18 },
  exerciseInfo: { flex: 1 },
  exerciseName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  exerciseMeta: { flexDirection: 'row', marginBottom: 5, flexWrap: 'wrap' },
  exerciseMetaText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  exerciseTags: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap', marginBottom: 4 },
  equipTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.sm,
  },
  equipTagText: { fontSize: 10, color: Colors.textMuted },
  muscleTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  muscleTagText: { fontSize: 10, fontWeight: FontWeight.semibold },
  exerciseNotes: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 17,
    fontStyle: 'italic',
  },

  // Actions
  resultActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
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
