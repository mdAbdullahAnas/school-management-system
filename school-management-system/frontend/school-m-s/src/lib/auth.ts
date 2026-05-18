"use client";

import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=86400; SameSite=Lax`;
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  const localToken = localStorage.getItem(TOKEN_KEY);
  if (localToken) return localToken;

  // Fallback to cookies if localStorage is empty (e.g. on SSR or first load)
  const name = TOKEN_KEY + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
};

export const decodeToken = (token: string): any => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded?.role || null;
};