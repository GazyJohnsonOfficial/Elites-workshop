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
          onClick={(e) => {
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
              maxWidth: "1120px",
              background: "transparent",
              position: "relative",
              margin: "auto",
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
                top: "-14px",
                right: "-14px",
                zIndex: 40,
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "#121316",
                border: "3px solid #ffffff",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(0,0,0,0.32)",
              }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <AcademyAuthPanel
              initialAuthMode={initialMode}
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
