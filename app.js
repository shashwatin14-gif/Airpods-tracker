// =====================================================
// AIRPODS FINDER - COMPLETE APP.JS
// Firebase + Smart Search + Alarm + Notifications
// Multilingual AI Chatbot
// =====================================================

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { db } from "./firebase-config.js";


// =====================================================
// 1. FIRESTORE COLLECTION
// =====================================================

const locationsRef = collection(
  db,
  "airpods_locations"
);


// =====================================================
// 2. HTML ELEMENTS
// =====================================================

// Save form
const logForm = document.getElementById("log-form");
const locationInput = document.getElementById("location");
const noteInput = document.getElementById("note");
const photoInput = document.getElementById("photoInput");
const photoPreview = document.getElementById("photoPreview");

// Room
const roomButtons = document.querySelectorAll(".room");
const selectedRoomText = document.getElementById("selectedRoom");

// Latest location
const latestLocation = document.getElementById("latestLocation");

// History
const locationsList = document.getElementById("locations-list");
const showAllBtn = document.getElementById("showAllBtn");

// Search
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Notification
const notificationBtn = document.getElementById("notificationBtn");

// Website notification
const notificationPreview =
  document.getElementById("notificationPreview");

const notificationPreviewText =
  document.getElementById("notificationPreviewText");

// Alarm
const alarmSound = document.getElementById("airpodsAlarm");
const startAlarm = document.getElementById("startAlarm");
const stopAlarm = document.getElementById("stopAlarm");
const alarmStatus = document.getElementById("alarmStatus");

// Smart hint
const hintText = document.getElementById("hintText");
const hintReason = document.getElementById("hintReason");

// Chatbot
const chatToggle = document.getElementById("chatToggle");
const chatbot = document.getElementById("chatbot");
const closeChat = document.getElementById("closeChat");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");


// =====================================================
// LANGUAGE SELECTOR
// =====================================================

const languageButton = document.getElementById("languageButton");
const languageOptions = document.getElementById("languageOptions");

let selectedLanguage = "en";

const languageNames = {
  en: "EN",
  ta: "தமிழ்",
  te: "తెలుగు",
  hi: "हिन्दी",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം"
};


// OPEN LANGUAGE MENU
if (languageButton && languageOptions) {

  languageButton.addEventListener("click", (event) => {
    event.stopPropagation();

    languageOptions.classList.toggle("active");
  });


  // SELECT LANGUAGE
  languageOptions.querySelectorAll("button").forEach((button) => {

    button.addEventListener("click", (event) => {

      event.stopPropagation();

      const lang = button.dataset.lang;

      if (!lang) return;

      selectedLanguage = lang;

      languageButton.textContent = languageNames[lang];

      languageOptions
        .querySelectorAll("button")
        .forEach((btn) => {
          btn.classList.remove("active");
        });

      button.classList.add("active");

      languageOptions.classList.remove("active");

      console.log("Selected language:", selectedLanguage);
    });

  });


  // CLOSE MENU WHEN CLICKING OUTSIDE
  document.addEventListener("click", () => {
    languageOptions.classList.remove("active");
  });

}

// Language
const languageButton =
  document.getElementById("languageButton");

const languageOptions =
  document.getElementById("languageOptions");


// =====================================================
// 3. GLOBAL VARIABLES
// =====================================================

let allLocations = [];
let selectedLanguage = "en";
let selectedPhoto = "";


// =====================================================
// 4. LANGUAGE TEXT
// =====================================================

