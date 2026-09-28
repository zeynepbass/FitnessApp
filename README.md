# FitnessApp

React Native ve Expo ile geliştirilmiş, günlük adım, kalori ve mesafe takibi yapan bir mobil fitness uygulaması.

## Özellikler

- Firebase Authentication ile kayıt ve giriş
- Pedometre ile günlük adım, kalori ve mesafe takibi
- Adım ve kalori hedefi belirleme
- Son 7 günün aktivite geçmişi ve gün bazlı filtreleme
- Günlük adım dağılımını gösteren pasta grafik
- Profil düzenleme (yaş, boy, kilo, fotoğraf)
- Günlük motivasyon ve hareketsizlik bildirimleri

## Kullanılan Teknolojiler

- React Native
- Expo (SDK 54)
- Firebase Authentication
- Cloud Firestore
- React Navigation
- AsyncStorage
- Expo Sensors (Pedometer)
- Expo Notifications
- Expo Image Picker
- React Native Chart Kit

## Kurulum

```bash
git clone https://github.com/zeynepbass/FitnessApp.git
cd FitnessApp
npm install
cp .env.example .env
```

`.env` dosyasına Firebase proje bilgilerini girdikten sonra uygulamayı başlat:

```bash
npm start
```

## Ekran Görüntüleri

<p align="center">
  <img src="./assets/screenshots/1761050933130.jpeg" width="900">
  <img src="./assets/screenshots/1761050932522.jpeg" width="900">
  <img src="./assets/screenshots/1761050929737.jpeg" width="900">
  <img src="./assets/screenshots/1761050929560.jpeg" width="900">
  <img src="./assets/screenshots/1761050929211.jpeg" width="900">
  <img src="./assets/screenshots/1761050929079.jpeg" width="900">
  <img src="./assets/screenshots/1761050928504.jpeg" width="900">
  <img src="./assets/screenshots/1761050928471.jpeg" width="900">
</p>

## Lisans

Bu proje [LICENCE](./LICENCE) dosyasındaki lisans ile dağıtılmaktadır.
