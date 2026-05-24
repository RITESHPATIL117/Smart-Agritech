import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/** Fade + slide up when element enters viewport */
export const AnimatedSection = ({ children, className = '', delay = 0, as: Tag = 'div' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`motion-safe transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  );
};

/** Page-level fade on route change */
export const AnimatedPage = ({ children }) => {
  const location = useLocation();
  return (
    <div key={location.pathname} className='animate-page-enter motion-safe'>
      {children}
    </div>
  );
};

/** Child of a grid — pass index for stagger delay */
export const StaggerItem = ({ children, index = 0, className = '' }) => (
  <AnimatedSection delay={index * 80} className={className}>
    {children}
  </AnimatedSection>
);

export default AnimatedSection;