const chatText = {

  en: {
    placeholder: "Ask something...",

    welcome:
      "👋 Hi! I'm your AirPods AI Assistant.<br><br>Ask me where you last kept your AirPods.",

    empty:
      "You have not saved any AirPods locations yet.",

    greeting:
      "Hello! 👋 Tell me what you want to know about your AirPods.",

    thank:
      "You're welcome! 😊",

    latest:
      "📍 Your AirPods were last recorded at",

    notFound:
      "I couldn't find that location.",

    usual:
      "💡 You usually keep your AirPods here.",

    history:
      "📜 You have saved",

    saved:
      "location records.",

    cantFind:
      "If you cannot find your AirPods, check",

    unknown:
      "I didn't understand that. Try asking: Where are my AirPods?"
  },


  ta: {
    placeholder: "ஏதாவது கேளுங்கள்...",

    welcome:
      "👋 வணக்கம்! நான் உங்கள் AirPods AI Assistant.<br><br>உங்கள் AirPods-ஐ கடைசியாக எங்கு வைத்தீர்கள் என்று கேளுங்கள்.",

    empty:
      "இதுவரை எந்த AirPods location-உம் சேமிக்கப்படவில்லை.",

    greeting:
      "வணக்கம்! 👋 உங்கள் AirPods பற்றி என்ன தெரிந்துகொள்ள வேண்டும்?",

    thank:
      "வரவேற்கிறேன்! 😊",

    latest:
      "📍 உங்கள் AirPods கடைசியாக இங்கே பதிவு செய்யப்பட்டது:",

    notFound:
      "அந்த இடம் கிடைக்கவில்லை.",

    usual:
      "💡 நீங்கள் பொதுவாக AirPods-ஐ இங்கே வைத்திருப்பீர்கள்.",

    history:
      "📜 நீங்கள் சேமித்துள்ள",

    saved:
      "location பதிவுகள் உள்ளன.",

    cantFind:
      "AirPods கிடைக்கவில்லை என்றால் இங்கே பாருங்கள்:",

    unknown:
      "புரியவில்லை. உங்கள் AirPods எங்கே என்று கேளுங்கள்."
  },


  te: {
    placeholder: "ఏదైనా అడగండి...",

    welcome:
      "👋 నమస్తే! నేను మీ AirPods AI Assistant.<br><br>మీ AirPods చివరిసారిగా ఎక్కడ పెట్టారో అడగండి.",

    empty:
      "ఇంకా AirPods location ఏదీ సేవ్ చేయలేదు.",

    greeting:
      "నమస్తే! 👋 మీ AirPods గురించి ఏమి తెలుసుకోవాలి?",

    thank:
      "మీకు స్వాగతం! 😊",

    latest:
      "📍 మీ AirPods చివరిసారిగా ఇక్కడ నమోదు చేయబడ్డాయి:",

    notFound:
      "ఆ location కనుగొనలేకపోయాను.",

    usual:
      "💡 మీరు సాధారణంగా AirPods‌ను ఇక్కడ ఉంచుతారు.",

    history:
      "📜 మీరు సేవ్ చేసిన",

    saved:
      "location records ఉన్నాయి.",

    cantFind:
      "AirPods కనిపించకపోతే ఇక్కడ చూడండి:",

    unknown:
      "నాకు అర్థం కాలేదు. మీ AirPods ఎక్కడ ఉన్నాయో అడగండి."
  },


  hi: {
    placeholder: "कुछ पूछें...",

    welcome:
      "👋 नमस्ते! मैं आपका AirPods AI Assistant हूँ।<br><br>पूछें कि आपने अपने AirPods आखिरी बार कहाँ रखे थे।",

    empty:
      "अभी तक कोई AirPods location सेव नहीं की गई है।",

    greeting:
      "नमस्ते! 👋 आप अपने AirPods के बारे में क्या जानना चाहते हैं?",

    thank:
      "आपका स्वागत है! 😊",

    latest:
      "📍 आपके AirPods आखिरी बार यहाँ रिकॉर्ड किए गए थे:",

    notFound:
      "मुझे वह location नहीं मिली।",

    usual:
      "💡 आप आमतौर पर अपने AirPods यहाँ रखते हैं।",

    history:
      "📜 आपने सेव किए हैं",

    saved:
      "location records।",

    cantFind:
      "अगर AirPods नहीं मिल रहे हैं तो यहाँ देखें:",

    unknown:
      "मुझे समझ नहीं आया। पूछें कि आपके AirPods कहाँ हैं।"
  },


  kn: {
    placeholder: "ಏನಾದರೂ ಕೇಳಿ...",

    welcome:
      "👋 ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AirPods AI Assistant.<br><br>ನಿಮ್ಮ AirPods ಅನ್ನು ಕೊನೆಯದಾಗಿ ಎಲ್ಲಿ ಇಟ್ಟಿದ್ದೀರಿ ಎಂದು ಕೇಳಿ.",

    empty:
      "ಇನ್ನೂ ಯಾವುದೇ AirPods location ಉಳಿಸಲಾಗಿಲ್ಲ.",

    greeting:
      "ನಮಸ್ಕಾರ! 👋 ನಿಮ್ಮ AirPods ಬಗ್ಗೆ ಏನು ತಿಳಿದುಕೊಳ್ಳಬೇಕು?",

    thank:
      "ಸ್ವಾಗತ! 😊",

    latest:
      "📍 ನಿಮ್ಮ AirPods ಕೊನೆಯದಾಗಿ ಇಲ್ಲಿ ದಾಖಲಾಗಿವೆ:",

    notFound:
      "ಆ location ಕಂಡುಹಿಡಿಯಲಾಗಲಿಲ್ಲ.",

    usual:
      "💡 ನೀವು ಸಾಮಾನ್ಯವಾಗಿ AirPods ಅನ್ನು ಇಲ್ಲಿ ಇಡುತ್ತೀರಿ.",

    history:
      "📜 ನೀವು ಉಳಿಸಿರುವ",

    saved:
      "location records ಇವೆ.",

    cantFind:
      "AirPods ಸಿಗದಿದ್ದರೆ ಇಲ್ಲಿ ನೋಡಿ:",

    unknown:
      "ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ನಿಮ್ಮ AirPods ಎಲ್ಲಿ ಇವೆ ಎಂದು ಕೇಳಿ."
  },


  ml: {
    placeholder: "എന്തെങ്കിലും ചോദിക്കൂ...",

    welcome:
      "👋 നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AirPods AI Assistant ആണ്.<br><br>AirPods അവസാനമായി എവിടെ വെച്ചുവെന്ന് ചോദിക്കൂ.",

    empty:
      "ഇതുവരെ AirPods location ഒന്നും save ചെയ്തിട്ടില്ല.",

    greeting:
      "നമസ്കാരം! 👋 നിങ്ങളുടെ AirPods സംബന്ധിച്ച് എന്താണ് അറിയേണ്ടത്?",

    thank:
      "സ്വാഗതം! 😊",

    latest:
      "📍 നിങ്ങളുടെ AirPods അവസാനമായി ഇവിടെ രേഖപ്പെടുത്തിയിട്ടുണ്ട്:",

    notFound:
      "ആ location കണ്ടെത്താനായില്ല.",

    usual:
      "💡 നിങ്ങൾ സാധാരണയായി AirPods ഇവിടെ വയ്ക്കാറുണ്ട്.",

    history:
      "📜 നിങ്ങൾ save ചെയ്തിരിക്കുന്നത്",

    saved:
      "location records ആണ്.",

    cantFind:
      "AirPods കണ്ടെത്താനാകുന്നില്ലെങ്കിൽ ഇവിടെ നോക്കൂ:",

    unknown:
      "എനിക്ക് മനസ്സിലായില്ല. നിങ്ങളുടെ AirPods എവിടെയാണെന്ന് ചോദിക്കൂ."
  }

};


