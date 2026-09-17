import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = "540px"
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      padding: "20px"
    }}
    onClick={onClose}
    >
      <div
        style={{
          background: "#0F1626",
          border: "1px solid var(--border-strong)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: width,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#FFFFFF" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "none",
              borderRadius: "8px",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94A3B8",
              cursor: "pointer"
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: "24px" }}>
          {children}
        </div>
      </div>
    </div>
  );
};
