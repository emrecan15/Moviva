import { useState } from "react";
import Button from "../../ui/Button";
import { AUTH_VIEW } from "../../auth/constants/auth";
import { FiLogIn, FiUserPlus } from "react-icons/fi";

export default function GuestActions({ onLoginClick, setView }) {
  return (
    <div className="flex gap-2">
      <Button
        text="Giriş Yap"
        icon={<FiLogIn />}
        onClick={() => {
          onLoginClick?.();
          setView(AUTH_VIEW.LOGIN);
        }}
      />
      <Button
        text="Kayıt Ol"
        icon={<FiUserPlus />}
        onClick={() => {
          onLoginClick?.();
          setView(AUTH_VIEW.REGISTER);
        }}
      />
    </div>
  );
}
