import { useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark-theme');
      html.classList.remove('light-theme');
    } else {
      html.classList.add('light-theme');
      html.classList.remove('dark-theme');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 md:px-4 md:py-2 md:rounded-full md:bg-[var(--text)] md:text-[var(--background)] md:hover:bg-[var(--opposite)] transition-colors duration-300 border-none cursor-pointer"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="md:hidden">{darkMode ? '☀️' : '🌙'}</span>
      <span className="hidden md:inline">{darkMode ? '☀️ Light' : '🌙 Dark'}</span>
    </button>
  );
};

export default ThemeToggle;