'use client';

import { useState, useEffect, useRef } from 'react';
import { Home, FolderGit2, User, Mail, Terminal, Menu, X, ExternalLink, Check } from 'lucide-react';

// Importamos Feather Icons para el Footer
import { FiGithub, FiLinkedin } from 'react-icons/fi';

// Importamos los logos oficiales del Stack
import { 
  SiJavascript, SiReact, SiNextdotjs, SiTypescript, 
  SiTailwindcss, SiFlutter, SiNodedotjs, SiFastapi, 
  SiBootstrap, SiMysql, SiPython, SiGit, SiGithub, SiVercel
} from 'react-icons/si';

import Aurora from '@/components/react-bits/Aurora';
import BlurText from '@/components/react-bits/BlurText';
import RotatingText from '@/components/react-bits/RotatingText';
import MagicBento from '@/components/react-bits/MagicBento';
import ScrollStack, { ScrollStackItem } from '@/components/react-bits/ScrollStack';
import Dock from '@/components/react-bits/Dock';
import LogoLoop from '@/components/react-bits/LogoLoop';

// --- COMPONENTE LAZY IFRAME (NUEVO FIX) ---
// Evita que los iframes carguen todos a la vez, liberando la red y la GPU
const LazyIframe = ({ src, title }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect(); // Una vez cargado, dejamos de observar
        }
      },
      { rootMargin: '200px' } // Empieza a cargar 200px antes de aparecer en pantalla
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full bg-[var(--card-bg)] flex items-center justify-center">
      {!isIntersecting ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#5227FF] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-[var(--text-muted)] font-mono">Cargando preview...</span>
        </div>
      ) : (
        <iframe 
          src={src} 
          className="absolute top-0 left-0 border-0 pointer-events-none bg-white"
          style={{ width: '400%', height: '400%', transform: 'scale(0.25)', transformOrigin: 'top left' }}
          tabIndex="-1"
          loading="lazy"
          title={title}
        />
      )}
    </div>
  );
};

// --- ESTILOS DINÁMICOS, CSS AVANZADO Y SWITCHES ---
const globalStyles = `
  /* Hover de los logos del Stack */
  .tech-icon-wrapper {
    color: var(--text-main); 
    transition: color 0.3s ease;
  }
  .tech-icon-wrapper:hover {
    color: var(--hover-color) !important;
  }

  /* Animación puramente vertical y muy suave para el Dock (Desktop) */
  .nav-dock-wrapper {
    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s ease;
  }
  .nav-hidden-desktop {
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
  }

  /* Animación puramente vertical y suave para el FAB (Móvil) */
  .fab-container {
    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s ease;
  }
  .nav-hidden-mobile {
    transform: translateY(150%);
    opacity: 0;
    pointer-events: none;
  }

  /* =========================================
     SWITCH DE TEMA 1 (DESKTOP)
     ========================================= */
  .desk-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }
  .desk-switch .desk-toggle {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .desk-switch .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #2196f3;
    transition: 0.4s;
    z-index: 0;
    overflow: hidden;
  }
  .desk-switch .sun-moon {
    position: absolute;
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: yellow;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s ease;
    transform: translateX(0) rotate(0);
  }
  .desk-toggle:checked + .slider { background-color: black; }
  .desk-toggle:focus + .slider { box-shadow: 0 0 1px #2196f3; }
  
  .desk-toggle:checked + .slider .sun-moon {
    transform: translateX(26px) rotate(360deg);
    background-color: white;
  }

  .desk-switch .moon-dot { opacity: 0; transition: 0.4s; fill: gray; }
  .desk-toggle:checked + .slider .sun-moon .moon-dot { opacity: 1; }
  .desk-switch .slider.round { border-radius: 34px; }
  .desk-switch .slider.round .sun-moon { border-radius: 50%; }
  
  .desk-switch #moon-dot-1 { left: 10px; top: 3px; position: absolute; width: 6px; height: 6px; z-index: 4; }
  .desk-switch #moon-dot-2 { left: 2px; top: 10px; position: absolute; width: 10px; height: 10px; z-index: 4; }
  .desk-switch #moon-dot-3 { left: 16px; top: 18px; position: absolute; width: 3px; height: 3px; z-index: 4; }
  .desk-switch #light-ray-1 { left: -8px; top: -8px; position: absolute; width: 43px; height: 43px; z-index: -1; fill: white; opacity: 10%; }
  .desk-switch #light-ray-2 { left: -50%; top: -50%; position: absolute; width: 55px; height: 55px; z-index: -1; fill: white; opacity: 10%; }
  .desk-switch #light-ray-3 { left: -18px; top: -18px; position: absolute; width: 60px; height: 60px; z-index: -1; fill: white; opacity: 10%; }
  
  .desk-switch .cloud-light { position: absolute; fill: #eee; animation-name: cloud-move; animation-duration: 6s; animation-iteration-count: infinite; }
  .desk-switch .cloud-dark { position: absolute; fill: #ccc; animation-name: cloud-move; animation-duration: 6s; animation-iteration-count: infinite; animation-delay: 1s; }
  .desk-switch #cloud-1 { left: 30px; top: 15px; width: 40px; }
  .desk-switch #cloud-2 { left: 44px; top: 10px; width: 20px; }
  .desk-switch #cloud-3 { left: 18px; top: 24px; width: 30px; }
  .desk-switch #cloud-4 { left: 36px; top: 18px; width: 40px; }
  .desk-switch #cloud-5 { left: 48px; top: 14px; width: 20px; }
  .desk-switch #cloud-6 { left: 22px; top: 26px; width: 30px; }
  
  @keyframes cloud-move { 0% { transform: translateX(0px); } 40% { transform: translateX(4px); } 80% { transform: translateX(-4px); } 100% { transform: translateX(0px); } }
  
  .desk-switch .stars { transform: translateY(-32px); opacity: 0; transition: 0.4s; }
  .desk-switch .star { fill: white; position: absolute; transition: 0.4s; animation-name: star-twinkle; animation-duration: 2s; animation-iteration-count: infinite; }
  .desk-toggle:checked + .slider .stars { transform: translateY(0); opacity: 1; }
  .desk-switch #star-1 { width: 20px; top: 2px; left: 3px; animation-delay: 0.3s; }
  .desk-switch #star-2 { width: 6px; top: 16px; left: 3px; }
  .desk-switch #star-3 { width: 12px; top: 20px; left: 10px; animation-delay: 0.6s; }
  .desk-switch #star-4 { width: 18px; top: 0px; left: 18px; animation-delay: 1.3s; }
  
  @keyframes star-twinkle { 0% { transform: scale(1); } 40% { transform: scale(1.2); } 80% { transform: scale(0.8); } 100% { transform: scale(1); } }

  /* =========================================
     SWITCH DE TEMA 2 (MÓVIL)
     ========================================= */
  .st-sunMoonThemeToggleBtn {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .st-sunMoonThemeToggleBtn .themeToggleInput {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }
  .st-sunMoonThemeToggleBtn svg {
    transition: transform 0.4s ease;
    transform: rotate(40deg); 
  }
  .st-sunMoonThemeToggleBtn svg .sunMoon {
    transform-origin: center center;
    transition: inherit;
    transform: scale(1);
  }
  .st-sunMoonThemeToggleBtn svg .sunRay {
    transform-origin: center center;
    transform: scale(0);
  }
  .st-sunMoonThemeToggleBtn svg mask > circle {
    transition: transform 0.64s cubic-bezier(0.41, 0.64, 0.32, 1.575);
    transform: translate(0px, 0px);
  }
  .st-sunMoonThemeToggleBtn svg .sunRay2 { animation-delay: 0.05s !important; }
  .st-sunMoonThemeToggleBtn svg .sunRay3 { animation-delay: 0.1s !important; }
  .st-sunMoonThemeToggleBtn svg .sunRay4 { animation-delay: 0.17s !important; }
  .st-sunMoonThemeToggleBtn svg .sunRay5 { animation-delay: 0.25s !important; }
  .st-sunMoonThemeToggleBtn svg .sunRay6 { animation-delay: 0.29s !important; }
  
  .st-sunMoonThemeToggleBtn .themeToggleInput:checked + svg { transform: rotate(90deg); }
  .st-sunMoonThemeToggleBtn .themeToggleInput:checked + svg mask > circle { transform: translate(16px, -3px); }
  .st-sunMoonThemeToggleBtn .themeToggleInput:checked + svg .sunMoon { transform: scale(0.55); }
  .st-sunMoonThemeToggleBtn .themeToggleInput:checked + svg .sunRay { animation: showRay1832 0.4s ease 0s 1 forwards; }
  
  @keyframes showRay1832 { 0% { transform: scale(0); } 100% { transform: scale(1); } }
`;

