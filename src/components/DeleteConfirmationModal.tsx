import { useRef, useEffect, type MouseEvent } from "react";
import styled from "styled-components";
import type { Patient } from "../types";

const Container = styled.dialog`
  width: 450px;
  max-width: 90%;
  border-radius: 12px;
  border: 2px solid #dc2626;
  padding: 2.5rem;
  background-color: #1f2937;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;

  &[open] {
    display: block;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translate(-50%, -48%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: #ef4444;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  p {
    color: #d1d5db;
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
  }

  ::backdrop {
    background: rgba(0, 0, 0, 0.85);
  }
`;

const WarningIcon = styled.span`
  font-size: 1.75rem;
`;

const PatientInfo = styled.div`
  background-color: #111827;
  border-left: 4px solid #dc2626;
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 6px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #9ca3af;
    letter-spacing: 0.05em;
  }

  span {
    color: #f3f4f6;
    font-weight: 500;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 2rem;

  button {
    padding: 0.75rem 1.75rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &:first-child {
      background-color: #ef4444;
      color: white;
      
      &:hover {
        background-color: #dc2626;
        box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3);
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    &:last-child {
      background-color: #374151;
      color: #f3f4f6;
      border: 1px solid #4b5563;

      &:hover {
        background-color: #4b5563;
        border-color: #6b7280;
      }
    }
  }
`;

const isClickInsideRectangle = (e: MouseEvent, element: HTMLElement) => {
  const r = element.getBoundingClientRect();
  return (
    e.clientX > r.left &&
    e.clientX < r.right &&
    e.clientY > r.top &&
    e.clientY < r.bottom
  );
};

type DeleteConfirmationModalProps = {
  isOpened: boolean;
  paciente: Patient | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

const DeleteConfirmationModal = ({
  isOpened,
  paciente,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmationModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpened) {
      ref.current?.showModal();
      document.body.classList.add("modal-open");
    } else {
      ref.current?.close();
      document.body.classList.remove("modal-open");
    }
  }, [isOpened]);

  const handleConfirm = () => {
    onConfirm();
    onCancel();
  };

  if (!paciente) return null;

  return (
    <Container
      ref={ref}
      onCancel={onCancel}
      onClick={(e) =>
        ref.current && !isClickInsideRectangle(e, ref.current) && onCancel()
      }
    >
      <h3>
        <WarningIcon>⚠️</WarningIcon>
        Confirmar Eliminación
      </h3>

      <p>Estás a punto de eliminar el siguiente paciente de forma permanente:</p>

      {paciente && (
        <PatientInfo>
          <InfoItem>
            <label>Nombre</label>
            <span>{paciente.name}</span>
          </InfoItem>
          <InfoItem>
            <label>Propietario</label>
            <span>{paciente.caretaker}</span>
          </InfoItem>
          <InfoItem>
            <label>Email</label>
            <span>{paciente.email}</span>
          </InfoItem>
          <InfoItem>
            <label>ID</label>
            <span>{paciente.id.slice(0, 8)}...</span>
          </InfoItem>
        </PatientInfo>
      )}

      <p style={{ marginTop: "1.5rem", color: "#fca5a5", fontWeight: 500 }}>
        Esta acción no se puede deshacer.
      </p>

      <Buttons>
        <button onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? "Eliminando..." : "Sí, eliminar"}
        </button>
        <button onClick={onCancel} disabled={isLoading}>
          Cancelar
        </button>
      </Buttons>
    </Container>
  );
};

export default DeleteConfirmationModal;
