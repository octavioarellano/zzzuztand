type DetallePacienteProps = {
    label: string
    data?: string | null
}
export default function PacienteDetalle({label, data} : DetallePacienteProps) {
    const value = (data && data.trim().length > 0) ? data : 'No especificado'
    console.log(`📝 ${label}:`, data, '-> mostrado como:', value)

    return (
        <p className="font-bold mb-3 text-red-400 uppercase">{label}: {''}
            <span className="font-normal normal-case text-gray-300">{value}</span>
        </p>
    )
}