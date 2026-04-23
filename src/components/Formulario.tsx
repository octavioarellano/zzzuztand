import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Error from './Error'
import { usePacienteStore } from '../store/store'
import type { DraftPatient } from '../types'
import {toast} from "react-toastify";


const Formulario = () => {

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<DraftPatient>({
        defaultValues: {
            name: '',
            caretaker: '',
            email: '',
            date: '',
            symptoms: ''
        }
    })
    
    const formValues = watch()
    useEffect(() => {
        console.log('👀 Valores en tiempo real:', formValues)
    }, [formValues])
    const pacienteActivo = usePacienteStore((state) => state.pacienteActivo)
    const actualizarPaciente = usePacienteStore((state) => state.actualizarPaciente)
    const limpiarPacienteActivo = usePacienteStore((state) => state.limpiarPacienteActivo)

    useEffect(() => {
        if (pacienteActivo) {
            console.log('📝 Llenando formulario con:', pacienteActivo)
            reset({
                name: pacienteActivo.name,
                caretaker: pacienteActivo.caretaker,
                email: pacienteActivo.email,
                date: pacienteActivo.date,
                symptoms: pacienteActivo.symptoms
            })
        } else {
            console.log('🧹 Limpiando formulario')
            reset()
        }
    }, [pacienteActivo, reset])

    const registrarPaciente = (data: DraftPatient) => {
        console.log('📋 Datos completos a guardar:', JSON.stringify(data, null, 2))
        console.log('Tipo:', typeof data, 'Keys:', Object.keys(data))
        if (pacienteActivo) {
            // Modo edición
            console.log('✏️ Actualizando paciente con ID:', pacienteActivo.id)
            actualizarPaciente(data)
            toast.success(`Paciente ${data.name} actualizado correctamente`)
        } else {
            // Modo creación
            console.log('➕ Agregando nuevo paciente')
            usePacienteStore.getState().agregarPaciente(data)
            toast.success(`Paciente ${data.name} registrado correctamente`)
            reset()
        }
        console.log('📦 Estado del store después de guardar:', usePacienteStore.getState().pacientes)
    }

    const handleCancelar = () => {
        limpiarPacienteActivo()
    }



    return (
    <div className="md:w-1/2 lg:w-2/5 mx-5">
        <h2 className="font-black text-3xl text-center text-red-500">Seguimiento Pacientes</h2>

        <p className="text-lg mt-5 text-center mb-10 text-gray-300">
            {pacienteActivo ? 'Edita Pacientes y ' : 'Añade Pacientes y '}
            <span className="text-red-400 font-bold">Administralos</span>
        </p>

        <form 
            className="bg-gray-800 shadow-lg rounded-lg py-10 px-5 mb-10 border border-red-900"
            noValidate
            onSubmit={handleSubmit(registrarPaciente)}
        >
              <div className="mb-5">
                  <label htmlFor="name" className="text-sm uppercase font-bold text-red-400">
                      Paciente 
                  </label>
                  <input  
                      id="name"
                      className="w-full p-3 bg-gray-700 border border-red-800 text-gray-100 placeholder-gray-500 focus:border-red-500 focus:outline-none"  
                      type="text" 
                      placeholder="Nombre del Paciente" 
                      {...register('name', {
                            required: 'El nombre del paciente es obligatorio',
                            minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' }

                      })}
                    />
                    {errors.name && 
                        <Error>{errors.name?.message?.toString()}</Error>
                    }

              </div>

              <div className="mb-5">
                <label htmlFor="caretaker" className="text-sm uppercase font-bold text-red-400">
                    Propietario 
                </label>
                <input  
                    id="caretaker"
                    className="w-full p-3 bg-gray-700 border border-red-800 text-gray-100 placeholder-gray-500 focus:border-red-500 focus:outline-none"  
                    type="text" 
                    placeholder="Nombre del Propietario" 
                    {...register('caretaker', {
                            required: 'El nombre del propietario es obligatorio',
                            minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' }

                      })}
                />
                {errors.caretaker && 
                        <Error>{errors.caretaker?.message?.toString()}</Error>
                }
              </div>

            <div className="mb-5">
              <label htmlFor="email" className="text-sm uppercase font-bold text-red-400">
                  Email 
              </label>
              <input  
                  id="email"
                  className="w-full p-3 bg-gray-700 border border-red-800 text-gray-100 placeholder-gray-500 focus:border-red-500 focus:outline-none"  
                  type="email" 
                  placeholder="Email de Registro" 
                  {...register('email', {
                            required: 'El email es obligatorio',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email no válido' 

                            }
                      })}
                />
                {errors.email && 
                            <Error>{errors.email?.message?.toString()}</Error>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="date" className="text-sm uppercase font-bold text-red-400">
                    Fecha Alta 
                </label>
                <input  
                    id="date"
                    className="w-full p-3 bg-gray-700 border border-red-800 text-gray-100 placeholder-gray-500 focus:border-red-500 focus:outline-none"  
                    type="date"
                    {...register('date', {
                        required: 'La fecha de alta es obligatoria'
                    })}
                />
                {errors.date && 
                    <Error>{errors.date?.message?.toString()}</Error>
                }
            </div>
            
            <div className="mb-5">
                <label htmlFor="symptoms" className="text-sm uppercase font-bold text-red-400">
                Síntomas 
                </label>
                <textarea  
                    id="symptoms"
                    className="w-full p-3 bg-gray-700 border border-red-800 text-gray-100 placeholder-gray-500 focus:border-red-500 focus:outline-none resize-none"  
                    placeholder="Síntomas del paciente"
                    {...register('symptoms', {
                        required: 'Los síntomas son obligatorios'
                    })}
                ></textarea>
                {errors.symptoms && 
                    <Error>{errors.symptoms?.message?.toString()}</Error>
                }
            </div>

            <div className="flex gap-3">
                <input
                    type="submit"
                    className="bg-red-600 w-full p-3 text-white uppercase font-bold hover:bg-red-700 cursor-pointer transition-colors rounded-lg"
                    value={pacienteActivo ? 'Editar Paciente' : 'Guardar Paciente'}
                />
                {pacienteActivo && (
                    <button
                        type="button"
                        onClick={handleCancelar}
                        className="bg-gray-600 w-full p-3 text-white uppercase font-bold hover:bg-gray-700 cursor-pointer transition-colors rounded-lg"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form> 
    </div>
  )

}

export default Formulario