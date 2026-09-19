"use client";
import GuestActions from "./GuestActions";
import UserMenu from "./UserMenu";
export default function AuthSection({ auth, onLoginClick, setView }) {
  const isAuthenticated = auth?.authenticated ?? false;
  return (
    <>
      {isAuthenticated ? (
        <UserMenu auth={auth} />
      ) : (
        <GuestActions onLoginClick={onLoginClick} setView={setView} />
      )}
    </>
  );
}
