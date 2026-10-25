import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getProfile, saveProfile, clearAll } from '@/services/storage';
import { UserProfile, TrainingGoal } from '@/types';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const GOALS: Array<{ id: TrainingGoal; label: string }> = [
  { id: 'masa', label: 'Ganar masa' },
  { id: 'definicion', label: 'Definición' },
  { id: 'fuerza', label: 'Fuerza' },
  { id: 'resistencia', label: 'Resistencia' },
];

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProfile().then((p) => { if (p) setProfile(p); });
  }, []);

  const handleSave = async () => {
    const full: UserProfile = {
      id: profile.id || Math.random().toString(36).substring(2),
      name: profile.name || 'Usuario',
      email: profile.email || '',
      weight: profile.weight,
      height: profile.height,
      age: profile.age,
      goal: profile.goal,
      activityLevel: profile.activityLevel,
      createdAt: profile.createdAt || new Date(),
    };
    await saveProfile(full);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    Alert.alert(
      'Borrar datos',
      '¿Seguro que quieres borrar todos tus datos y conversaciones?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar todo',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            setProfile({});
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.name ? profile.name[0].toUpperCase() : '?'}
            </Text>
          </View>
          <Text style={styles.avatarName}>{profile.name || 'Tu nombre'}</Text>
          <Text style={styles.avatarSub}>Edita tu perfil para respuestas más precisas</Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <Text style={styles.sectionLabel}>Datos personales</Text>

          <Field label="Nombre">
            <TextInput
              style={styles.input}
              value={profile.name || ''}
              onChangeText={(v) => setProfile((p) => ({ ...p, name: v }))}
              placeholder="Tu nombre"
              placeholderTextColor={Colors.textMuted}
            />
          </Field>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Field label="Peso (kg)">
                <TextInput
                  style={styles.input}
                  value={profile.weight?.toString() || ''}
                  onChangeText={(v) => setProfile((p) => ({ ...p, weight: parseFloat(v) || undefined }))}
                  placeholder="70"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                />
              </Field>
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Altura (cm)">
                <TextInput
                  style={styles.input}
                  value={profile.height?.toString() || ''}
                  onChangeText={(v) => setProfile((p) => ({ ...p, height: parseFloat(v) || undefined }))}
                  placeholder="175"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                />
              </Field>
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Edad">
                <TextInput
                  style={styles.input}
                  value={profile.age?.toString() || ''}
                  onChangeText={(v) => setProfile((p) => ({ ...p, age: parseInt(v) || undefined }))}
                  placeholder="25"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                />
              </Field>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>Objetivo principal</Text>
          <View style={styles.goalsRow}>
            {GOALS.map((g) => (
              <TouchableOpacity
                key={g.id}
                style={[styles.goalChip, profile.goal === g.id && styles.goalChipActive]}
                onPress={() => setProfile((p) => ({ ...p, goal: g.id }))}
                activeOpacity={0.7}
              >
                <Text style={[styles.goalChipText, profile.goal === g.id && styles.goalChipTextActive]}>
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
            <Ionicons name={saved ? 'checkmark' : 'save-outline'} size={18} color="#0F1117" />
            <Text style={styles.saveBtnText}>{saved ? '¡Guardado!' : 'Guardar perfil'}</Text>
          </TouchableOpacity>
        </View>

        {/* Datos de la app */}
        <View style={styles.appInfo}>
          <Text style={styles.sectionLabel}>Acerca de FitAI</Text>
          <View style={styles.infoCard}>
            <InfoRow icon="flash-outline" label="Versión" value="1.0.0" />
            <InfoRow icon="shield-checkmark-outline" label="Privacidad" value="Datos locales" />
            <InfoRow icon="star-outline" label="Valorar app" value="⭐⭐⭐⭐⭐" />
          </View>
        </View>

        <TouchableOpacity style={styles.dangerBtn} onPress={handleClear} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={16} color={Colors.danger} />
          <Text style={styles.dangerBtnText}>Borrar todos mis datos</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: Spacing.md }}>
      <Text style={fieldStyles.label}>{label}</Text>
      {children}
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={fieldStyles.infoRow}>
      <View style={fieldStyles.infoLeft}>
        <Ionicons name={icon} size={16} color={Colors.textSecondary} />
        <Text style={fieldStyles.infoLabel}>{label}</Text>
      </View>
      <Text style={fieldStyles.infoValue}>{value}</Text>
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  label: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 6, fontWeight: FontWeight.medium },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  infoLabel: { fontSize: FontSize.sm, color: Colors.textPrimary },
  infoValue: { fontSize: FontSize.sm, color: Colors.textSecondary },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.xxl },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryMuted,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: { fontSize: 28, fontWeight: FontWeight.bold, color: Colors.primary },
  avatarName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  avatarSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4 },
  form: { marginBottom: Spacing.xl },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  row: { flexDirection: 'row', gap: Spacing.sm },
  goalsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
  goalChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  goalChipActive: { backgroundColor: Colors.primaryMuted, borderColor: Colors.primary },
  goalChipText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  goalChipTextActive: { color: Colors.primary, fontWeight: FontWeight.medium },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  saveBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: '#0F1117' },
  appInfo: { marginBottom: Spacing.xl },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 0.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 0.5,
    borderColor: Colors.danger + '66',
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  dangerBtnText: { fontSize: FontSize.sm, color: Colors.danger },
});
