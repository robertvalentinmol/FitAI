import { Routine, RoutineDay, Exercise, TrainingGoal, MuscleGroup } from '@/types';
import {
  EXERCISES,
  ExerciseDB,
  getCompoundExercises,
  getIsolationExercises,
  getBicepExercises,
  getTricepExercises,
  getExercisesByMuscle,
} from '@/data/exercises';

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

const GOAL_SETS: Record<TrainingGoal, number> = {
  masa: 4,
  fuerza: 5,
  definicion: 3,
  resistencia: 3,
};

const GOAL_REPS: Record<TrainingGoal, string> = {
  masa: '8-12',
  fuerza: '3-5',
  definicion: '12-15',
  resistencia: '15-20',
};

const GOAL_REST: Record<TrainingGoal, string> = {
  masa: '90 s',
  fuerza: '3-4 min',
  definicion: '60 s',
  resistencia: '45 s',
};

const GOAL_NAMES: Record<TrainingGoal, string> = {
  masa: 'Ganancia de masa muscular',
  fuerza: 'Desarrollo de fuerza',
  definicion: 'Definición y quema de grasa',
  resistencia: 'Resistencia funcional',
};

type SlotType = 'compound_first' | 'bicep' | 'tricep' | 'any';

interface SplitSlot {
  muscle: MuscleGroup;
  count: number;
  type?: SlotType;
}

interface SplitDay {
  name: string;
  slots: SplitSlot[];
}

const SPLITS: Record<number, SplitDay[]> = {
  2: [
    {
      name: 'Cuerpo completo A',
      slots: [
        { muscle: 'pecho', count: 2, type: 'compound_first' },
        { muscle: 'espalda', count: 2, type: 'compound_first' },
        { muscle: 'hombros', count: 1, type: 'compound_first' },
        { muscle: 'core', count: 2, type: 'any' },
      ],
    },
    {
      name: 'Cuerpo completo B',
      slots: [
        { muscle: 'piernas', count: 3, type: 'compound_first' },
        { muscle: 'espalda', count: 2, type: 'compound_first' },
        { muscle: 'brazos', count: 1, type: 'bicep' },
        { muscle: 'cardio', count: 1, type: 'any' },
      ],
    },
  ],
  3: [
    {
      name: 'Empuje (Push)',
      slots: [
        { muscle: 'pecho', count: 3, type: 'compound_first' },
        { muscle: 'hombros', count: 2, type: 'compound_first' },
        { muscle: 'brazos', count: 2, type: 'tricep' },
      ],
    },
    {
      name: 'Jalón (Pull)',
      slots: [
        { muscle: 'espalda', count: 3, type: 'compound_first' },
        { muscle: 'brazos', count: 3, type: 'bicep' },
      ],
    },
    {
      name: 'Piernas + Core',
      slots: [
        { muscle: 'piernas', count: 4, type: 'compound_first' },
        { muscle: 'core', count: 3, type: 'any' },
      ],
    },
  ],
  4: [
    {
      name: 'Tren superior A',
      slots: [
        { muscle: 'pecho', count: 3, type: 'compound_first' },
        { muscle: 'espalda', count: 3, type: 'compound_first' },
        { muscle: 'brazos', count: 2, type: 'bicep' },
      ],
    },
    {
      name: 'Tren inferior A',
      slots: [
        { muscle: 'piernas', count: 4, type: 'compound_first' },
        { muscle: 'core', count: 3, type: 'any' },
      ],
    },
    {
      name: 'Tren superior B',
      slots: [
        { muscle: 'hombros', count: 3, type: 'compound_first' },
        { muscle: 'espalda', count: 2, type: 'compound_first' },
        { muscle: 'brazos', count: 2, type: 'tricep' },
      ],
    },
    {
      name: 'Tren inferior B + Cardio',
      slots: [
        { muscle: 'piernas', count: 3, type: 'compound_first' },
        { muscle: 'core', count: 2, type: 'any' },
        { muscle: 'cardio', count: 1, type: 'any' },
      ],
    },
  ],
  5: [
    {
      name: 'Empuje (Push)',
      slots: [
        { muscle: 'pecho', count: 3, type: 'compound_first' },
        { muscle: 'hombros', count: 2, type: 'compound_first' },
        { muscle: 'brazos', count: 2, type: 'tricep' },
      ],
    },
    {
      name: 'Jalón (Pull)',
      slots: [
        { muscle: 'espalda', count: 4, type: 'compound_first' },
        { muscle: 'brazos', count: 2, type: 'bicep' },
      ],
    },
    {
      name: 'Piernas',
      slots: [
        { muscle: 'piernas', count: 5, type: 'compound_first' },
        { muscle: 'core', count: 2, type: 'any' },
      ],
    },
    {
      name: 'Tren superior',
      slots: [
        { muscle: 'pecho', count: 2, type: 'compound_first' },
        { muscle: 'espalda', count: 2, type: 'compound_first' },
        { muscle: 'hombros', count: 2, type: 'any' },
        { muscle: 'brazos', count: 1, type: 'bicep' },
      ],
    },
    {
      name: 'Core + Cardio',
      slots: [
        { muscle: 'core', count: 4, type: 'any' },
        { muscle: 'cardio', count: 2, type: 'any' },
      ],
    },
  ],
  6: [
    {
      name: 'Empuje A',
      slots: [
        { muscle: 'pecho', count: 3, type: 'compound_first' },
        { muscle: 'hombros', count: 2, type: 'compound_first' },
        { muscle: 'brazos', count: 2, type: 'tricep' },
      ],
    },
    {
      name: 'Jalón A',
      slots: [
        { muscle: 'espalda', count: 4, type: 'compound_first' },
        { muscle: 'brazos', count: 2, type: 'bicep' },
      ],
    },
    {
      name: 'Piernas A',
      slots: [
        { muscle: 'piernas', count: 4, type: 'compound_first' },
        { muscle: 'core', count: 3, type: 'any' },
      ],
    },
    {
      name: 'Empuje B',
      slots: [
        { muscle: 'pecho', count: 3, type: 'any' },
        { muscle: 'hombros', count: 3, type: 'any' },
        { muscle: 'brazos', count: 2, type: 'tricep' },
      ],
    },
    {
      name: 'Jalón B',
      slots: [
        { muscle: 'espalda', count: 4, type: 'any' },
        { muscle: 'brazos', count: 2, type: 'bicep' },
      ],
    },
    {
      name: 'Piernas B + Cardio',
      slots: [
        { muscle: 'piernas', count: 3, type: 'any' },
        { muscle: 'core', count: 2, type: 'any' },
        { muscle: 'cardio', count: 2, type: 'any' },
      ],
    },
  ],
};

