import { useToast } from "@/providers/ToastContext";
import { Toast } from "@toss/tds-mobile";

export const ToastManager = () => {
  const { data, closeToast } = useToast();

  return (
    <Toast
      position={data.button ? "bottom" : "top"}
      open={data.open}
      text={data.text}
      duration={3000}
      onClose={() => closeToast()}
      button={
        data.button ? (
          <Toast.Button onClick={data.button.onClick}>
            {data.button.label}
          </Toast.Button>
        ) : undefined
      }
    />
  );
};
