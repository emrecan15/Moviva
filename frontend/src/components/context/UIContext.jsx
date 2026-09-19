"use client";

import { createContext, useContext, useState } from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const openRecommendModal = () => {
    setIsRecommendModalOpen(true);
  };

  const closeRecommendModal = () => {
    setIsRecommendModalOpen(false);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
  };

  const hideSuccess = () => {
    setSuccessMessage("");
  };

  return (
    <UIContext.Provider
      value={{
        isRecommendModalOpen,
        openRecommendModal,
        closeRecommendModal,
        successMessage,
        showSuccess,
        hideSuccess,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("useUI must be used inside UIProvider");
  }

  return context;
}
