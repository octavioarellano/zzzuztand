import Formulario from "./components/Formulario"
import ListadoPacientes from "./components/ListadoPacientes"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


function App() {

  return (
    <>
      <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto mt-20 pb-20">
          <h1 className="font-black text-5xl text-center md:w-2/3 md:mx-auto text-gray-100">
            Seguimiento de Pacientes {''}
            <span className="text-red-500">Veterinaria</span>
          </h1>

          <div className="mt-12 md:flex">
              <Formulario />
              <ListadoPacientes />
          </div>
      </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App