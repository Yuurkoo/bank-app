import React from "react";

type EmailInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
};

export function FieldEmail({ value, onChange, error }: EmailInputProps) {
  return (
    <div>
      <label>Email:</label>
      <input
        type="email"
        name="email"
        placeholder="email"
        value={value}
        onChange={onChange}
      />
      {error && (
        <p className="error-message">Please enter a valid email address</p>
      )}
    </div>
  );
}
