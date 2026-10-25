import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { MuscleGroup } from '@/types';
import { getExercisesByMuscle, ExerciseDB } from '@/data/exercises';
import { MUSCLE_VISUALS, getExerciseEmoji } from '@/data/visuals';

const MUSCLES: Array<{ id: MuscleGroup; label: string; emoji: string }> = [
  { id: 'pecho', label: 'Pecho', emoji: '💪' },
  { id: 'espalda', label: 'Espalda', emoji: '🔙' },
  { id: 'piernas', label: 'Piernas', emoji: '🦵' },
  { id: 'hombros', label: 'Hombros', emoji: '🏋️' },
  { id: 'brazos', label: 'Brazos', emoji: '💥' },
  { id: 'core', label: 'Core', emoji: '🔥' },
  { id: 'cardio', label: 'Cardio', emoji: '🏃' },
];

const DIFFICULTY_COLORS = {
  principiante: Colors.primary,
  intermedio: Colors.warning,
  avanzado: Colors.danger,
};

const DIFFICULTY_LABELS = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

function getLocalImage(exerciseId: string): number | null {
  const imageMap: Record<string, number> = {
    // Descomenta cada línea cuando añadas la foto correspondiente
    pecho_01: require('@/assets/images/exercises/pecho_01.jpg'),
    // pecho_02: require('@/assets/images/exercises/pecho_02.jpg'),
    // pecho_03: require('@/assets/images/exercises/pecho_03.jpg'),
    // pecho_04: require('@/assets/images/exercises/pecho_04.jpg'),
    // pecho_05: require('@/assets/images/exercises/pecho_05.jpg'),
    // pecho_06: require('@/assets/images/exercises/pecho_06.jpg'),
    // pecho_07: require('@/assets/images/exercises/pecho_07.jpg'),
    // pecho_08: require('@/assets/images/exercises/pecho_08.jpg'),
    // pecho_09: require('@/assets/images/exercises/pecho_09.jpg'),
    // pecho_10: require('@/assets/images/exercises/pecho_10.jpg'),
    // pecho_11: require('@/assets/images/exercises/pecho_11.jpg'),
    // pecho_12: require('@/assets/images/exercises/pecho_12.jpg'),
    // pecho_13: require('@/assets/images/exercises/pecho_13.jpg'),
    // pecho_14: require('@/assets/images/exercises/pecho_14.jpg'),
    // pecho_15: require('@/assets/images/exercises/pecho_15.jpg'),
    // espalda_01: require('@/assets/images/exercises/espalda_01.jpg'),
    // espalda_02: require('@/assets/images/exercises/espalda_02.jpg'),
    // espalda_03: require('@/assets/images/exercises/espalda_03.jpg'),
    // espalda_04: require('@/assets/images/exercises/espalda_04.jpg'),
    // espalda_05: require('@/assets/images/exercises/espalda_05.jpg'),
    // espalda_06: require('@/assets/images/exercises/espalda_06.jpg'),
    // espalda_07: require('@/assets/images/exercises/espalda_07.jpg'),
    // espalda_08: require('@/assets/images/exercises/espalda_08.jpg'),
    // espalda_09: require('@/assets/images/exercises/espalda_09.jpg'),
    // espalda_10: require('@/assets/images/exercises/espalda_10.jpg'),
    // espalda_11: require('@/assets/images/exercises/espalda_11.jpg'),
    // espalda_12: require('@/assets/images/exercises/espalda_12.jpg'),
    // espalda_13: require('@/assets/images/exercises/espalda_13.jpg'),
    // espalda_14: require('@/assets/images/exercises/espalda_14.jpg'),
    // espalda_15: require('@/assets/images/exercises/espalda_15.jpg'),
    // piernas_01: require('@/assets/images/exercises/piernas_01.jpg'),
    // piernas_02: require('@/assets/images/exercises/piernas_02.jpg'),
    // piernas_03: require('@/assets/images/exercises/piernas_03.jpg'),
    // piernas_04: require('@/assets/images/exercises/piernas_04.jpg'),
    // piernas_05: require('@/assets/images/exercises/piernas_05.jpg'),
    // piernas_06: require('@/assets/images/exercises/piernas_06.jpg'),
    // piernas_07: require('@/assets/images/exercises/piernas_07.jpg'),
    // piernas_08: require('@/assets/images/exercises/piernas_08.jpg'),
    // piernas_09: require('@/assets/images/exercises/piernas_09.jpg'),
    // piernas_10: require('@/assets/images/exercises/piernas_10.jpg'),
    // piernas_11: require('@/assets/images/exercises/piernas_11.jpg'),
    // piernas_12: require('@/assets/images/exercises/piernas_12.jpg'),
    // piernas_13: require('@/assets/images/exercises/piernas_13.jpg'),
    // piernas_14: require('@/assets/images/exercises/piernas_14.jpg'),
    // piernas_15: require('@/assets/images/exercises/piernas_15.jpg'),
    // hombros_01: require('@/assets/images/exercises/hombros_01.jpg'),
    // hombros_02: require('@/assets/images/exercises/hombros_02.jpg'),
    // hombros_03: require('@/assets/images/exercises/hombros_03.jpg'),
    // hombros_04: require('@/assets/images/exercises/hombros_04.jpg'),
    // hombros_05: require('@/assets/images/exercises/hombros_05.jpg'),
    // hombros_06: require('@/assets/images/exercises/hombros_06.jpg'),
    // hombros_07: require('@/assets/images/exercises/hombros_07.jpg'),
    // hombros_08: require('@/assets/images/exercises/hombros_08.jpg'),
    // hombros_09: require('@/assets/images/exercises/hombros_09.jpg'),
    // hombros_10: require('@/assets/images/exercises/hombros_10.jpg'),
    // hombros_11: require('@/assets/images/exercises/hombros_11.jpg'),
    // hombros_12: require('@/assets/images/exercises/hombros_12.jpg'),
    // hombros_13: require('@/assets/images/exercises/hombros_13.jpg'),
    // hombros_14: require('@/assets/images/exercises/hombros_14.jpg'),
    // hombros_15: require('@/assets/images/exercises/hombros_15.jpg'),
    // brazos_01: require('@/assets/images/exercises/brazos_01.jpg'),
    // brazos_02: require('@/assets/images/exercises/brazos_02.jpg'),
    // brazos_03: require('@/assets/images/exercises/brazos_03.jpg'),
    // brazos_04: require('@/assets/images/exercises/brazos_04.jpg'),
    // brazos_05: require('@/assets/images/exercises/brazos_05.jpg'),
    // brazos_06: require('@/assets/images/exercises/brazos_06.jpg'),
    // brazos_07: require('@/assets/images/exercises/brazos_07.jpg'),
    // brazos_08: require('@/assets/images/exercises/brazos_08.jpg'),
    // brazos_09: require('@/assets/images/exercises/brazos_09.jpg'),
    // brazos_10: require('@/assets/images/exercises/brazos_10.jpg'),
    // brazos_11: require('@/assets/images/exercises/brazos_11.jpg'),
    // brazos_12: require('@/assets/images/exercises/brazos_12.jpg'),
    // brazos_13: require('@/assets/images/exercises/brazos_13.jpg'),
    // brazos_14: require('@/assets/images/exercises/brazos_14.jpg'),
    // brazos_15: require('@/assets/images/exercises/brazos_15.jpg'),
    // core_01: require('@/assets/images/exercises/core_01.jpg'),
    // core_02: require('@/assets/images/exercises/core_02.jpg'),
    // core_03: require('@/assets/images/exercises/core_03.jpg'),
    // core_04: require('@/assets/images/exercises/core_04.jpg'),
    // core_05: require('@/assets/images/exercises/core_05.jpg'),
    // core_06: require('@/assets/images/exercises/core_06.jpg'),
    // core_07: require('@/assets/images/exercises/core_07.jpg'),
    // core_08: require('@/assets/images/exercises/core_08.jpg'),
    // core_09: require('@/assets/images/exercises/core_09.jpg'),
    // core_10: require('@/assets/images/exercises/core_10.jpg'),
    // core_11: require('@/assets/images/exercises/core_11.jpg'),
    // core_12: require('@/assets/images/exercises/core_12.jpg'),
    // core_13: require('@/assets/images/exercises/core_13.jpg'),
    // core_14: require('@/assets/images/exercises/core_14.jpg'),
    // core_15: require('@/assets/images/exercises/core_15.jpg'),
    // cardio_01: require('@/assets/images/exercises/cardio_01.jpg'),
    // cardio_02: require('@/assets/images/exercises/cardio_02.jpg'),
    // cardio_03: require('@/assets/images/exercises/cardio_03.jpg'),
    // cardio_04: require('@/assets/images/exercises/cardio_04.jpg'),
    // cardio_05: require('@/assets/images/exercises/cardio_05.jpg'),
    // cardio_06: require('@/assets/images/exercises/cardio_06.jpg'),
    // cardio_07: require('@/assets/images/exercises/cardio_07.jpg'),
    // cardio_08: require('@/assets/images/exercises/cardio_08.jpg'),
    // cardio_09: require('@/assets/images/exercises/cardio_09.jpg'),
    // cardio_10: require('@/assets/images/exercises/cardio_10.jpg'),
    // cardio_11: require('@/assets/images/exercises/cardio_11.jpg'),
    // cardio_12: require('@/assets/images/exercises/cardio_12.jpg'),
    // cardio_13: require('@/assets/images/exercises/cardio_13.jpg'),
    // cardio_14: require('@/assets/images/exercises/cardio_14.jpg'),
    // cardio_15: require('@/assets/images/exercises/cardio_15.jpg'),
  };
  return imageMap[exerciseId] ?? null;
}