// =====================================================
// 5. LANGUAGE KEYWORDS
// =====================================================

const languageKeywords = {

  en: [
    "hi",
    "hello",
    "hey",
    "hai",
    "good morning",
    "good evening"
  ],

  ta: [
    "வணக்கம்",
    "ஹாய்",
    "வணக்கம"
  ],

  te: [
    "హాయ్",
    "హలో",
    "నమస్తే"
  ],

  hi: [
    "हाय",
    "हेलो",
    "नमस्ते"
  ],

  kn: [
    "ಹಾಯ್",
    "ಹಲೋ",
    "ನಮಸ್ಕಾರ"
  ],

  ml: [
    "ഹായ്",
    "ഹലോ",
    "നമസ്കാരം"
  ]

};


// =====================================================
// 6. THANK YOU KEYWORDS
// =====================================================

const thankKeywords = {

  en: [
    "thanks",
    "thank you",
    "thank"
  ],

  ta: [
    "நன்றி"
  ],

  te: [
    "ధన్యవాదాలు"
  ],

  hi: [
    "धन्यवाद"
  ],

  kn: [
    "ಧನ್ಯವಾದ"
  ],

  ml: [
    "നന്ദി"
  ]

};


// =====================================================
// 7. GET CURRENT LANGUAGE
// =====================================================

function getText() {

  return chatText[selectedLanguage] || chatText.en;

}


// =====================================================
// 8. ESCAPE HTML
// =====================================================

function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// =====================================================
// 9. PHOTO COMPRESSION
// =====================================================

function compressImage(file) {

  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = function (event) {

      const img = new Image();

      img.onload = function () {

        const canvas = document.createElement("canvas");

        const maxWidth = 800;

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {

          height = height * (maxWidth / width);
          width = maxWidth;

        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
          img,
          0,
          0,
          width,
          height
        );

        const compressed =
          canvas.toDataURL(
            "image/jpeg",
            0.7
          );

        resolve(compressed);

      };

      img.onerror = reject;

      img.src = event.target.result;

    };

    reader.onerror = reject;

    reader.readAsDataURL(file);

  });

}


// =====================================================
// 10. PHOTO PREVIEW
// =====================================================

if (photoInput) {

  photoInput.addEventListener(
    "change",
    async () => {

      const file = photoInput.files[0];

      if (!file) {

        selectedPhoto = "";

        if (photoPreview) {

          photoPreview.innerHTML =
            "<span>Photo preview will appear here</span>";

        }

        return;
      }

      try {

        selectedPhoto =
          await compressImage(file);

        if (photoPreview) {

          photoPreview.innerHTML = `
            <img
              src="${selectedPhoto}"
              alt="Photo preview"
            >
          `;

        }

      } catch (error) {

        console.error(
          "Photo error:",
          error
        );

      }

    }
  );

}


// =====================================================
// 11. ROOM SELECTION
// =====================================================

roomButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      roomButtons.forEach((item) => {

        item.classList.remove("selected");

      });

      button.classList.add("selected");

      selectedRoom =
        button.dataset.room || "Other";

      if (selectedRoomText) {

        selectedRoomText.textContent =
          `Selected room: ${selectedRoom}`;

      }

    }
  );

});


