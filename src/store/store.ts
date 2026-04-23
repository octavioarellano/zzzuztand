import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DraftPatient, Patient } from '../types'
import { v4 as uuidv4 } from 'uuid'


// 1. Definir el tipo del estado
type PacientesState = {
    // Estados
    pacientes: Patient[];
    pacienteActivo: Patient | null;
    
    // Funciones
    agregarPaciente: (data: DraftPatient) => void;
    eliminarPaciente: (id: Patient['id']) => boolean;
    obtenerPaciente: (id: Patient['id']) => Patient | undefined;
    establecerPacienteActivo: (paciente: Patient) => void;
    actualizarPaciente: (data: DraftPatient) => void;
    limpiarPacienteActivo: () => void;
}


// 2. Función auxiliar para crear un paciente con ID
const crearPaciente = (data: DraftPatient): Patient => {
    console.log('🏥 Creando paciente con datos:', data)
    return {
        id: uuidv4(),
        ...data
    }
}


// 3. Crear el store
export const usePacienteStore = create<PacientesState>(
  persist(
    (set, get) => ({
    pacientes: [],
    pacienteActivo: null,
    
    agregarPaciente: (data) => set((state) => ({
        pacientes: [...state.pacientes, crearPaciente(data)]
    })),

    eliminarPaciente: (id) => {
        // Validar que el paciente existe
        const paciente = get().pacientes.find(p => p.id === id);
        if (!paciente) {
            console.warn(`Paciente con ID ${id} no encontrado`);
            return false;
        }

        // Eliminar el paciente del estado
        set((state) => ({
            pacientes: state.pacientes.filter(paciente => paciente.id !== id)
        }));

        return true;
    },

    obtenerPaciente: (id) => {
        return get().pacientes.find(paciente => paciente.id === id);
    },

    establecerPacienteActivo: (paciente) => {
        set({ pacienteActivo: paciente });
    },

    actualizarPaciente: (data) => {
        set((state) => ({
            pacientes: state.pacientes.map(paciente =>
                paciente.id === state.pacienteActivo?.id
                    ? { id: paciente.id, ...data }
                    : paciente
            ),
            pacienteActivo: null
        }));
    },

    limpiarPacienteActivo: () => {
        set({ pacienteActivo: null });
    }
    }),
    {
      name: 'pacientes-storage',
      partialize: (state) => ({
        pacientes: state.pacientes
        // pacienteActivo NO se incluye -> no se persiste
      }),
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name)
          return str ? JSON.parse(str) : null
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
)

