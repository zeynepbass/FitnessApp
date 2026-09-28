const messages = {
  "auth/email-already-in-use": "Bu email adresi zaten kullanılıyor.",
  "auth/invalid-email": "Geçersiz email adresi.",
  "auth/weak-password": "Parola en az 6 karakter olmalı.",
  "auth/invalid-credential": "Email veya parola hatalı.",
  "auth/user-not-found": "Email veya parola hatalı.",
  "auth/wrong-password": "Email veya parola hatalı.",
  "auth/too-many-requests": "Çok fazla deneme yapıldı, lütfen daha sonra tekrar deneyin.",
  "auth/network-request-failed": "İnternet bağlantınızı kontrol edin.",
};

export const getAuthErrorMessage = (error, fallback) => messages[error?.code] ?? fallback;
