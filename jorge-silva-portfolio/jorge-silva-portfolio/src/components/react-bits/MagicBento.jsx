'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

const cardData = [
  {
    color: 'var(--card-bg)',
    title: 'React & Next.js',
    description: 'Desarrollo de aplicaciones web ultrarrápidas, modernas y seguras para brindarle la mejor experiencia a tus usuarios.',
    label: 'Frontend Core',
    svg: (
      <svg viewBox="0 0 100 100" className="absolute -bottom-8 -right-8 w-56 h-56 opacity-15 svg-spin pointer-events-none z-0">
        <circle cx="50" cy="50" r="8" fill="#FF9FFC" />
        <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="#5227FF" strokeWidth="2" transform="rotate(0 50 50)" />
        <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="#5227FF" strokeWidth="2" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="#5227FF" strokeWidth="2" transform="rotate(120 50 50)" />
      </svg>
    )
  },
  {
    color: 'var(--card-bg)',
    title: 'Tailwind CSS',
    description: 'Diseños atractivos y 100% adaptables.',
    label: 'UI & Styling',
    svg: (
      <svg viewBox="0 0 100 100" className="absolute top-1/2 right-[-20%] -translate-y-1/2 w-40 h-40 opacity-15 svg-float pointer-events-none z-0">
        <path d="M10,50 Q25,20 50,50 T90,50" fill="none" stroke="#FF9FFC" strokeWidth="8" strokeLinecap="round" />
        <path d="M10,70 Q25,40 50,70 T90,70" fill="none" stroke="#5227FF" strokeWidth="8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    color: 'var(--card-bg)',
    title: 'FastAPI',
    description: 'APIs y bases de datos eficientes.',
    label: 'Backend',
    svg: (
      <svg viewBox="0 0 100 100" className="absolute -bottom-4 -right-4 w-32 h-32 opacity-15 svg-pulse pointer-events-none z-0">
        <rect x="20" y="20" width="60" height="15" rx="4" fill="none" stroke="#5227FF" strokeWidth="3" />
        <rect x="20" y="45" width="60" height="15" rx="4" fill="none" stroke="#FF9FFC" strokeWidth="3" />
        <rect x="20" y="70" width="60" height="15" rx="4" fill="none" stroke="#5227FF" strokeWidth="3" />
        <circle cx="30" cy="27.5" r="3" fill="#5227FF" />
        <circle cx="30" cy="52.5" r="3" fill="#FF9FFC" />
        <circle cx="30" cy="77.5" r="3" fill="#5227FF" />
      </svg>
    )
  },
  {
    color: 'var(--card-bg)',
    title: 'Responsive & Animaciones',
    description: 'Interfaces interactivas con GSAP y Framer Motion para que navegar por tu web sea un placer.',
    label: 'Experiencia',
    svg: (
      <svg viewBox="0 0 100 100" className="absolute -bottom-10 right-0 w-48 h-48 opacity-15 svg-float pointer-events-none z-0" style={{ animationDelay: '1s' }}>
        <rect x="15" y="25" width="45" height="50" rx="4" fill="none" stroke="#5227FF" strokeWidth="3" />
        <rect x="50" y="40" width="25" height="40" rx="3" fill="var(--card-bg)" stroke="#FF9FFC" strokeWidth="3" />
        <circle cx="62.5" cy="73" r="1.5" fill="#FF9FFC" />
      </svg>
    )
  },
  {
    color: 'var(--card-bg)',
    title: 'Performance',
    description: 'Optimización de carga y métricas web para ayudar a que tu sitio posicione mejor en Google (SEO).',
    label: 'Rendimiento',
    svg: (
      <svg viewBox="0 0 100 100" className="absolute bottom-2 right-2 w-28 h-28 opacity-15 pointer-events-none z-0">
        <path d="M20,80 L40,50 L60,60 L90,20" fill="none" stroke="#FF9FFC" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="svg-pulse" />
        <circle cx="90" cy="20" r="4" fill="#5227FF" className="svg-pulse" />
      </svg>
    )
  },
  {
    color: 'var(--card-bg)',
    title: 'Arquitectura',
    description: 'Sistemas construidos para crecer con tu empresa. Código ordenado, escalable y mantenible.',
    label: 'Ingeniería',
    svg: (
      <svg viewBox="0 0 100 100" className="absolute -bottom-6 -right-6 w-36 h-36 opacity-15 svg-spin pointer-events-none z-0" style={{ animationDuration: '20s' }}>
        <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="#5227FF" strokeWidth="2" />
        <polygon points="50,25 75,40 75,65 50,80 25,65 25,40" fill="none" stroke="#FF9FFC" strokeWidth="2" />
        <circle cx="50" cy="50" r="5" fill="#5227FF" />
      </svg>
    )
  }
];

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = radius => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const ParticleCard = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false
}) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseMove = e => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleClick = e => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const spotlightRef = useRef(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = e => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      isInsideSection.current = mouseInside || false;
      const cards = gridRef.current.querySelectorAll('.card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        cards.forEach(card => card.style.setProperty('--glow-intensity', '0'));
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach(card => {
        const cardElement = card;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.1, ease: 'power2.out' });

      const targetOpacity = minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlightRef.current, { opacity: targetOpacity, duration: targetOpacity > 0 ? 0.2 : 0.5, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      isInsideSection.current = false;
      gridRef.current?.querySelectorAll('.card').forEach(card => card.style.setProperty('--glow-intensity', '0'));
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid = ({ children, gridRef }) => (
  <div
    className="bento-section grid p-3 max-w-[64rem] mx-auto select-none relative"
    style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.5rem)' }}
    ref={gridRef}
  >
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const MagicBento = ({
  textAutoHide = false,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true
}) => {
  const gridRef = useRef(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <>
      <style>
        {`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --glow-color: ${glowColor};
            --border-color: var(--card-border);
            --background-dark: var(--card-bg);
            --white: var(--text-main);
          }
          
          @keyframes spin-slow { 100% { transform: rotate(360deg); } }
          @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          @keyframes pulse-soft { 0%, 100% { opacity: 0.05; } 50% { opacity: 0.15; } }
          
          .svg-spin { animation: spin-slow 15s linear infinite; transform-origin: center; }
          .svg-float { animation: float 6s ease-in-out infinite; }
          .svg-pulse { animation: pulse-soft 4s ease-in-out infinite; }

          .card-responsive { display: grid; gap: 16px; width: 100%; margin: 0 auto; }
          
          @media (min-width: 1024px) {
            .card-responsive { grid-template-columns: repeat(4, 1fr); grid-auto-rows: 180px; }
            .card-responsive .card:nth-child(1) { grid-column: span 2; grid-row: span 2; }
            .card-responsive .card:nth-child(2) { grid-column: span 1; grid-row: span 1; }
            .card-responsive .card:nth-child(3) { grid-column: span 1; grid-row: span 1; }
            .card-responsive .card:nth-child(4) { grid-column: span 2; grid-row: span 1; }
            .card-responsive .card:nth-child(5) { grid-column: span 2; grid-row: span 1; }
            .card-responsive .card:nth-child(6) { grid-column: span 2; grid-row: span 1; }
          }
          
          @media (min-width: 600px) and (max-width: 1023px) {
            .card-responsive { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 180px; }
            .card-responsive .card:nth-child(1) { grid-column: span 2; grid-row: span 2; }
            .card-responsive .card:nth-child(4) { grid-column: span 2; grid-row: span 1; }
            .card-responsive .card { grid-column: span 1; grid-row: span 1; }
          }

          @media (max-width: 599px) {
            .card-responsive { grid-template-columns: 1fr; grid-auto-rows: minmax(240px, auto); gap: 16px; padding: 0; }
            .card-responsive .card { grid-column: span 1 !important; grid-row: span 1 !important; }
          }
          
          .card--border-glow::after {
            content: ''; position: absolute; inset: 0; padding: 2px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%, transparent 60%);
            border-radius: inherit;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none; opacity: 1; transition: opacity 0.3s ease; z-index: 1;
          }
          
          .card--border-glow:hover::after { opacity: 1; }
          .card--border-glow:hover { box-shadow: 0 4px 20px rgba(46, 24, 78, 0.4), 0 0 30px rgba(${glowColor}, 0.2); }
          .particle::before { content: ''; position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px; background: rgba(${glowColor}, 0.2); border-radius: 50%; z-index: -1; }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight gridRef={gridRef} disableAnimations={shouldDisableAnimations} enabled={enableSpotlight} spotlightRadius={spotlightRadius} glowColor={glowColor} />
      )}

      <BentoCardGrid gridRef={gridRef}>
        <div className="card-responsive">
          {cardData.map((card, index) => {
            const baseClassName = `card flex flex-col justify-between relative w-full h-full p-6 lg:p-8 rounded-[24px] border border-solid border-[var(--card-border)] overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] ${enableBorderGlow ? 'card--border-glow' : ''}`;

            const cardStyle = {
              backgroundColor: card.color || 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-main)',
              '--glow-x': '50%', '--glow-y': '50%', '--glow-intensity': '0', '--glow-radius': '200px'
            };

            const CardContent = () => (
              <>
                {card.svg && card.svg}
                <div className="card__header flex justify-between gap-3 relative z-10">
                  <span className="card__label font-mono text-xs md:text-sm tracking-wider text-[#FF9FFC] uppercase">{card.label}</span>
                </div>
                <div className="card__content flex flex-col relative z-10 mt-auto pt-4 text-[var(--text-main)]">
                  <h3 className="card__title font-bold text-xl md:text-2xl m-0 mb-3">{card.title}</h3>
                  <p className="card__description text-sm md:text-base leading-relaxed text-[var(--text-muted)]">{card.description}</p>
                </div>
              </>
            );

            if (enableStars) {
              return (
                <ParticleCard key={index} className={baseClassName} style={cardStyle} disableAnimations={shouldDisableAnimations} particleCount={particleCount} glowColor={glowColor} enableTilt={enableTilt} clickEffect={clickEffect} enableMagnetism={enableMagnetism}>
                  <CardContent />
                </ParticleCard>
              );
            }

            return (
              <div
                key={index} className={baseClassName} style={cardStyle}
                onMouseMove={e => {
                  if (shouldDisableAnimations) return;
                  const el = e.currentTarget;
                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                  const centerX = rect.width / 2; const centerY = rect.height / 2;
                  if (enableTilt) gsap.to(el, { rotateX: ((y - centerY) / centerY) * -10, rotateY: ((x - centerX) / centerX) * 10, duration: 0.1, ease: 'power2.out', transformPerspective: 1000 });
                  if (enableMagnetism) gsap.to(el, { x: (x - centerX) * 0.05, y: (y - centerY) * 0.05, duration: 0.3, ease: 'power2.out' });
                }}
                onMouseLeave={e => {
                  if (shouldDisableAnimations) return;
                  const el = e.currentTarget;
                  if (enableTilt) gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.3, ease: 'power2.out' });
                  if (enableMagnetism) gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
                }}
                onClick={e => {
                  if (!clickEffect || shouldDisableAnimations) return;
                  const el = e.currentTarget;
                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                  const maxDistance = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height));
                  const ripple = document.createElement('div');
                  ripple.style.cssText = `position: absolute; width: ${maxDistance * 2}px; height: ${maxDistance * 2}px; border-radius: 50%; background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%); left: ${x - maxDistance}px; top: ${y - maxDistance}px; pointer-events: none; z-index: 1000;`;
                  el.appendChild(ripple);
                  gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() });
                }}
              >
                <CardContent />
              </div>
            );
          })}
        </div>
      </BentoCardGrid>
    </>
  );
};

export default MagicBento;