// =====================================================
// 12. SAVE LOCATION
// =====================================================

if (logForm) {

  logForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const location =
        locationInput.value.trim();

      const note =
        noteInput.value.trim();

      if (!location) {

        alert(
          "Please enter the location."
        );

        return;

      }

      try {

        await addDoc(
          locationsRef,
          {
            location: location,

            room:
              selectedRoom || "Other",

            note: note,

            photo:
              selectedPhoto || "",

            createdAt:
              serverTimestamp()
          }
        );

        alert(
          "🎧 AirPods location saved successfully!"
        );

        logForm.reset();

        selectedPhoto = "";
        selectedRoom = "";

        roomButtons.forEach((button) => {

          button.classList.remove(
            "selected"
          );

        });

        if (selectedRoomText) {

          selectedRoomText.textContent =
            "No room selected";

        }

        if (photoPreview) {

          photoPreview.innerHTML =
            "<span>Photo preview will appear here</span>";

        }

        await loadLocations();

      } catch (error) {

        console.error(
          "Save error:",
          error
        );

        alert(
          "Could not save the location."
        );

      }

    }
  );

}


// =====================================================
// 13. LOAD LOCATIONS
// =====================================================

async function loadLocations() {

  try {

    const q =
      query(
        locationsRef,
        orderBy(
          "createdAt",
          "desc"
        )
      );

    const snapshot =
      await getDocs(q);

    allLocations = [];

    snapshot.forEach((item) => {

      allLocations.push({
        id: item.id,
        ...item.data()
      });

    });

    displayLocations(allLocations);

    displayLatestLocation();

    updateSmartHint();

  } catch (error) {

    console.error(
      "Loading error:",
      error
    );

    if (locationsList) {

      locationsList.innerHTML = `
        <p class="error-message">
          Could not load location history.
        </p>
      `;

    }

  }

}


// =====================================================
// 14. DISPLAY LOCATIONS
// =====================================================

function displayLocations(locations) {

  if (!locationsList) {
    return;
  }

  if (!locations.length) {

    locationsList.innerHTML = `
      <p class="empty-message">
        No AirPods locations found.
      </p>
    `;

    return;
  }

  locationsList.innerHTML = "";

  locations.forEach((item) => {

    const div =
      document.createElement("div");

    div.className =
      "location-item";

    const location =
      item.location || "Unknown location";

    const room =
      item.room || "Other";

    const note =
      item.note || "No note added";

    div.innerHTML = `
      <h3>
        📍 ${escapeHTML(location)}
      </h3>

      <p>
        🏠 Room:
        ${escapeHTML(room)}
      </p>

      <p>
        📝 ${escapeHTML(note)}
      </p>

      ${
        item.photo
          ? `
            <img
              src="${item.photo}"
              alt="Saved AirPods location"
            >
          `
          : ""
      }

      <button
        class="delete-btn"
        data-id="${item.id}"
        type="button"
      >
        🗑️ Delete
      </button>
    `;

    locationsList.appendChild(div);

  });


  document
    .querySelectorAll(".delete-btn")
    .forEach((button) => {

      button.addEventListener(
        "click",
        async () => {

          await deleteLocation(
            button.dataset.id
          );

        }
      );

    });

}


// =====================================================
// 15. DELETE LOCATION
// =====================================================

async function deleteLocation(id) {

  const confirmDelete =
    confirm(
      "Delete this location?"
    );

  if (!confirmDelete) {
    return;
  }

  try {

    await deleteDoc(
      doc(
        db,
        "airpods_locations",
        id
      )
    );

    await loadLocations();

  } catch (error) {

    console.error(
      "Delete error:",
      error
    );

    alert(
      "Could not delete this location."
    );

  }

}


// =====================================================
// 16. DISPLAY LATEST LOCATION
// =====================================================

function displayLatestLocation() {

  if (!latestLocation) {
    return;
  }

  if (!allLocations.length) {

    latestLocation.innerHTML = `
      <p class="empty-message">
        No location saved yet.
      </p>
    `;

    return;
  }

  const latest =
    allLocations[0];

  latestLocation.innerHTML = `
    <div class="latest-title">
      Last saved location
    </div>

    <div class="latest-place">
      📍
      ${escapeHTML(
        latest.location || "Unknown"
      )}
    </div>

    <div class="latest-note">
      🏠
      ${escapeHTML(
        latest.room || "Other"
      )}
    </div>

    ${
      latest.note
        ? `
          <div class="latest-note">
            📝
            ${escapeHTML(latest.note)}
          </div>
        `
        : ""
    }
  `;

}


// =====================================================
// 17. SMART HINT
// =====================================================

