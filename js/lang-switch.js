// language-switch.js

function switchLanguage() {
    const currentLang = document.documentElement.lang;
    if (currentLang === "en") {
      window.location.href = "expoAR.html"; // Redirect to Arabic version
    } else {
      window.location.href = "expoEN.html"; // Redirect to English version
    }
  }
  