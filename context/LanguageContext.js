"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "ok_lang";

const dictionaries = {
  en: {
    home: "Home",
    catalog: "Product Catalog",
    opticalGlasses: "Optical Glasses",
    contactLenses: "Contact Lenses",
    cart: "Cart",
    login: "Login",
    logout: "Logout",
    admin: "Admin",
    myAccount: "My Account",
    hi: "Hi",
    menu: "Menu",
    navigation: "Navigation",
    account: "Account",
    myOrders: "My Orders",
    registerAccount: "Create Account",
    operatingHours: "Operating Hours",
    location: "Location",
    mapLocation: "Map Location",
    allRightsReserved: "All rights reserved.",
  },
  id: {
    home: "Home",
    catalog: "Katalog Produk",
    opticalGlasses: "Kacamata Optik",
    contactLenses: "Lensa Kontak",
    cart: "Keranjang",
    login: "Masuk",
    logout: "Keluar",
    admin: "Admin",
    myAccount: "Akun Saya",
    hi: "Halo",
    menu: "Menu",
    navigation: "Navigasi",
    account: "Akun",
    myOrders: "Pesanan Saya",
    registerAccount: "Daftar Akun",
    operatingHours: "Jam Operasional",
    location: "Lokasi",
    mapLocation: "Peta Lokasi",
    allRightsReserved: "Seluruh hak cipta dilindungi.",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // Default is English; only switches if the visitor previously chose otherwise.
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "id") {
      setLangState(stored);
    } else {
      window.localStorage.setItem(STORAGE_KEY, "en");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(next) {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  function toggleLang() {
    setLang(lang === "en" ? "id" : "en");
  }

  function t(key) {
    return dictionaries[lang][key] ?? dictionaries.en[key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