function updateSmartHint() {

  if (!hintText || !hintReason) {
    return;
  }

  if (!allLocations.length) {

    hintText.textContent =
      "Your smart hint will appear here.";

    hintReason.textContent =
      "Save a few locations to learn your AirPods habits.";

    return;
  }

  const counts = {};

  allLocations.forEach((item) => {

    const place =
      item.location || "Unknown";

    counts[place] =
      (counts[place] || 0) + 1;

  });

  let mostUsed = "";
  let highest = 0;

  Object.keys(counts).forEach((place) => {

    if (counts[place] > highest) {

      highest = counts[place];
      mostUsed = place;

    }

  });

  if (mostUsed) {

    hintText.textContent =
      `💡 You usually keep your AirPods here: ${mostUsed}`;

    hintReason.textContent =
      `You saved this location ${highest} time(s).`;

  }

}


// =====================================================
// 18. NORMALIZE TEXT
// =====================================================

function normalizeText(text) {

  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

}


// =====================================================
// 19. LEVENSHTEIN DISTANCE
// =====================================================

function levenshtein(a, b) {

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {

    matrix[i] = [i];

  }

  for (let j = 0; j <= a.length; j++) {

    matrix[0][j] = j;

  }

  for (let i = 1; i <= b.length; i++) {

    for (let j = 1; j <= a.length; j++) {

      if (
        b.charAt(i - 1) ===
        a.charAt(j - 1)
      ) {

        matrix[i][j] =
          matrix[i - 1][j - 1];

      } else {

        matrix[i][j] =
          Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );

      }

    }

  }

  return matrix[b.length][a.length];

}


// =====================================================
// 20. SMART SEARCH
// =====================================================

function smartSearch(searchTerm) {

  const search =
    normalizeText(searchTerm);

  if (!search) {
    return allLocations;
  }

  return allLocations.filter((item) => {

    const location =
      normalizeText(
        item.location || ""
      );

    const room =
      normalizeText(
        item.room || ""
      );

    const note =
      normalizeText(
        item.note || ""
      );

    if (
      location.includes(search) ||
      room.includes(search) ||
      note.includes(search)
    ) {

      return true;

    }

    const allWords = [
      ...location.split(/\s+/),
      ...room.split(/\s+/),
      ...note.split(/\s+/)
    ];

    return allWords.some((word) => {

      if (
        word.length < 3 ||
        search.length < 3
      ) {

        return false;

      }

      return (
        levenshtein(word, search) <= 2
      );

    });

  });

}


// =====================================================
// 21. DETECT AIRPODS SEARCH
// =====================================================

function isAirPodsSearch(text) {

  const raw =
    String(text || "")
      .toLowerCase()
      .trim();

  const normalized =
    normalizeText(text);

  return (
    raw.includes("air pods") ||
    normalized.includes("airpods") ||
    normalized.includes("airpod") ||
    normalized.includes("airdops") ||
    normalized.includes("airdop")
  );

}


// =====================================================
// 22. WEBSITE PHONE-STYLE NOTIFICATION
// =====================================================

function showWebsiteNotification(
  location,
  room,
  note = ""
) {

  if (
    !notificationPreview ||
    !notificationPreviewText
  ) {

    return;

  }

  notificationPreviewText.innerHTML = `
    📍 AirPods may be near
    <strong>
      ${escapeHTML(
        location || "Unknown location"
      )}
    </strong>
    <br>
    🏠 ${escapeHTML(
      room || "Other"
    )}
    ${
      note
        ? `<br>📝 ${escapeHTML(note)}`
        : ""
    }
  `;

  notificationPreview.classList.add("show");

  clearTimeout(
    window.airpodsNotificationTimer
  );

  window.airpodsNotificationTimer =
    setTimeout(() => {

      notificationPreview.classList.remove(
        "show"
      );

    }, 6000);

}


// =====================================================
// 23. BROWSER / PHONE NOTIFICATION
// =====================================================

function showAirPodsNotification(
  location,
  room,
  note = ""
) {

  if (!("Notification" in window)) {
    return;
  }

  if (
    Notification.permission !==
    "granted"
  ) {

    return;

  }

  try {

    const notification =
      new Notification(
        "🎧 AirPods Finder",
        {
          body:
            `📍 AirPods may be near ${location || "Unknown location"}\n` +
            `🏠 ${room || "Other"}` +
            (note
              ? `\n📝 ${note}`
              : ""),

          tag:
            "airpods-found",

          requireInteraction:
            true
        }
      );

    notification.onclick =
      function () {

        window.focus();

        notification.close();

      };

  } catch (error) {

    console.error(
      "Notification error:",
      error
    );

  }

}


// =====================================================
// 24. ENABLE NOTIFICATIONS
// =====================================================

