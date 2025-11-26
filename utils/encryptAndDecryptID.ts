export function encryptID(id: any) {
  return btoa(id);
}

export function decryptID(encryptedString: string) {
  return Number(atob(encryptedString));
}
