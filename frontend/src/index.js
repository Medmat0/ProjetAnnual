import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/authContext';
import { PostProvider } from './context/postContext';
import { ProfileProvider } from './context/profileContext';
import { ThemeProvider } from './components/timeline/ThemeContext';
const root = createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
    <AuthProvider>
      <PostProvider>
        <ProfileProvider>
          <App />
        </ProfileProvider>
      </PostProvider>
    </AuthProvider>
  </ThemeProvider>,
);

reportWebVitals();