if (notificationBtn) {

  notificationBtn.addEventListener(
    "click",
    async () => {

      if (!("Notification" in window)) {

        alert(
          "Your browser does not support notifications."
        );

        return;

      }

      try {

        const permission =
          await Notification.requestPermission();

        if (
          permission ===
          "granted"
        ) {

          notificationBtn.textContent =
            "✅ Notifications Enabled";

          notificationBtn.disabled =
            true;

          new Notification(
            "🎧 AirPods Finder",
            {
              body:
                "AirPods notifications are now enabled 🔔",

              tag:
                "airpods-test"
            }
          );

        } else {

          notificationBtn.textContent =
            "⚠️ Notifications Blocked";

          alert(
            "Please allow notifications for this website in your browser settings."
          );

        }

      } catch (error) {

        console.error(
          "Notification permission error:",
          error
        );

      }

    }
  );

}


// =====================================================
// 25. START AIRPODS ALARM
// =====================================================

function startAirPodsAlarm() {

  if (!alarmSound) {

    console.error(
      "Alarm sound element not found."
    );

    return;

  }

  alarmSound.currentTime = 0;
  alarmSound.loop = true;
  alarmSound.volume = 1.0;

  alarmSound
    .play()
    .then(() => {

      if (alarmStatus) {

        alarmStatus.innerHTML =
          "🚨 <strong>ALARM IS ON!</strong><br>" +
          "🔊 Listen for your AirPods.";

      }

      const alarmCard =
        document.querySelector(
          ".alarm-card"
        );

      if (alarmCard) {

        alarmCard.classList.add(
          "alarm-active"
        );

      }

    })
    .catch((error) => {

      console.error(
        "Could not play alarm:",
        error
      );

      if (alarmStatus) {

        alarmStatus.innerHTML =
          "⚠️ Sound blocked. Click Start Alarm.";

      }

    });

}


// =====================================================
// 26. STOP AIRPODS ALARM
// =====================================================

function stopAirPodsAlarm() {

  if (!alarmSound) {
    return;
  }

  alarmSound.pause();
  alarmSound.currentTime = 0;

  if (alarmStatus) {

    alarmStatus.innerHTML =
      "🔇 Alarm stopped.";

  }

  const alarmCard =
    document.querySelector(
      ".alarm-card"
    );

  if (alarmCard) {

    alarmCard.classList.remove(
      "alarm-active"
    );

  }

}


// =====================================================
// 27. MANUAL ALARM BUTTONS
// =====================================================

if (startAlarm) {

  startAlarm.addEventListener(
    "click",
    startAirPodsAlarm
  );

}

if (stopAlarm) {

  stopAlarm.addEventListener(
    "click",
    stopAirPodsAlarm
  );

}


// =====================================================
// 28. SEARCH FUNCTION
// =====================================================

function performSearch() {

  const value =
    searchInput
      ? searchInput.value.trim()
      : "";

  // -----------------------------------------------
  // AIRPODS SEARCH
  // -----------------------------------------------

  if (isAirPodsSearch(value)) {

    if (allLocations.length > 0) {

      displayLocations(
        allLocations
      );

      const latest =
        allLocations[0];

      const location =
        latest.location ||
        "Unknown location";

      const room =
        latest.room ||
        "Other";

      const note =
        latest.note ||
        "";

      // Website notification
      showWebsiteNotification(
        location,
        room,
        note
      );

      // Browser notification
      showAirPodsNotification(
        location,
        room,
        note
      );

      // Alarm
      startAirPodsAlarm();

      // Scroll to latest location
      if (latestLocation) {

        latestLocation.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

      }

    } else {

      displayLocations([]);

      stopAirPodsAlarm();

      showWebsiteNotification(
        "Unknown",
        "No saved location"
      );

    }

    return;

  }


  // -----------------------------------------------
  // NORMAL LOCATION SEARCH
  // -----------------------------------------------

  const results =
    smartSearch(value);

  displayLocations(results);

  if (
    value &&
    results.length > 0
  ) {

    const result =
      results[0];

    showWebsiteNotification(
      result.location,
      result.room,
      result.note || ""
    );

    startAirPodsAlarm();

  } else {

    stopAirPodsAlarm();

  }

}


// =====================================================
// 29. SEARCH BUTTON
// =====================================================

if (searchBtn) {

  searchBtn.addEventListener(
    "click",
    performSearch
  );

}


// =====================================================
// 30. ENTER KEY SEARCH
// =====================================================

if (searchInput) {

  searchInput.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Enter") {

        event.preventDefault();

        performSearch();

      }

    }
  );

}


// =====================================================
// 31. SHOW ALL
// =====================================================

if (showAllBtn) {

  showAllBtn.addEventListener(
    "click",
    () => {

      displayLocations(
        allLocations
      );

      if (searchInput) {

        searchInput.value = "";

      }

    }
  );

}


// =====================================================
// 32. CHATBOT OPEN
// =====================================================

