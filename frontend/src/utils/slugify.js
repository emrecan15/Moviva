// src/utils/slugify.js
export const slugify = (text) => {
  if (!text) return "";

  const trMap = {
    ç: "c",
    ğ: "g",
    ş: "s",
    ü: "u",
    ı: "i",
    ö: "o",
    Ç: "c",
    Ğ: "g",
    Ş: "s",
    Ü: "u",
    İ: "i",
    Ö: "o",
  };

  return (
    text
      // Türkçe karakterleri bul ve sözlükten İngilizce karşılığıyla değiştir
      .replace(/[çğşüıöÇĞŞÜİÖ]/g, (match) => trMap[match])
      // Her şeyi küçük harf yap
      .toLowerCase()
  );
};
