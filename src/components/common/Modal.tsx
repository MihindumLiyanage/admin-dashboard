import React from "react";
import { Modal } from "@carbon/react";
import styles from "@/styles/components/modal.module.scss";

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryAction?: () => void;
  primaryButtonDisabled?: boolean;
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
}

const GenericModal: React.FC<GenericModalProps> = ({
  isOpen,
  onClose,
  title,
  primaryButtonText = "Confirm",
  secondaryButtonText = "Cancel",
  onPrimaryAction,
  primaryButtonDisabled = false,
  children,
  size = "sm",
}) => {
  return (
    <Modal
      open={isOpen}
      onRequestClose={onClose}
      modalHeading={title}
      primaryButtonText={primaryButtonText}
      secondaryButtonText={secondaryButtonText}
      onRequestSubmit={onPrimaryAction}
      primaryButtonDisabled={primaryButtonDisabled}
      size={size}
      className={styles.modal}
    >
      {children}
    </Modal>
  );
};

export default GenericModal;
