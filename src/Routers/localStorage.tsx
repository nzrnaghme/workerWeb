import { useEffect, useState } from "react";

export const removeLocalStorage = (nameLocal: string) => {
  localStorage.removeItem(nameLocal);
  return;
};

export const showLocalStorage = (nameLocal: string) => {
  const storageJSON = localStorage.getItem(nameLocal);
  if (storageJSON) {
    try {
      const openencryptingData = decodeURIComponent(
        escape(window.atob(storageJSON))
      );
      if (openencryptingData) return JSON.parse(openencryptingData);
    } catch (error) {
      removeLocalStorage(nameLocal);
      window.location.reload();
    }
  }
  return null;
};

export const addLocalStorage = (localItem: string, namelocal: string) => {
  const encryptingData = window.btoa(unescape(encodeURIComponent(localItem)));
  localStorage.setItem(namelocal, encryptingData);
  return;
};