export default function Portfolio() {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Estado para la notificación Sileo
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    let timeoutId;
    const handleActivity = () => {
      setIsNavVisible(true);
      clearTimeout(timeoutId);
      if (window.scrollY > 100) {
        timeoutId = setTimeout(() => {
          setIsNavVisible(false);
          setIsFabOpen(false); 
        }, 1200); 
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    handleActivity();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      clearTimeout(timeoutId);
    };
  }, []); 

  useEffect(() => {
    const handleScroll = () => {
      if (isFabOpen) setIsFabOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFabOpen]);

  const handleDownloadCV = () => {
    setNotification({ type: 'loading', text: 'Preparando descarga...' });
    
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '/jorge-silva-cv.pdf'; 
      link.download = 'Jorge_Silva_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setNotification({ type: 'success', text: '¡CV descargado con éxito!' });
      
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      
    }, 1500);
  };

  const themeVars = isDarkMode 
    ? {
        '--bg-main': '#060010',
        '--text-main': '#ffffff',
        '--text-muted': '#9ca3af',
        '--card-bg': '#0b0518',
        '--card-border': 'rgba(82, 39, 255, 0.2)',
        '--footer-bg': 'rgba(6, 0, 16, 0.8)',
        '--glass-border': 'rgba(255, 255, 255, 0.1)',
        '--svg-monitor': '#0A0118',
        '--aurora-1': '#3b0764',
        '--aurora-2': '#1e1b4b',
        '--aurora-3': '#000000',
      }
    : {
        '--bg-main': '#ffffff',
        '--text-main': '#09090b',
        '--text-muted': '#71717a',
        '--card-bg': '#ffffff',
        '--card-border': '#e4e4e7',
        '--footer-bg': 'rgba(255, 255, 255, 0.8)',
        '--glass-border': 'rgba(0, 0, 0, 0.1)',
        '--svg-monitor': '#f4f4f5',
        '--aurora-1': '#e9d5ff', 
        '--aurora-2': '#ddd6fe',
        '--aurora-3': '#ffffff',
      };

  const dockItems = [
    { icon: <Home size={22} color="currentColor" />, label: 'Inicio', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { icon: <User size={22} color="currentColor" />, label: 'Sobre Mí', onClick: () => document.getElementById('about').scrollIntoView({ behavior: 'smooth' }) },
    { icon: <Terminal size={22} color="currentColor" />, label: 'Skills', onClick: () => document.getElementById('skills').scrollIntoView({ behavior: 'smooth' }) },
    { icon: <FolderGit2 size={22} color="currentColor" />, label: 'Proyectos', onClick: () => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' }) },
    { icon: <Mail size={22} color="currentColor" />, label: 'Contacto', onClick: () => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }) }
  ];

  const TechIcon = ({ children, hoverColor }) => (
    <span className="tech-icon-wrapper cursor-pointer" style={{ '--hover-color': hoverColor }}>
      {children}
    </span>
  );

  const techLogos = [
    { node: <TechIcon hoverColor="#F7DF1E"><SiJavascript /></TechIcon>, title: "JavaScript" },
    { node: <TechIcon hoverColor="#3178C6"><SiTypescript /></TechIcon>, title: "TypeScript" },
    { node: <TechIcon hoverColor="#61DAFB"><SiReact /></TechIcon>, title: "React" },
    { node: <TechIcon hoverColor={isDarkMode ? "#FFFFFF" : "#000000"}><SiNextdotjs /></TechIcon>, title: "Next.js" }, 
    { node: <TechIcon hoverColor="#61DAFB"><SiReact /></TechIcon>, title: "React Native" },
    { node: <TechIcon hoverColor="#06B6D4"><SiTailwindcss /></TechIcon>, title: "Tailwind CSS" },
    { node: <TechIcon hoverColor="#7952B3"><SiBootstrap /></TechIcon>, title: "Bootstrap" },
    { node: <TechIcon hoverColor="#339933"><SiNodedotjs /></TechIcon>, title: "Node.js" },
    { node: <TechIcon hoverColor="#009688"><SiFastapi /></TechIcon>, title: "FastAPI" },
    { node: <TechIcon hoverColor="#3776AB"><SiPython /></TechIcon>, title: "Python" },
    { node: <TechIcon hoverColor="#4479A1"><SiMysql /></TechIcon>, title: "SQL / MySQL" },
    { node: <TechIcon hoverColor="#F05032"><SiGit /></TechIcon>, title: "Git" },
    { node: <TechIcon hoverColor={isDarkMode ? "#FFFFFF" : "#000000"}><SiGithub /></TechIcon>, title: "GitHub" },
    { node: <TechIcon hoverColor={isDarkMode ? "#FFFFFF" : "#000000"}><SiVercel /></TechIcon>, title: "Vercel" },
  ];

  const primaryBtnClass = "px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 bg-gradient-to-br from-[#5227FF] to-[#FF9FFC] hover:from-[#6b45ff] hover:to-[#ffb3fd] text-white shadow-[0_4px_15px_rgba(82,39,255,0.4)] hover:shadow-[0_8px_25px_rgba(82,39,255,0.6)] text-center cursor-pointer";
  const secondaryBtnClass = "px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 transform hover:-translate-y-1 text-[var(--text-muted)] border border-[var(--glass-border)] hover:border-[#5227FF] hover:text-[var(--text-main)] hover:shadow-[0_0_15px_rgba(82,39,255,0.3)] text-center bg-transparent cursor-pointer";

  return (
    <main 
      className="relative min-h-screen font-sans overflow-x-hidden pt-24 transition-colors duration-500 ease-in-out"
      style={{ ...themeVars, backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      <style>{globalStyles}</style>

      {/* --- SISTEMA DE NOTIFICACIONES TIPO SILEO --- */}
      <div 
        className={`fixed top-8 right-4 sm:right-8 z-[100] flex items-center gap-3 px-5 py-3 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] shadow-[0_10px_40px_rgba(82,39,255,0.2)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${notification ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'}`}
      >
        {notification?.type === 'loading' && (
          <div className="w-5 h-5 border-2 border-[#5227FF] border-t-transparent rounded-full animate-spin"></div>
        )}
        {notification?.type === 'success' && (
          <div className="w-6 h-6 bg-gradient-to-br from-[#5227FF] to-[#FF9FFC] rounded-full flex items-center justify-center">
            <Check size={14} color="#ffffff" strokeWidth={3} />
          </div>
        )}
        <span className="text-[var(--text-main)] text-sm font-medium tracking-wide">
          {notification?.text}
        </span>
      </div>

      <div className="fixed top-0 left-0 w-full h-[60vh] z-0 opacity-40 pointer-events-none mix-blend-screen transition-colors duration-500">
        <Aurora colorStops={[themeVars['--aurora-1'], themeVars['--aurora-2'], themeVars['--aurora-3']]} amplitude={1.2} blend={0.6} />
      </div>

      <div className={`fixed top-0 left-0 w-full z-50 hidden md:flex justify-center pointer-events-none nav-dock-wrapper ${isNavVisible ? '' : 'nav-hidden-desktop'}`}>
        <div className="pointer-events-auto text-[var(--text-main)] transition-colors duration-500">
          <Dock items={dockItems} magnification={60} distance={150} dockHeight={64} />
        </div>
      </div>

      <div className={`fixed bottom-8 right-8 z-50 hidden md:block transition-all duration-700 ease-in-out ${isNavVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <label className="desk-switch">
          <input 
            type="checkbox" 
            className="desk-toggle" 
            checked={isDarkMode} 
            onChange={() => setIsDarkMode(!isDarkMode)} 
          />
          <div className="slider round border border-[var(--card-border)] shadow-lg transition-colors duration-500">
            <div className="sun-moon">
              <svg id="moon-dot-1" className="moon-dot" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
              <svg id="moon-dot-2" className="moon-dot" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
              <svg id="moon-dot-3" className="moon-dot" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
              <svg id="light-ray-1" className="light-ray" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
              <svg id="light-ray-2" className="light-ray" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
              <svg id="light-ray-3" className="light-ray" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
              <svg id="cloud-1" className="cloud-dark" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
              <svg id="cloud-2" className="cloud-dark" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
              <svg id="cloud-3" className="cloud-dark" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
              <svg id="cloud-4" className="cloud-light" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
              <svg id="cloud-5" className="cloud-light" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
              <svg id="cloud-6" className="cloud-light" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
            </div>
            <div className="stars">
              <svg id="star-1" className="star" viewBox="0 0 20 20"><path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" /></svg>
              <svg id="star-2" className="star" viewBox="0 0 20 20"><path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" /></svg>
              <svg id="star-3" className="star" viewBox="0 0 20 20"><path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" /></svg>
              <svg id="star-4" className="star" viewBox="0 0 20 20"><path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" /></svg>
            </div>
          </div>
        </label>
      </div>

      <div className="fixed bottom-6 right-6 z-50 md:hidden flex flex-col items-end gap-3">
        <div className={`flex flex-col gap-3 transition-all duration-300 origin-bottom ${isFabOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10 pointer-events-none'}`}>
          
          {dockItems.map((item, idx) => (
            <button 
              key={idx}
              onClick={() => { item.onClick(); setIsFabOpen(false); }}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-main)] shadow-[0_0_15px_rgba(82,39,255,0.2)] transition-colors duration-500"
              aria-label={item.label}
            >
              {item.icon}
            </button>
          ))}

          <label 
            className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-main)] shadow-[0_0_15px_rgba(82,39,255,0.2)] cursor-pointer themeToggle st-sunMoonThemeToggleBtn transition-colors duration-500"
            aria-label="Alternar Tema"
          >
            <input 
              type="checkbox" 
              className="themeToggleInput" 
              checked={!isDarkMode} 
              onChange={() => setIsDarkMode(!isDarkMode)} 
            />
            <svg width={22} height={22} viewBox="0 0 20 20" fill="currentColor" stroke="none">
              <mask id="moon-mask">
                <rect x={0} y={0} width={20} height={20} fill="white" />
                <circle cx={11} cy={3} r={8} fill="black" />
              </mask>
              <circle className="sunMoon" cx={10} cy={10} r={8} mask="url(#moon-mask)" />
              <g>
                <circle className="sunRay sunRay1" cx={18} cy={10} r="1.5" />
                <circle className="sunRay sunRay2" cx={14} cy="16.928" r="1.5" />
                <circle className="sunRay sunRay3" cx={6} cy="16.928" r="1.5" />
                <circle className="sunRay sunRay4" cx={2} cy={10} r="1.5" />
                <circle className="sunRay sunRay5" cx={6} cy="3.1718" r="1.5" />
                <circle className="sunRay sunRay6" cx={14} cy="3.1718" r="1.5" />
              </g>
            </svg>
          </label>
        </div>
        
        <button 
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 backdrop-blur-md shadow-[0_0_20px_rgba(82,39,255,0.4)] ${isFabOpen ? 'bg-[#5227FF]' : 'bg-[#5227FF] hover:bg-[#6b45ff]'}`}
          aria-label="Menú de navegación"
        >
          {isFabOpen ? <X size={26} color="#fff" /> : <Menu size={26} color="#fff" />}
        </button>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-12 pt-0 sm:pt-10 pb-12">
        
        <section id="about" className="flex flex-col lg:flex-row items-center justify-between min-h-[60vh] gap-12 Hero">
          <div className="flex-1 space-y-6">
            <BlurText 
              text="Hola, soy Jorge Silva." 
              className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--text-main)] hero-title transition-colors duration-500"
              delay={100}
            />
            
            <div className="flex flex-wrap items-center gap-3 text-2xl md:text-3xl font-light text-[var(--text-muted)] hero-subtitle transition-colors duration-500">
              <span>Desarrollador Frontend enfocado en</span>
              <RotatingText 
                texts={['React', 'Next.js', 'Tailwind CSS', 'TypeScript']}
                mainClassName="font-semibold text-[#FF9FFC]"
                staggerFrom="last"
                staggerDuration={0.05}
                rotationInterval={3000}
              />
            </div>

            <p className="text-[var(--text-muted)] text-lg max-w-xl leading-relaxed mt-6 hero-description transition-colors duration-500">
              Con experiencia creando interfaces de usuario modernas. Mi trabajo consiste en convertir los requisitos de negocio en soluciones técnicas eficientes, poniendo especial atención en el rendimiento y la experiencia del usuario.
            </p>

            <div className="pt-8 flex flex-col sm:flex-row gap-4 hero-buttons">
              <button onClick={handleDownloadCV} className={primaryBtnClass}>
                Descargar CV
              </button>
              <a href="mailto:jorgemichell1611@gmail.com" className={secondaryBtnClass}>
                Contactar
              </a>
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center items-center min-h-[300px] lg:min-h-[450px] relative">
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-2xl drop-shadow-[0_0_40px_rgba(82,39,255,0.15)]">
              {/* Contenido SVG mantenido intacto */}
              <defs>
                <linearGradient id="glassSurface" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--text-main)" stopOpacity="0.06" />
                  <stop offset="50%" stopColor="var(--text-main)" stopOpacity="0.01" />
                  <stop offset="100%" stopColor="var(--text-main)" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5227FF" />
                  <stop offset="100%" stopColor="#FF9FFC" />
                </linearGradient>
                <filter id="neonGlowSubtle" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur1" />
                  <feMerge>
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="15" stdDeviation="20" floodColor="#000000" floodOpacity="0.5" />
                </filter>
              </defs>

              <g id="particles" className="pulse-glow">
                <circle cx="150" cy="450" r="3" fill="#5227FF" filter="url(#neonGlowSubtle)" className="particle-slow" style={{animationDelay: "0s"}} />
                <circle cx="700" cy="200" r="4" fill="#FF9FFC" filter="url(#neonGlowSubtle)" className="particle-slow" style={{animationDelay: "-3s"}} />
                <circle cx="600" cy="500" r="2" fill="#5227FF" filter="url(#neonGlowSubtle)" className="particle-slow" style={{animationDelay: "-7s"}} />
                <circle cx="100" cy="150" r="5" fill="#FF9FFC" filter="url(#neonGlowSubtle)" className="particle-slow" style={{animationDelay: "-11s"}} />
              </g>

              <g id="connections">
                <path d="M 180 300 C 130 300, 150 240, 110 240" fill="none" stroke="var(--card-border)" strokeWidth="2" className="transition-colors duration-500" />
                <path d="M 180 300 C 130 300, 150 240, 110 240" fill="none" stroke="url(#primaryGradient)" strokeWidth="2" className="data-flow-active" filter="url(#neonGlowSubtle)" />
                <path d="M 620 220 C 660 220, 630 140, 670 140" fill="none" stroke="var(--card-border)" strokeWidth="2" className="transition-colors duration-500" />
                <path d="M 620 220 C 660 220, 630 140, 670 140" fill="none" stroke="#FF9FFC" strokeWidth="2" className="data-flow-reverse" filter="url(#neonGlowSubtle)" />
              </g>

              <g id="center-monitor" className="parallax-main" filter="url(#dropShadow)">
                <rect x="180" y="120" width="440" height="340" rx="14" fill="var(--svg-monitor)" stroke="var(--card-border)" strokeWidth="2" className="transition-colors duration-500" />
                <rect x="180" y="120" width="440" height="340" rx="14" fill="url(#glassSurface)" />
                <rect x="180" y="120" width="440" height="35" rx="14" fill="var(--svg-monitor)" stroke="var(--card-border)" strokeWidth="1" className="transition-colors duration-500" />
                <circle cx="205" cy="138" r="5" fill="#5227FF" />
                <circle cx="225" cy="138" r="5" fill="#FF9FFC" />
                
                <rect x="330" y="128" width="140" height="18" rx="9" fill="rgba(128, 128, 128, 0.1)" stroke="var(--card-border)" strokeWidth="1" className="transition-colors duration-500" />
                <text x="360" y="141" fill="var(--text-main)" opacity="0.8" fontFamily="sans-serif" fontSize="10" fontWeight="bold" className="transition-colors duration-500">localhost:3000</text>

                <rect x="290" y="170" width="315" height="180" rx="8" fill="rgba(128, 128, 128, 0.05)" stroke="var(--card-border)" strokeWidth="1" className="transition-colors duration-500" />
                
                <circle cx="340" cy="220" r="30" fill="none" stroke="#5227FF" strokeWidth="8" filter="url(#neonGlowSubtle)" />
                <circle cx="340" cy="220" r="30" fill="none" stroke="#FF9FFC" strokeWidth="8" strokeDasharray="120 188" strokeLinecap="round" />
                <text x="323" y="225" fill="var(--text-main)" opacity="0.8" fontFamily="sans-serif" fontSize="14" fontWeight="bold" className="transition-colors duration-500">84%</text>

                <rect x="410" y="200" width="12" height="50" rx="3" fill="#5227FF" />
                <rect x="435" y="180" width="12" height="70" rx="3" fill="url(#primaryGradient)" filter="url(#neonGlowSubtle)" />
                <rect x="460" y="210" width="12" height="40" rx="3" fill="#FF9FFC" />

                <rect x="305" y="275" width="285" height="60" rx="6" fill="rgba(82, 39, 255, 0.1)" stroke="var(--card-border)" className="transition-colors duration-500" />
                <path d="M 315 315 Q 350 280 390 310 T 460 290 T 520 315 T 575 285" fill="none" stroke="#FF9FFC" strokeWidth="3" strokeLinecap="round" filter="url(#neonGlowSubtle)" className="pulse-glow" />

                <rect x="290" y="365" width="315" height="80" rx="6" fill="var(--svg-monitor)" stroke="var(--card-border)" strokeWidth="1" className="transition-colors duration-500" />
                <text x="305" y="390" fill="#FF9FFC" className="font-code" fontSize="12">npm <tspan fill="var(--text-main)" opacity="0.8" className="transition-colors duration-500">run dev</tspan></text>
                <text x="305" y="410" fill="#5227FF" className="font-code" fontSize="12">&gt; <tspan fill="var(--text-main)" opacity="0.6" className="transition-colors duration-500">ready started server on 0.0.0.0:3000</tspan></text>
                <text x="305" y="430" fill="#5227FF" className="font-code" fontSize="12">&gt; <tspan fill="var(--text-main)" opacity="0.6" className="transition-colors duration-500">compiled client and server successfully</tspan></text>
              </g>

              <g id="card-1" className="parallax-card-1" filter="url(#dropShadow)">
                <rect x="30" y="180" width="160" height="120" rx="10" fill="var(--svg-monitor)" stroke="var(--card-border)" strokeWidth="1.5" className="transition-colors duration-500" />
                <rect x="30" y="180" width="160" height="120" rx="10" fill="url(#glassSurface)" />
                <text x="45" y="205" fill="var(--text-main)" opacity="0.8" fontFamily="sans-serif" fontSize="12" fontWeight="bold" className="transition-colors duration-500">Performance</text>
                <line x1="45" y1="215" x2="175" y2="215" stroke="var(--card-border)" strokeWidth="1" className="transition-colors duration-500" />
                <rect x="45" y="235" width="80" height="6" rx="3" fill="rgba(128, 128, 128, 0.2)" />
                <rect x="45" y="255" width="120" height="6" rx="3" fill="url(#primaryGradient)" />
              </g>

              <g id="card-2" className="parallax-card-2" filter="url(#dropShadow)">
                <rect x="580" y="80" width="190" height="110" rx="10" fill="var(--svg-monitor)" stroke="var(--card-border)" strokeWidth="1.5" className="transition-colors duration-500" />
                <rect x="580" y="80" width="190" height="110" rx="10" fill="url(#glassSurface)" />
                <text x="595" y="125" className="font-code" fontSize="11" fill="#FF9FFC">const <tspan fill="var(--text-main)" opacity="0.8" className="transition-colors duration-500">res =</tspan> await</text>
                <text x="595" y="145" className="font-code" fontSize="11" fill="var(--text-main)" opacity="0.8" className="transition-colors duration-500">fetch(<tspan fill="#5227FF">'/api/data'</tspan>);</text>
                <text x="595" y="165" className="font-code" fontSize="11" fill="var(--text-main)" opacity="0.8" className="transition-colors duration-500">return res.json();</text>
              </g>

              <g id="card-3" className="parallax-card-3" filter="url(#dropShadow)">
                <rect x="560" y="380" width="200" height="150" rx="12" fill="var(--svg-monitor)" stroke="var(--card-border)" strokeWidth="1.5" className="transition-colors duration-500" />
                <rect x="560" y="380" width="200" height="150" rx="12" fill="url(#glassSurface)" />
                <text x="580" y="410" fill="var(--text-main)" opacity="0.8" fontFamily="sans-serif" fontSize="14" fontWeight="bold" className="transition-colors duration-500">System Status</text>
                <rect x="580" y="430" width="160" height="30" rx="6" fill="rgba(82, 39, 255, 0.1)" stroke="var(--card-border)" className="transition-colors duration-500" />
                <circle cx="600" cy="445" r="5" fill="#FF9FFC" filter="url(#neonGlowSubtle)" className="pulse-glow" />
                <text x="615" y="449" fill="var(--text-main)" opacity="0.6" fontFamily="sans-serif" fontSize="11" className="transition-colors duration-500">Services Active</text>
                <text x="690" y="497" fill="var(--text-main)" fontFamily="sans-serif" fontSize="11" fontWeight="bold" className="transition-colors duration-500">Sync</text>
              </g>

              <g id="floating-code">
                <g className="parallax-code-1" transform="translate(40, 60) rotate(-15)">
                  <rect x="-10" y="-15" width="180" height="30" rx="6" fill="var(--svg-monitor)" stroke="var(--card-border)" className="transition-colors duration-500" />
                  <text x="0" y="4" className="font-code" fontSize="13" fill="var(--text-main)" opacity="0.7" className="transition-colors duration-500">&lt;<tspan fill="#FF9FFC">div</tspan> <tspan fill="#5227FF">className</tspan>="..."&gt;</text>
                </g>
                <g className="parallax-code-2" transform="translate(60, 480) rotate(10)">
                  <rect x="-10" y="-15" width="140" height="30" rx="6" fill="var(--svg-monitor)" stroke="var(--card-border)" className="transition-colors duration-500" />
                  <text x="0" y="4" className="font-code" fontSize="13" fill="var(--text-main)" opacity="0.8" className="transition-colors duration-500">{`{ `}<tspan fill="#5227FF">renderUI()</tspan>{` }`}</text>
                </g>
              </g>
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#5227FF]/10 blur-[120px] rounded-full pointer-events-none"></div>
          </div>
        </section>

        {/* --- TECH LOGO LOOP SECTION --- */}
        <section className="mt-20 pt-10 pb-10 border-t border-[var(--glass-border)] border-b tech-logos TechStackLoop transition-colors duration-500">
          <p className="text-center text-[var(--text-muted)] font-medium mb-8 text-sm tracking-widest uppercase transition-colors duration-500">Mi Stack Tecnológico</p>
          <div style={{ height: '80px', position: 'relative', overflow: 'hidden' }}>
            <LogoLoop 
              logos={techLogos} 
              speed={100}
              direction="left"
              logoHeight={45}
              gap={80}
              hoverSpeed={0}
              scaleOnHover={true}
              fadeOut={true}
              fadeOutColor="var(--bg-main)"
              ariaLabel="Stack Tecnológico"
            />
          </div>
        </section>

        {/* --- 2. SKILLS / VALOR (MAGIC BENTO) --- */}
        <section id="skills" className="mt-24 skills-section Skills">
          <BlurText text="Habilidades & Valor" className="text-4xl md:text-5xl font-bold mb-12 justify-center text-center w-full" direction="bottom" />
          <div className="flex justify-center">
            <MagicBento 
              enableStars={true} 
              enableSpotlight={true} 
              glowColor={isDarkMode ? "82, 39, 255" : "200, 200, 200"} 
              particleCount={15}
            />
          </div>
        </section>

        {/* --- 3. PROYECTOS (SCROLL STACK CON PREVIEWS LAZY) --- */}
        <section id="projects" className="mt-16 sm:mt-24 pt-4 relative projects-section Projects">
          <BlurText text="Proyectos Destacados" className="text-4xl md:text-5xl font-bold justify-center mb-2 w-full text-center" direction="bottom" />
          <p className="text-[var(--text-muted)] mb-8 text-center text-lg transition-colors duration-500">Un vistazo a mis desarrollos más recientes.</p>
          
          <div className="min-h-[200vh] scroll-container-fixed">
            <ScrollStack 
              useWindowScroll={true} 
              itemDistance={200} 
              baseScale={0.88} 
              blurAmount={0} 
              stackPosition="15%"
            >
              {/* PROYECTO 1: Cruz Roja */}
              <ScrollStackItem itemClassName="bg-[var(--card-bg)] border border-[var(--card-border)] flex flex-col md:flex-row overflow-hidden min-h-min md:min-h-[450px] h-auto md:h-[450px] group project-item transition-colors duration-500 shadow-sm">
                <div className="p-5 sm:p-6 md:p-12 flex-1 flex flex-col justify-center project-content z-10">
                  <span className="text-[#FF9FFC] font-mono text-sm tracking-wider mb-3 block">Desarrollador Full Stack</span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-main)] mb-3 sm:mb-5 project-title transition-colors duration-500">Ambulatorio Cruz Roja</h3>
                  <p className="text-[var(--text-muted)] text-sm sm:text-base mb-5 sm:mb-8 leading-relaxed project-description transition-colors duration-500">
                    Diseñé y desarrollé un ecosistema web completo para la gestión de servicios médicos, programas de formación y coordinación de voluntariado, integrando soluciones de geolocalización.
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 project-tags">
                    <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#5227FF]/10 border border-[#5227FF]/30 rounded-full text-xs sm:text-sm text-[var(--text-main)] tag-item transition-colors duration-500">Next.js</span>
                    <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#5227FF]/10 border border-[#5227FF]/30 rounded-full text-xs sm:text-sm text-[var(--text-main)] tag-item transition-colors duration-500">FastAPI</span>
                    <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#5227FF]/10 border border-[#5227FF]/30 rounded-full text-xs sm:text-sm text-[var(--text-main)] tag-item transition-colors duration-500">OpenStreetMap</span>
                  </div>
                </div>
                
                <a href="https://cruz-roja-frontend.vercel.app/" target="_blank" rel="noopener noreferrer" className="w-full shrink-0 md:flex-1 bg-[var(--bg-main)] border-t md:border-t-0 md:border-l border-[var(--card-border)] relative h-[250px] sm:h-[350px] md:h-auto overflow-hidden group cursor-pointer block transition-colors duration-500">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-300 z-10 pointer-events-none"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                     <span className="bg-[#5227FF] text-white px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(82,39,255,0.6)] font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                       Visitar Sitio <ExternalLink size={18} />
                     </span>
                  </div>
                  {/* AQUÍ APLICAMOS EL LAZY IFRAME */}
                  <LazyIframe src="https://cruz-roja-frontend.vercel.app/" title="Preview Cruz Roja" />
                </a>
              </ScrollStackItem>

              {/* PROYECTO 2: NETGEN (Bekka) */}
              <ScrollStackItem itemClassName="bg-[var(--card-bg)] border border-[var(--card-border)] flex flex-col md:flex-row overflow-hidden min-h-min md:min-h-[450px] h-auto md:h-[450px] group project-item transition-colors duration-500 shadow-sm">
                <div className="p-5 sm:p-6 md:p-12 flex-1 flex flex-col justify-center project-content z-10">
                  <span className="text-[#FF9FFC] font-mono text-sm tracking-wider mb-3 block">Desarrollador Frontend • NETGEN</span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-main)] mb-3 sm:mb-5 project-title transition-colors duration-500">Sistema E-commerce Bekka</h3>
                  <p className="text-[var(--text-muted)] text-sm sm:text-base mb-5 sm:mb-8 leading-relaxed project-description transition-colors duration-500">
                    Desarrollo completo de la interfaz de usuario web construyéndola desde cero. Creación del sistema de gestión de usuarios y panel de control con un responsive design consistente.
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 project-tags">
                    <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#5227FF]/10 border border-[#5227FF]/30 rounded-full text-xs sm:text-sm text-[var(--text-main)] tag-item transition-colors duration-500">React</span>
                    <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#5227FF]/10 border border-[#5227FF]/30 rounded-full text-xs sm:text-sm text-[var(--text-main)] tag-item transition-colors duration-500">Tailwind CSS</span>
                    <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#5227FF]/10 border border-[#5227FF]/30 rounded-full text-xs sm:text-sm text-[var(--text-main)] tag-item transition-colors duration-500">JavaScript</span>
                  </div>
                </div>

                <a href="http://bekkacorporation.com/" target="_blank" rel="noopener noreferrer" className="w-full shrink-0 md:flex-1 bg-[var(--bg-main)] border-t md:border-t-0 md:border-l border-[var(--card-border)] relative h-[250px] sm:h-[350px] md:h-auto overflow-hidden group cursor-pointer block transition-colors duration-500">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-300 z-10 pointer-events-none"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                     <span className="bg-[#5227FF] text-white px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(82,39,255,0.6)] font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                       Visitar Sitio <ExternalLink size={18} />
                     </span>
                  </div>
                  {/* AQUÍ APLICAMOS EL LAZY IFRAME */}
                  <LazyIframe src="http://bekkacorporation.com/" title="Preview Bekka" />
                </a>
              </ScrollStackItem>

              {/* PROYECTO 3: NETGEN (Academia / Fender) */}
              <ScrollStackItem itemClassName="bg-[var(--card-bg)] border border-[var(--card-border)] flex flex-col md:flex-row overflow-hidden min-h-min md:min-h-[450px] h-auto md:h-[450px] group project-item transition-colors duration-500 shadow-sm">
                <div className="p-5 sm:p-6 md:p-12 flex-1 flex flex-col justify-center project-content z-10">
                  <span className="text-[#FF9FFC] font-mono text-sm tracking-wider mb-3 block">Desarrollador Frontend • NETGEN</span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-main)] mb-3 sm:mb-5 project-title transition-colors duration-500">Landing Page Fender</h3>
                  <p className="text-[var(--text-muted)] text-sm sm:text-base mb-5 sm:mb-8 leading-relaxed project-description transition-colors duration-500">
                    Integración de IA a través de una API para evaluación de writing y speaking. Desarrollo de landing pages adaptativas garantizando la entrega eficiente de consultas y gestión de leads.
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 project-tags">
                    <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#5227FF]/10 border border-[#5227FF]/30 rounded-full text-xs sm:text-sm text-[var(--text-main)] tag-item transition-colors duration-500">Next.js</span>
                    <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#5227FF]/10 border border-[#5227FF]/30 rounded-full text-xs sm:text-sm text-[var(--text-main)] tag-item transition-colors duration-500">IA API</span>
                    <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#5227FF]/10 border border-[#5227FF]/30 rounded-full text-xs sm:text-sm text-[var(--text-main)] tag-item transition-colors duration-500">Tailwind CSS</span>
                  </div>
                </div>
                
                <a href="https://fendermedical.com/" target="_blank" rel="noopener noreferrer" className="w-full shrink-0 md:flex-1 bg-[var(--bg-main)] border-t md:border-t-0 md:border-l border-[var(--card-border)] relative h-[250px] sm:h-[350px] md:h-auto overflow-hidden group cursor-pointer block transition-colors duration-500">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-300 z-10 pointer-events-none"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                     <span className="bg-[#5227FF] text-white px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(82,39,255,0.6)] font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                       Visitar Sitio <ExternalLink size={18} />
                     </span>
                  </div>
                  {/* AQUÍ APLICAMOS EL LAZY IFRAME */}
                  <LazyIframe src="https://fendermedical.com/" title="Preview Fender" />
                </a>
              </ScrollStackItem>
            </ScrollStack>
          </div>
        </section>

        {/* --- 4. CONTACTO (id="contact") --- */}
        <section id="contact" className=" pt-20 pb-16 border-t border-[var(--glass-border)] text-center relative z-10 contact-section Contacto transition-colors duration-500">
          <BlurText text="¿Trabajamos juntos?" className="text-4xl md:text-6xl font-bold text-[var(--text-main)] justify-center mb-8 flex text-center w-full contact-title transition-colors duration-500" direction="bottom" />
          <p className="text-[var(--text-muted)] text-lg mb-12 max-w-2xl mx-auto contact-description transition-colors duration-500">
            Busco oportunidades donde pueda aportar mi experiencia para desarrollar interfaces y ecosistemas web modernos. Si tienes un proyecto en mente, hablemos.
          </p>
          <a href="mailto:jorgemichell1611@gmail.com" className={primaryBtnClass}>
            Contactar por Email
          </a>
        </section>

      </div>

      {/* --- 5. FOOTER CON REDES SOCIALES --- */}
      <footer className="border-t border-[var(--glass-border)] bg-[var(--footer-bg)] backdrop-blur-md py-10 relative z-20 flex flex-col items-center justify-center gap-6 mt-10 transition-colors duration-500">
        <div className="flex items-center gap-8">
          <a href="https://github.com/JorgeM11" target="_blank" rel="noopener noreferrer" className="group relative text-[var(--text-muted)] transition-colors duration-300 hover:text-[var(--text-main)]">
            <FiGithub size={28} className="transform transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute -inset-2 bg-[var(--text-main)]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
          <a href="https://www.linkedin.com/in/jorge-silva-317191347?utm_source=share_via&utm_content=profile&utm_medium=member_androids" target="_blank" rel="noopener noreferrer" className="group relative text-[var(--text-muted)] transition-colors duration-300 hover:text-[#0A66C2]">
            <FiLinkedin size={28} className="transform transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute -inset-2 bg-[#0A66C2]/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
          <a href="mailto:jorgemichell1611@gmail.com" className="group relative text-[var(--text-muted)] transition-colors duration-300 hover:text-[#FF9FFC]">
            <Mail size={32} className="transform transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute -inset-2 bg-[#FF9FFC]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-[var(--text-muted)] text-sm font-light text-center transition-colors duration-500">
            © {new Date().getFullYear()} Jorge Silva. Todos los derechos reservados.
          </p>
          <p className="text-[var(--text-muted)] text-xs font-mono text-center transition-colors duration-500">
            Desarrollado con Next.js, Tailwind CSS & Framer Motion
          </p>
        </div>
      </footer>

    </main>
  );
}