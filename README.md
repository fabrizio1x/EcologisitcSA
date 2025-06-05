# EcologisticSA

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

App logística desarrollada con **Angular**, **Ionic** y **Firebase**.

## 🚚 Descripción
EcologisticSA es una plataforma móvil y web para la gestión de pedidos y logística, con roles como chofer, secretaria y cliente. Permite asignar, visualizar y gestionar pedidos de manera eficiente y segura.

## 🛠️ Tecnologías principales
- Angular
- Ionic
- Firebase / Firestore
- SCSS

## 📱 Características
- Gestión de usuarios y roles (chofer, secretaria, cliente)
- Visualización y asignación de pedidos
- Interfaz optimizada para dispositivos móviles
- Seguridad y protección de datos

## 🚀 Instalación rápida
1. Clona el repositorio:
   ```sh
   git clone https://github.com/fabrizio1x/EcologisitcSA.git
   cd EcologisitcSA
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```

## 🔑 Configuración de Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/) y crea un proyecto.
2. Crea una app web y copia la configuración de Firebase.
3. Crea los archivos:
   - `src/environments/environment.ts`
   - `src/environments/environment.prod.ts`
   Puedes usar como base los archivos:
   - `src/environments/environment.example.ts`
   - `src/environments/environment.prod.example.ts`
4. Pega tus credenciales en los archivos nuevos siguiendo el formato de los ejemplos.
5. Más detalles en `FIREBASE_SETUP.txt`.

## 🏃‍♂️ Ejecución
Para desarrollo:
```sh
ionic serve
```

Para producción:
```sh
ionic build --prod
```

## 🤝 Contribuciones
¡Las contribuciones son bienvenidas! Por favor, abre un issue o un pull request para sugerencias o mejoras. Consulta la [guía de contribución](CONTRIBUTING.md).

## ⚠️ Notas de seguridad
- **No subas tus archivos `environment.ts` ni `environment.prod.ts` a ningún repositorio público.**
- Este proyecto incluye archivos de ejemplo y un instructivo para conectar tu propio backend de Firebase.

## 📸 Capturas de pantalla
_Agrega aquí tus imágenes o GIFs de la app en funcionamiento_

## ⚖️ Licencia
Este proyecto está bajo la licencia [MIT](LICENSE).

---

**Desarrollado por Fabrizio y colaboradores.** 