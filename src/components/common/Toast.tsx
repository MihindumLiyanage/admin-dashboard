import React from "react";
import { ToastNotification } from "@carbon/react";

type ToastProps = {
  kind: "error" | "info" | "success" | "warning";
  title: string;
  subtitle?: string;
  onClose: () => void;
};

const Toast: React.FC<ToastProps> = ({ kind, title, subtitle, onClose }) => {
  return (
    <ToastNotification
      kind={kind}
      title={title}
      subtitle={subtitle}
      onCloseButtonClick={onClose}
      timeout={5000}
      caption=""
      lowContrast
    />
  );
};

export default Toast;
