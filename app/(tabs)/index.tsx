import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const QUICK_ACTIONS = [
  {
    icon: 'barbell-outline' as const,
    label: 'Ejercicios',
    sub: 'Por zona muscular',
    route: '/(tabs)/gym' as const,
    color: Colors.primary,
  },
  {
    icon: 'calendar-outline' as const,
    label: 'Mi rutina',
    sub: 'Personalizada',
    route: '/(tabs)/routines' as const,
    color: '#4A90D9',
  },
  {
    icon: 'nutrition-outline' as const,
    label: 'Plan dieta',
    sub: 'Macros y menú',
    route: '/(tabs)/diet' as const,
    color: '#E09A3A',
  },
  {
    icon: 'person-outline' as const,
    label: 'Mi perfil',
    sub: 'Datos y metas',
    route: '/(tabs)/profile' as const,
    color: '#E05C5C',
  },
];

const MUSCLE_CHIPS = ['Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core'];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola! 👋</Text>
            <Text style={styles.title}>Tu coach personal</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>PRO</Text>
          </View>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>¿Listo para entrenar?</Text>
            <Text style={styles.bannerSub}>
              Explora ejercicios, genera rutinas y planes de nutrición personalizados
            </Text>
            <TouchableOpacity
              style={styles.bannerBtn}
              onPress={() => router.push('/(tabs)/gym')}
              activeOpacity={0.8}
            >
              <Text style={styles.bannerBtnText}>Empezar ahora</Text>
              <Ionicons name="arrow-forward" size={16} color="#0F1117" />
            </TouchableOpacity>
          </View>
          <Text style={styles.bannerEmoji}>💪</Text>
        </View>

        {/* Acciones rápidas */}
        <Text style={styles.sectionLabel}>Acceso rápido</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionCard}
              onPress={() => router.push(action.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '22' }]}>
                <Ionicons name={action.icon} size={22} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
              <Text style={styles.actionSub}>{action.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Zonas musculares rápidas */}
        <Text style={styles.sectionLabel}>Entrenar por zona</Text>
        <View style={styles.chipsRow}>
          {MUSCLE_CHIPS.map((muscle) => (
            <TouchableOpacity
              key={muscle}
              style={styles.chip}
              onPress={() => router.push({ pathname: '/(tabs)/gym', params: { muscle } })}
              activeOpacity={0.7}
            >
              <Text style={styles.chipText}>{muscle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer tip */}
        <View style={styles.tip}>
          <Ionicons name="bulb-outline" size={16} color={Colors.warning} />
          <Text style={styles.tipText}>
            Completa tu perfil con peso, altura y objetivo para que los planes de dieta sean más precisos.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  greeting: { fontSize: FontSize.sm, color: Colors.textSecondary },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    backgroundColor: Colors.primaryMuted,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  badgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.primary },
  banner: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerContent: { flex: 1 },
  bannerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: '#0F1117',
    marginBottom: 4,
  },
  bannerSub: { fontSize: FontSize.sm, color: '#0F6E56', marginBottom: Spacing.md, lineHeight: 18 },
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F1117',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  bannerBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.primary },
  bannerEmoji: { fontSize: 52, marginLeft: Spacing.md },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  actionCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  actionLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  actionSub: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  chipText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  tip: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'flex-start',
  },
  tipText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18 },
});
