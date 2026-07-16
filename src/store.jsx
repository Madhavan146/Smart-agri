import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from './i18n';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [userName, setUserName] = useState(() => localStorage.getItem('smartagri_user') || '');
  const [selectedDistrict, setSelectedDistrict] = useState(() => localStorage.getItem('smartagri_district') || '');
  const [selectedCrop, setSelectedCrop] = useState(() => localStorage.getItem('smartagri_crop') || '');
  const [language, setLanguage] = useState(() => localStorage.getItem('smartagri_lang') || 'en');
  const [theme, setTheme] = useState(() => localStorage.getItem('smartagri_theme') || 'light');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('smartagri_gemini_key') || '');

  // Sync language with i18n
  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('smartagri_lang', language);
  }, [language]);

  // Sync theme with DOM class list
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('smartagri_theme', theme);
  }, [theme]);

  const updateOnboarding = (name, district) => {
    setUserName(name);
    setSelectedDistrict(district);
    localStorage.setItem('smartagri_user', name);
    localStorage.setItem('smartagri_district', district);
  };

  const updateCrop = (crop) => {
    setSelectedCrop(crop);
    localStorage.setItem('smartagri_crop', crop);
  };

  const updateApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('smartagri_gemini_key', key);
  };

  const resetAll = () => {
    setUserName('');
    setSelectedDistrict('');
    setSelectedCrop('');
    localStorage.removeItem('smartagri_user');
    localStorage.removeItem('smartagri_district');
    localStorage.removeItem('smartagri_crop');
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ta' : 'en';
    setLanguage(nextLang);
    i18n.changeLanguage(nextLang);
    localStorage.setItem('smartagri_lang', nextLang);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Connects the chatbot directly to Gemini API client-side
  const fetchGeminiResponse = async (query, zoneName, soilProfile) => {
    if (!apiKey) {
      throw new Error("No Gemini API key supplied");
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a professional agronomist representing Tamil Nadu Agricultural University (TNAU) and local extension offices. You are advising a farmer named ${userName} who is cultivating ${selectedCrop} in ${selectedDistrict} district.
              Local Soil profile: ${soilProfile}.
              Agro-Climatic Zone: ${zoneName}.
              
              Answer the farmer's agricultural query with 1000x precision, offering specific scientific treatments, ratios, and weather-defensive tactics. Keep the response concise, practical, and highly encouraging.
              
              If the farmer asks in Tamil (or Tamil-English), respond in clean, natural Tamil. Otherwise, write in English.
              Format in 2-3 short, highly readable paragraphs without headers.
              
              Query: "${query}"`
            }]
          }]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error("Gemini Error Payload:", data);
        throw new Error("Invalid API key or model query limit reached.");
      }
    } catch (err) {
      console.error(err);
      throw new Error(err.message || "Failed to establish secure connection to Gemini API.");
    }
  };

  return (
    <AppContext.Provider value={{
      userName,
      selectedDistrict,
      selectedCrop,
      language,
      theme,
      apiKey,
      updateOnboarding,
      updateCrop,
      updateApiKey,
      resetAll,
      toggleLanguage,
      toggleTheme,
      fetchGeminiResponse
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}
