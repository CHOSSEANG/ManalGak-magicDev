import { InputHTMLAttributes } from "react";

// eslint: empty interface removed to satisfy lint
type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
  return <input {...props} />;
}
