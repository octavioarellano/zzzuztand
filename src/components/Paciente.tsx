import type { Patient } from "../types"
import PacienteDetalle from "./PacienteDetalle"
import { usePacienteStore } from '../store/store'
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useState } from "react";
import { toast } from 'react-toastify';

type PacienteProps = {
    paciente: Patient
}

const Paciente = ({ paciente }: PacienteProps) => {

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const eliminarPaciente = usePacienteStore((state) => state.eliminarPaciente)
    const establecerPacienteActivo = usePacienteStore((state) => state.establecerPacienteActivo)

    const handleClickEliminar = () => {
        setIsDeleting(true);
        try {
            const eliminado = eliminarPaciente(paciente.id);
            
            if (eliminado) {
                toast.success(`✓ Paciente "${paciente.name}" eliminado exitosamente`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                toast.error(`No se pudo encontrar el paciente: ${paciente.name}`, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            toast.error(`Error al eliminar el paciente: ${paciente.name}`, {
                position: "top-right",
                autoClose: 3000,
            });
            console.error('Error al eliminar paciente:', error);
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    }

    const handleClickEditar = () => {
        establecerPacienteActivo(paciente)
    }

    return (
        <div className="mx-5 my-10 px-5 py-10 bg-gray-800 shadow-lg rounded-xl border border-red-900">
            <PacienteDetalle label="ID" data={paciente.id} />
            <PacienteDetalle label="Nombre" data={paciente.name} />
            <PacienteDetalle label="Propietario" data={paciente.caretaker} />
            <PacienteDetalle label="Email" data={paciente.email} />
            <PacienteDetalle label="Fecha Alta" data={paciente.date || ''} />
            <PacienteDetalle label="Síntomas" data={paciente.symptoms} />

            <div className="flex flex-col lg:flex-row gap-3 justify-between mt-10">
                <button
                    type="button"
                    className="py-2 px-10 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-lg transition-all duration-200"
                    onClick={handleClickEditar}
                >Editar</button>

                <button
                    type="button"
                    className="py-2 px-10 bg-red-700 hover:bg-red-800 text-white font-bold uppercase rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Eliminando..." : "Eliminar"}
                </button>
            </div>

            <DeleteConfirmationModal
                isOpened={isDeleteModalOpen}
                paciente={paciente}
                onConfirm={handleClickEliminar}
                onCancel={() => setIsDeleteModalOpen(false)}
                isLoading={isDeleting}
            />
        </div>
    )
}

export default Paciente