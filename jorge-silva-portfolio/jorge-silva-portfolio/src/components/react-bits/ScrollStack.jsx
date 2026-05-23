'use client';

import React, { useLayoutEffect, useEffect, useRef, useCallback, useState } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';

export const ScrollStackItem = ({ children, itemClassName = '', isMobile = false }) => {
  
  // --- VERSIÓN MÓVIL / TABLET (ANIMACIÓN FLUIDA EN SCROLL) ---
  if (isMobile) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        // FIX: amount: 0.15 exige que el 15% de la tarjeta esté visible.
        // margin negativo abajo ayuda a que no espere hasta el final de la pantalla.
        viewport={{ once: false, amount: 0.15, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`relative w-full rounded-[30px] sm:rounded-[40px] shadow-[0_10px_30px_rgba(82,39,255,0.08)] overflow-hidden ${itemClassName}`.trim()}
      >
        {children}
      </motion.div>
    );
  }

  // --- VERSIÓN DESKTOP (LA ANIMACIÓN DE APILADO ACTUAL) ---
  return (
    <div className="scroll-stack-wrapper relative w-full">
      <div
        className={`scroll-stack-card relative w-full rounded-[40px] shadow-[0_0_30px_rgba(0,0,0,0.1)] box-border origin-top will-change-transform ${itemClassName}`.trim()}
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          transform: 'translateZ(0)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL (RUTEO MÓVIL VS DESKTOP) ---
const ScrollStack = (props) => {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // Asumimos móvil primero para mejor performance

  useEffect(() => {
    setMounted(true);
    const checkScreen = () => {
      // 1024px suele ser el punto de quiebre para laptops
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Si no ha montado o es móvil/tablet, devolvemos el contenedor con poco espacio
  if (!mounted || isMobile) {
    return (
      <div className={`relative w-full flex flex-col gap-10 sm:gap-14 pb-12 ${props.className || ''}`}>
        {React.Children.map(props.children, (child) => {
          if (React.isValidElement(child)) {
            // Le pasamos la bandera isMobile al Item para que active Framer Motion
            return React.cloneElement(child, { isMobile: true });
          }
          return child;
        })}
      </div>
    );
  }

  // Si es Laptop/Desktop, cargamos la animación compleja
  return <AnimatedScrollStack {...props} />;
};

// --- LÓGICA DE ANIMACIÓN DESKTOP ---
const AnimatedScrollStack = ({
  children,
  className = '',
  itemDistance = 120,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  useWindowScroll = false,
  onStackComplete
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const wrappersRef = useRef([]);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);
  const [stackHeight, setStackHeight] = useState(0);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller?.scrollTop || 0,
        containerHeight: scroller?.clientHeight || 0,
        scrollContainer: scroller
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    element => {
      if (!element) return 0;
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      } else {
        return element.offsetTop;
      }
    },
    [useWindowScroll]
  );

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || !wrappersRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = useWindowScroll
      ? document.querySelector('.scroll-stack-end')
      : scrollerRef.current?.querySelector('.scroll-stack-end');

    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      const wrapper = wrappersRef.current[i];
      if (!card || !wrapper) return;

      const cardTop = getElementOffset(wrapper);
      
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = { translateY, scale };
      const lastTransform = lastTransformsRef.current.get(i);

      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.05 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001;

      if (hasChanged) {
        card.style.transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale})`;
        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale,
    useWindowScroll, onStackComplete, calculateProgress, parsePercentage, getScrollData, getElementOffset
  ]);

  useEffect(() => {
    let rafId;
    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      infinite: false,
      lerp: 0.1
    });

    lenis.on('scroll', () => {
      updateCardTransforms();
    });

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [updateCardTransforms]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller && !useWindowScroll) return;

    const wrappers = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-wrapper')
        : scroller.querySelectorAll('.scroll-stack-wrapper')
    );
    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card')
    );

    wrappersRef.current = wrappers;
    cardsRef.current = cards;
    
    let totalHeight = 0;
    
    wrappers.forEach((wrapper, i) => {
      totalHeight += wrapper.offsetHeight;
      if (i < wrappers.length - 1) {
        wrapper.style.marginBottom = `${itemDistance}px`;
        totalHeight += itemDistance;
      }
    });

    cards.forEach((card) => {
      card.style.transformOrigin = 'top center';
    });

    setStackHeight(totalHeight);
    updateCardTransforms();

    return () => {
      stackCompletedRef.current = false;
      wrappersRef.current = [];
      cardsRef.current = [];
      lastTransformsRef.current.clear();
      isUpdatingRef.current = false;
    };
  }, [itemDistance, useWindowScroll, updateCardTransforms]);

  const containerStyles = useWindowScroll
    ? { transform: 'translateZ(0)', willChange: 'scroll-position' }
    : { scrollBehavior: 'smooth', willChange: 'scroll-position' };

  const containerClassName = useWindowScroll
    ? `relative w-full ${className}`.trim()
    : `relative w-full h-full overflow-y-auto overflow-x-visible ${className}`.trim();

  const innerContainerStyle = useWindowScroll ? {} : { minHeight: `${stackHeight + 300}px` };

  return (
    <div className={containerClassName} ref={scrollerRef} style={containerStyles}>
      <div className="scroll-stack-inner pt-[10vh] px-0 pb-[30rem] min-h-screen" style={innerContainerStyle}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { isMobile: false });
          }
          return child;
        })}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;