// ─── Modal de detalle ────────────────────────────────────────────────────────

function ExerciseDetailModal({
  exercise,
  onClose,
}: {
  exercise: ExerciseDB | null;
  onClose: () => void;
}) {
  if (!exercise) return null;

  const vis = MUSCLE_VISUALS[exercise.muscle];
  const diffColor = DIFFICULTY_COLORS[exercise.difficulty];
  const localImg = getLocalImage(exercise.id);

  return (
    <Modal
      visible={!!exercise}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={() => {}}>
          {/* Foto o banner ampliado */}
          <View style={[styles.modalBanner, { backgroundColor: vis.bgLight }]}>
            {localImg ? (
              <Image source={localImg} style={styles.modalPhoto} resizeMode="cover" />
            ) : (
              <>
                <View style={[styles.modalCircle1, { backgroundColor: vis.color + '22' }]} />
                <View style={[styles.modalCircle2, { backgroundColor: vis.color + '14' }]} />
                <Text style={styles.modalBannerEmoji}>{vis.emoji}</Text>
              </>
            )}
            {/* Botón cerrar */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
            {/* Pill de músculo */}
            <View style={[styles.modalMusclePill, { backgroundColor: vis.color }]}>
              <Text style={styles.modalMusclePillText}>{vis.label.toUpperCase()}</Text>
            </View>
          </View>

          {/* Contenido scrollable */}
          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={styles.modalBodyContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Nombre */}
            <Text style={styles.modalName}>{exercise.name}</Text>

            {/* Badges */}
            <View style={styles.modalBadges}>
              <View style={styles.equipBadge}>
                <Text style={styles.equipBadgeText}>🏋️ {exercise.equipment}</Text>
              </View>
              <View style={[styles.diffBadge, { backgroundColor: diffColor + '22', borderColor: diffColor }]}>
                <Text style={[styles.diffBadgeText, { color: diffColor }]}>
                  {DIFFICULTY_LABELS[exercise.difficulty]}
                </Text>
              </View>
              <View style={[styles.typeBadge, { backgroundColor: exercise.compound ? Colors.primary + '22' : Colors.warning + '22' }]}>
                <Text style={[styles.typeBadgeText, { color: exercise.compound ? Colors.primary : Colors.warning }]}>
                  {exercise.compound ? 'Compuesto' : 'Aislamiento'}
                </Text>
              </View>
            </View>

            {/* Stats */}
            <View style={[styles.modalStatsRow, { borderColor: vis.color + '44' }]}>
              <View style={styles.modalStatItem}>
                <Text style={[styles.modalStatNum, { color: vis.color }]}>{exercise.defaultSets}</Text>
                <Text style={styles.modalStatLbl}>Series</Text>
              </View>
              <View style={[styles.statSep, { backgroundColor: vis.color + '33' }]} />
              <View style={styles.modalStatItem}>
                <Text style={[styles.modalStatNum, { color: vis.color }]}>{exercise.defaultReps}</Text>
                <Text style={styles.modalStatLbl}>Repeticiones</Text>
              </View>
              <View style={[styles.statSep, { backgroundColor: vis.color + '33' }]} />
              <View style={styles.modalStatItem}>
                <Text style={[styles.modalStatNum, { color: vis.color }]}>{exercise.defaultRest}</Text>
                <Text style={styles.modalStatLbl}>Descanso</Text>
              </View>
            </View>

            {/* Técnica */}
            <View style={[styles.techniqueBox, { borderColor: vis.color + '55', backgroundColor: vis.bgLight }]}>
              <View style={styles.techniqueHeader}>
                <View style={[styles.techniqueIcon, { backgroundColor: vis.color }]}>
                  <Text style={styles.techniqueIconText}>📋</Text>
                </View>
                <Text style={[styles.techniqueTitle, { color: vis.color }]}>Técnica y consejos</Text>
              </View>
              <Text style={styles.techniqueText}>{exercise.notes}</Text>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Tarjeta de ejercicio ────────────────────────────────────────────────────

function ExerciseCard({ exercise, onPress }: { exercise: ExerciseDB; onPress: () => void }) {
  const vis = MUSCLE_VISUALS[exercise.muscle];
  const diffColor = DIFFICULTY_COLORS[exercise.difficulty];
  const localImg = getLocalImage(exercise.id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Banner visual */}
      <View style={[styles.cardImage, { backgroundColor: vis.bgLight }]}>
        {localImg ? (
          <Image source={localImg} style={styles.cardPhoto} resizeMode="cover" />
        ) : (
          <>
            <View style={[styles.circle1, { backgroundColor: vis.color + '18' }]} />
            <View style={[styles.circle2, { backgroundColor: vis.color + '0F' }]} />
            <Text style={styles.cardMainEmoji}>{vis.emoji}</Text>
          </>
        )}
        <View style={[styles.musclePill, { backgroundColor: vis.color }]}>
          <Text style={styles.musclePillText}>{vis.label.toUpperCase()}</Text>
        </View>
        <View style={styles.typeTag}>
          <Text style={styles.typeTagText}>
            {exercise.compound ? 'Compuesto' : 'Aislamiento'}
          </Text>
        </View>
        {/* Indicador de que es clicable */}
        <View style={styles.tapHint}>
          <Text style={styles.tapHintText}>Ver detalle →</Text>
        </View>
      </View>

      {/* Cuerpo */}
      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{exercise.name}</Text>

        <View style={styles.cardBadges}>
          <View style={styles.equipBadge}>
            <Text style={styles.equipBadgeText}>{exercise.equipment}</Text>
          </View>
          <View style={[styles.diffBadge, { backgroundColor: diffColor + '22', borderColor: diffColor }]}>
            <Text style={[styles.diffBadgeText, { color: diffColor }]}>
              {DIFFICULTY_LABELS[exercise.difficulty]}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{exercise.defaultSets}</Text>
            <Text style={styles.statLbl}>Series</Text>
          </View>
          <View style={[styles.statSep, { backgroundColor: vis.color + '44' }]} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{exercise.defaultReps}</Text>
            <Text style={styles.statLbl}>Reps</Text>
          </View>
          <View style={[styles.statSep, { backgroundColor: vis.color + '44' }]} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{exercise.defaultRest}</Text>
            <Text style={styles.statLbl}>Descanso</Text>
          </View>
        </View>

        <View style={[styles.noteBox, { borderLeftColor: vis.color }]}>
          <Text style={styles.noteText} numberOfLines={2}>{exercise.notes}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Header de grupo muscular ────────────────────────────────────────────────

function MuscleHeader({ muscle }: { muscle: MuscleGroup }) {
  const vis = MUSCLE_VISUALS[muscle];
  const exercises = getExercisesByMuscle(muscle);
  return (
    <View style={[styles.muscleHeader, { backgroundColor: vis.bgLight }]}>
      <View style={[styles.muscleHeaderIcon, { backgroundColor: vis.color + '33' }]}>
        <Text style={styles.muscleHeaderEmoji}>{vis.emoji}</Text>
      </View>
      <View style={styles.muscleHeaderText}>
        <Text style={[styles.muscleHeaderTitle, { color: vis.color }]}>{vis.label}</Text>
        <Text style={styles.muscleHeaderSub}>{exercises.length} ejercicios · toca uno para ver el detalle</Text>
      </View>
    </View>
  );
}

// ─── Pantalla principal ──────────────────────────────────────────────────────

export default function GymScreen() {
  const params = useLocalSearchParams<{ muscle?: string }>();
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(
    params.muscle ? (params.muscle.toLowerCase() as MuscleGroup) : null
  );
  const [detailExercise, setDetailExercise] = useState<ExerciseDB | null>(null);

  const exercises = useMemo(
    () => (selectedMuscle ? getExercisesByMuscle(selectedMuscle) : []),
    [selectedMuscle]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.container}>
        {/* Selector de grupos musculares */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.muscleRow}
        >
          {MUSCLES.map((m) => {
            const vis = MUSCLE_VISUALS[m.id];
            const active = selectedMuscle === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.muscleChip,
                  active && { backgroundColor: vis.bgLight, borderColor: vis.color },
                ]}
                onPress={() => setSelectedMuscle(m.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.muscleEmoji}>{m.emoji}</Text>
                <Text style={[styles.muscleLabel, active && { color: vis.color }]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Estado vacío */}
        {!selectedMuscle && (
          <View style={styles.empty}>
            <View style={styles.emptyIconRow}>
              {MUSCLES.slice(0, 5).map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.emptyMuscleBtn, { backgroundColor: MUSCLE_VISUALS[m.id].bgLight }]}
                  onPress={() => setSelectedMuscle(m.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.emptyMuscleEmoji}>{m.emoji}</Text>
                  <Text style={[styles.emptyMuscleLabel, { color: MUSCLE_VISUALS[m.id].color }]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.emptyTitle}>Catálogo de ejercicios</Text>
            <Text style={styles.emptySub}>
              Selecciona un grupo muscular para ver todos los ejercicios con series, reps y consejos de técnica.
            </Text>
          </View>
        )}

        {/* Lista de ejercicios */}
        {selectedMuscle && (
          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={<MuscleHeader muscle={selectedMuscle} />}
            renderItem={({ item }) => (
              <ExerciseCard exercise={item} onPress={() => setDetailExercise(item)} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Modal de detalle */}
        <ExerciseDetailModal
          exercise={detailExercise}
          onClose={() => setDetailExercise(null)}
        />
      </View>
    </SafeAreaView>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },

  // Chips de selección
  muscleRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  muscleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  muscleEmoji: { fontSize: 15 },
  muscleLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },

  // Estado vacío
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyIconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  emptyMuscleBtn: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    minWidth: 64,
  },
  emptyMuscleEmoji: { fontSize: 28, marginBottom: 4 },
  emptyMuscleLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Header de grupo muscular
  muscleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  muscleHeaderIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muscleHeaderEmoji: { fontSize: 26 },
  muscleHeaderText: { flex: 1 },
  muscleHeaderTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
  },
  muscleHeaderSub: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // Lista
  listContent: {
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },

  // Tarjeta
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardImage: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  cardPhoto: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  circle1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    right: -40,
    top: -40,
  },
  circle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    left: -20,
    bottom: -20,
  },
  cardMainEmoji: { fontSize: 52, zIndex: 1 },
  musclePill: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  musclePillText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#fff',
    letterSpacing: 0.5,
  },
  typeTag: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: Radius.full,
  },
  typeTagText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: FontWeight.medium,
  },
  tapHint: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: Radius.full,
  },
  tapHintText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: FontWeight.medium,
  },

  // Cuerpo de la tarjeta
  cardBody: { padding: Spacing.md },
  cardName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  cardBadges: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  equipBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.sm,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  equipBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  diffBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    borderWidth: 0.5,
  },
  diffBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },

  // Stats (tarjeta)
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: 2,
  },
  statLbl: { fontSize: 10, color: Colors.textMuted },
  statSep: { width: 1, height: 28 },

  // Nota técnica (tarjeta)
  noteBox: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.md,
    paddingVertical: 4,
  },
  noteText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },

  // ── Modal ──────────────────────────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
  },

  // Banner ampliado en el modal
  modalBanner: {
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  modalPhoto: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  modalCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    right: -80,
    top: -80,
  },
  modalCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    left: -50,
    bottom: -50,
  },
  modalBannerEmoji: { fontSize: 88, zIndex: 1 },
  closeBtn: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: FontWeight.bold,
  },
  modalMusclePill: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    zIndex: 10,
  },
  modalMusclePillText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: '#fff',
    letterSpacing: 0.6,
  },

  // Cuerpo del modal
  modalBody: { flexShrink: 1 },
  modalBodyContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  modalName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  modalBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  typeBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },

  // Stats del modal
  modalStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  modalStatItem: { flex: 1, alignItems: 'center', gap: 4 },
  modalStatNum: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
  },
  modalStatLbl: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },

  // Técnica
  techniqueBox: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  techniqueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  techniqueIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  techniqueIconText: { fontSize: 14 },
  techniqueTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
  },
  techniqueText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
