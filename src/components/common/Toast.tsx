import React from "react";
import { ToastNotification } from "@carbon/react";
import styles from "@/styles/components/toast.module.scss";

type ToastProps = {
  kind: "error" | "info" | "success" | "warning";
  title: string;
  subtitle?: string;
  onClose: () => void;
};

const Toast: React.FC<ToastProps> = ({ kind, title, subtitle, onClose }) => {
  return (
    <div className={styles.container}>
      <ToastNotification
        kind={kind}
        title={title}
        subtitle={subtitle}
        onCloseButtonClick={onClose}
        timeout={5000}
        caption=""
        lowContrast
      />
    </div>
  );
};

export default Toast;