function pickExercises(slot: SplitSlot, goal: TrainingGoal, usedIds: Set<string>): ExerciseDB[] {
  const { muscle, count, type } = slot;
  let pool: ExerciseDB[] = [];

  if (type === 'bicep') {
    pool = shuffle(getBicepExercises());
  } else if (type === 'tricep') {
    pool = shuffle(getTricepExercises());
  } else if (type === 'compound_first' && (goal === 'masa' || goal === 'fuerza')) {
    const compounds = shuffle(getCompoundExercises(muscle).filter((e) => !usedIds.has(e.id)));
    const isolations = shuffle(getIsolationExercises(muscle).filter((e) => !usedIds.has(e.id)));
    pool = [...compounds, ...isolations];
  } else {
    pool = shuffle(getExercisesByMuscle(muscle).filter((e) => !usedIds.has(e.id)));
  }

  pool = pool.filter((e) => !usedIds.has(e.id));
  if (pool.length === 0) {
    pool = type === 'bicep'
      ? getBicepExercises()
      : type === 'tricep'
      ? getTricepExercises()
      : getExercisesByMuscle(muscle);
    pool = shuffle(pool);
  }

  const selected = pool.slice(0, count);
  selected.forEach((e) => usedIds.add(e.id));
  return selected;
}

function applyGoalParams(exercise: ExerciseDB, goal: TrainingGoal): Exercise {
  const isCardio = exercise.muscle === 'cardio';
  const isCore = exercise.muscle === 'core' && !exercise.compound;

  return {
    id: exercise.id,
    name: exercise.name,
    muscle: exercise.muscle,
    equipment: exercise.equipment,
    sets: isCardio || isCore ? exercise.defaultSets : GOAL_SETS[goal],
    reps: isCardio ? exercise.defaultReps : isCore ? exercise.defaultReps : GOAL_REPS[goal],
    rest: isCardio ? exercise.defaultRest : GOAL_REST[goal],
    notes: exercise.notes,
  };
}

export function generateRoutine(goal: TrainingGoal, days: number): Routine {
  const splitDays = SPLITS[days] ?? SPLITS[3];
  const usedIds = new Set<string>();

  const schedule: RoutineDay[] = splitDays.map((splitDay, index) => {
    const exercises: Exercise[] = [];
    for (const slot of splitDay.slots) {
      const picked = pickExercises(slot, goal, usedIds);
      exercises.push(...picked.map((e) => applyGoalParams(e, goal)));
    }
    return {
      day: index + 1,
      name: splitDay.name,
      exercises,
    };
  });

  return {
    id: generateId(),
    name: `${GOAL_NAMES[goal]} — ${days} días/semana`,
    goal,
    days,
    schedule,
    createdAt: new Date(),
  };
}
