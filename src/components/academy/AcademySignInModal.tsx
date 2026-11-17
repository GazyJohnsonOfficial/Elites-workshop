"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { AcademyAuthPanel } from "./AcademyAuthPanel";

export interface AcademySessionUser {
  userId: string;
  email: string;
  fullName: string;
  role: "learner" | "org_admin" | "staff_admin";
  organizationId?: string;
}

export function AcademySignInModal({
  open,
  initialMode = "signin",
  onClose,
  onAuthenticated,
}: {
  open: boolean;
  initialMode?: "signin" | "register";
  onClose: () => void;
  onAuthenticated: (user: AcademySessionUser) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="acad-modal-backdrop"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) onClose();
          }}
          style={{
            padding: "20px",
            overflowY: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            style={{
              width: "100%",
              maxWidth: "580px",
              background: "#ffffff",
              borderRadius: "16px",
              position: "relative",
              margin: "auto",
              boxShadow: "0 24px 60px rgba(10, 26, 64, 0.28)",
              overflow: "hidden",
            }}
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                zIndex: 40,
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                color: "#475569",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            <AcademyAuthPanel
              initialAuthMode={initialMode}
              variant="modal"
              onAuthenticated={(user) => {
                onAuthenticated(user);
                onClose();
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