if (chatToggle) {

  chatToggle.addEventListener(
    "click",
    () => {

      if (chatbot) {

        chatbot.classList.add(
          "active"
        );

      }

      if (chatInput) {

        chatInput.focus();

      }

    }
  );

}


// =====================================================
// 33. CHATBOT CLOSE
// =====================================================

if (closeChat) {

  closeChat.addEventListener(
    "click",
    () => {

      if (chatbot) {

        chatbot.classList.remove(
          "active"
        );

      }

    }
  );

}


// =====================================================
// 34. LANGUAGE SELECTOR
// =====================================================

if (
  languageButton &&
  languageOptions
) {

  languageButton.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      languageOptions.classList.toggle(
        "active"
      );

    }
  );


  document
    .querySelectorAll(
      "#languageOptions button"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();

          selectedLanguage =
            button.dataset.lang || "en";

          // Change language button
          languageButton.textContent =
            selectedLanguage.toUpperCase();

          // Change input placeholder
          if (chatInput) {

            chatInput.placeholder =
              getText().placeholder;

          }

          // Change welcome message
          if (chatMessages) {

            chatMessages.innerHTML = `
              <div class="bot-message">
                ${getText().welcome}
              </div>
            `;

          }

          // Close menu
          languageOptions.classList.remove(
            "active"
          );

        }
      );

    });

}


// =====================================================
// 35. CLOSE LANGUAGE MENU
// =====================================================

document.addEventListener(
  "click",
  (event) => {

    if (
      languageOptions &&
      languageButton &&
      !languageOptions.contains(
        event.target
      ) &&
      event.target !== languageButton
    ) {

      languageOptions.classList.remove(
        "active"
      );

    }

  }
);


// =====================================================
// 36. ADD CHAT MESSAGE
// =====================================================

function addChatMessage(
  message,
  type
) {

  if (!chatMessages) {
    return;
  }

  const div =
    document.createElement("div");

  div.className =
    type === "user"
      ? "user-message"
      : "bot-message";

  div.innerHTML = message;

  chatMessages.appendChild(div);

  chatMessages.scrollTop =
    chatMessages.scrollHeight;

}


// =====================================================
// 37. DETECT ROOM
// =====================================================

function detectRoom(text) {

  const value =
    normalizeText(text);

  const rooms = {

    Bedroom: [
      "bedroom",
      "bed",
      "room",
      "படுக்கையறை",
      "बेडरूम",
      "పడకగది",
      "ಮಲಗುವ ಕೋಣೆ",
      "കിടപ്പുമുറി"
    ],

    Study: [
      "study",
      "study room",
      "படிப்பு",
      "अध्ययन",
      "చదువు",
      "ಅಧ್ಯಯನ",
      "പഠനം"
    ],

    Hall: [
      "hall",
      "living room",
      "ஹால்",
      "हॉल",
      "హాల్",
      "ಹಾಲ್",
      "ഹാൾ"
    ],

    Kitchen: [
      "kitchen",
      "சமையலறை",
      "रसोई",
      "వంటగది",
      "ಅಡುಗೆಮನೆ",
      "അടുക്കള"
    ]

  };


  for (const room in rooms) {

    for (
      const keyword of rooms[room]
    ) {

      if (
        value.includes(
          normalizeText(keyword)
        )
      ) {

        return room;

      }

    }

  }

  return "";

}


// =====================================================
// 38. CHATBOT ANSWER
// =====================================================

function answerQuestion(question) {

  const value =
    normalizeText(question);

  const text =
    getText();

  if (!value) {

    return text.unknown;

  }


  // -----------------------------------------------
  // Greeting
  // -----------------------------------------------

  const greetings =
    languageKeywords[
      selectedLanguage
    ] || [];

  if (
    greetings.some((word) =>
      normalizeText(question).includes(
        normalizeText(word)
      )
    )
  ) {

    return text.greeting;

  }


  // -----------------------------------------------
  // Thank you
  // -----------------------------------------------

  const thanks =
    thankKeywords[
      selectedLanguage
    ] || [];

  if (
    thanks.some((word) =>
      normalizeText(question).includes(
        normalizeText(word)
      )
    )
  ) {

    return text.thank;

  }


  // -----------------------------------------------
  // No locations
  // -----------------------------------------------

  if (allLocations.length === 0) {

    return text.empty;

  }


  // -----------------------------------------------
  // AirPods question
  // -----------------------------------------------

  if (
    isAirPodsSearch(question)
  ) {

    const latest =
      allLocations[0];

    return `
      ${text.latest}
      <br><br>

      <strong>
        📍 ${escapeHTML(
          latest.location || "Unknown"
        )}
      </strong>

      <br>

      🏠 ${escapeHTML(
        latest.room || "Other"
      )}

      ${
        latest.note
          ? `
            <br>
            📝 ${escapeHTML(
              latest.note
            )}
          `
          : ""
      }
    `;

  }


  // -----------------------------------------------
  // Latest location
  // -----------------------------------------------

  if (
    value.includes("where") ||
    value.includes("last") ||
    value.includes("kept") ||
    value.includes("find") ||
    value.includes("location") ||
    value.includes("எங்கே") ||
    value.includes("எங்கு") ||
    value.includes("ఎక్కడ") ||
    value.includes("कहाँ") ||
    value.includes("ಎಲ್ಲಿ") ||
    value.includes("എവിടെ")
  ) {

    const latest =
      allLocations[0];

    return `
      ${text.latest}
      <br><br>

      <strong>
        📍 ${escapeHTML(
          latest.location || "Unknown"
        )}
      </strong>

      <br>

      🏠 ${escapeHTML(
        latest.room || "Other"
      )}

      ${
        latest.note
          ? `
            <br>
            📝 ${escapeHTML(
              latest.note
            )}
          `
          : ""
      }
    `;

  }


  // -----------------------------------------------
  // Count
  // -----------------------------------------------

  if (
    value.includes("how many") ||
    value.includes("count") ||
    value.includes("records")
  ) {

    return `
      ${text.history}
      <strong>
        ${allLocations.length}
      </strong>
      ${text.saved}
    `;

  }


  // -----------------------------------------------
  // Room search
  // -----------------------------------------------

  const room =
    detectRoom(question);

  if (room) {

    const results =
      allLocations.filter(
        (item) =>
          normalizeText(
            item.room || ""
          ) ===
          normalizeText(room)
      );

    if (!results.length) {

      return `
        ${text.notFound}
        <br>
        🏠 ${room}
      `;

    }

    return `
      ${text.cantFind}
      <br><br>

      <strong>
        🏠 ${room}
      </strong>

      <br>

      📍 ${escapeHTML(
        results[0].location ||
        "Unknown"
      )}

      ${
        results[0].note
          ? `
            <br>
            📝 ${escapeHTML(
              results[0].note
            )}
          `
          : ""
      }
    `;

  }


  // -----------------------------------------------
  // Normal location search
  // -----------------------------------------------

  const results =
    smartSearch(question);

  if (results.length) {

    const result =
      results[0];

    return `
      📍 I found this:
      <br><br>

      <strong>
        ${escapeHTML(
          result.location ||
          "Unknown"
        )}
      </strong>

      <br>

      🏠 ${escapeHTML(
        result.room ||
        "Other"
      )}

      ${
        result.note
          ? `
            <br>
            📝 ${escapeHTML(
              result.note
            )}
          `
          : ""
      }
    `;

  }


  // -----------------------------------------------
  // Most used location
  // -----------------------------------------------

  const counts = {};

  allLocations.forEach((item) => {

    const place =
      item.location || "Unknown";

    counts[place] =
      (counts[place] || 0) + 1;

  });

  let mostUsed = "";
  let highest = 0;

  Object.keys(counts).forEach((place) => {

    if (counts[place] > highest) {

      highest =
        counts[place];

      mostUsed =
        place;

    }

  });


  if (
    value.includes("usually") ||
    value.includes("often") ||
    value.includes("habit")
  ) {

    return `
      ${text.usual}
      <br><br>

      📍
      <strong>
        ${escapeHTML(mostUsed)}
      </strong>
    `;

  }


  return text.unknown;

}


// =====================================================
// 39. SEND CHAT MESSAGE
// =====================================================

function sendChatMessage() {

  if (!chatInput) {
    return;
  }

  const question =
    chatInput.value.trim();

  if (!question) {
    return;
  }

  addChatMessage(
    escapeHTML(question),
    "user"
  );

  chatInput.value = "";

  setTimeout(() => {

    const answer =
      answerQuestion(question);

    addChatMessage(
      answer,
      "bot"
    );

  }, 300);

}


// =====================================================
// 40. CHAT SEND BUTTON
// =====================================================

if (chatSend) {

  chatSend.addEventListener(
    "click",
    sendChatMessage
  );

}


// =====================================================
// 41. CHAT ENTER KEY
// =====================================================

if (chatInput) {

  chatInput.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Enter") {

        event.preventDefault();

        sendChatMessage();

      }

    }
  );

}


// =====================================================
// 42. INITIALIZE APP
// =====================================================

async function initializeApp() {

  selectedLanguage = "en";

  if (languageButton) {

    languageButton.textContent =
      "EN";

  }

  if (chatInput) {

    chatInput.placeholder =
      chatText.en.placeholder;

  }


  // Check notification permission

  if ("Notification" in window) {

    if (
      Notification.permission ===
      "granted"
    ) {

      if (notificationBtn) {

        notificationBtn.textContent =
          "✅ Notifications Enabled";

        notificationBtn.disabled =
          true;

      }

    }

  }


  // Load Firebase data

  await loadLocations();

}


// =====================================================
// 43. START APPLICATION
// =====================================================

initializeApp();