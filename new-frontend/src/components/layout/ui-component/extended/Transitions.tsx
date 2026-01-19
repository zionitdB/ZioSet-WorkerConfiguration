import React, { useEffect, useRef, useState } from 'react';

interface TransitionsProps {
  children: React.ReactNode;
  show: boolean;
  type?: 'grow' | 'collapse' | 'fade' | 'slide' | 'zoom';
  position?: 'top-left' | 'top-right' | 'top' | 'bottom-left' | 'bottom-right' | 'bottom';
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  unmountOnExit?: boolean; // optional prop to unmount when hidden
}

export default function Transitions({
  children,
  show,
  type = 'grow',
  position = 'top-left',
  direction = 'up',
  className = '',
  unmountOnExit = true,
}: TransitionsProps) {
  const [display, setDisplay] = useState(show);
  const nodeRef = useRef<HTMLDivElement>(null);

  // transform origins based on position
  const origins: Record<string, string> = {
    'top-left': 'origin-top-left',
    'top-right': 'origin-top-right',
    'top': 'origin-top',
    'bottom-left': 'origin-bottom-left',
    'bottom-right': 'origin-bottom-right',
    'bottom': 'origin-bottom',
  };
  const originClass = origins[position] ?? 'origin-top-left';

  // Mapping transition classes
  const transitionClasses: Record<string, any> = {
    grow: {
      enter: 'transition-transform duration-200 ease-out',
      enterFrom: 'scale-75 opacity-0',
      enterTo: 'scale-100 opacity-100',
      leave: 'transition-transform duration-150 ease-in',
      leaveFrom: 'scale-100 opacity-100',
      leaveTo: 'scale-75 opacity-0',
    },
    collapse: {
      enter: 'transition-all duration-200 ease-out',
      enterFrom: 'max-h-0 opacity-0',
      enterTo: 'max-h-screen opacity-100',
      leave: 'transition-all duration-150 ease-in',
      leaveFrom: 'max-h-screen opacity-100',
      leaveTo: 'max-h-0 opacity-0',
    },
    fade: {
      enter: 'transition-opacity duration-200 ease-out',
      enterFrom: 'opacity-0',
      enterTo: 'opacity-100',
      leave: 'transition-opacity duration-150 ease-in',
      leaveFrom: 'opacity-100',
      leaveTo: 'opacity-0',
    },
    slide: {
      enter: 'transition-transform duration-200 ease-out',
      leave: 'transition-transform duration-150 ease-in',
      enterFrom: {
        up: 'translate-y-2 opacity-0',
        down: '-translate-y-2 opacity-0',
        left: 'translate-x-2 opacity-0',
        right: '-translate-x-2 opacity-0',
      }[direction],
      enterTo: 'translate-y-0 opacity-100',
      leaveFrom: 'translate-y-0 opacity-100',
      leaveTo: {
        up: 'translate-y-2 opacity-0',
        down: '-translate-y-2 opacity-0',
        left: 'translate-x-2 opacity-0',
        right: '-translate-x-2 opacity-0',
      }[direction],
    },
    zoom: {
      enter: 'transition-transform duration-200 ease-out',
      enterFrom: 'scale-90 opacity-0',
      enterTo: 'scale-100 opacity-100',
      leave: 'transition-transform duration-150 ease-in',
      leaveFrom: 'scale-100 opacity-100',
      leaveTo: 'scale-90 opacity-0',
    },
  };

  const t = transitionClasses[type];

  // We track internal state to control mounting/unmounting and animation states
  const [status, setStatus] = useState<'enter' | 'entered' | 'leave' | 'left'>(
    show ? 'entered' : 'left'
  );

  useEffect(() => {
    if (show) {
      // Start enter transition
      setDisplay(true);
      setStatus('enter');
      // Next frame -> apply enterTo classes
      requestAnimationFrame(() => {
        setStatus('entered');
      });
    } else {
      // Start leave transition
      setStatus('leave');
      // After leave duration, hide element
      const timeout = setTimeout(() => {
        setStatus('left');
        if (unmountOnExit) setDisplay(false);
      }, type === 'collapse' ? 150 : 200); // approximate leave duration based on type

      return () => clearTimeout(timeout);
    }
  }, [show, type, unmountOnExit]);

  if (!display) return null;

  // Determine classes to apply based on status
  let baseClasses = '';
  let stateClasses = '';

  if (status === 'enter') {
    baseClasses = `${t.enter} ${originClass}`;
    stateClasses = typeof t.enterFrom === 'string' ? t.enterFrom : '';
  } else if (status === 'entered') {
    baseClasses = `${t.enter} ${originClass}`;
    stateClasses = t.enterTo;
  } else if (status === 'leave') {
    baseClasses = `${t.leave} ${originClass}`;
    stateClasses = t.leaveFrom;
  } else if (status === 'left') {
    baseClasses = '';
    stateClasses = '';
  }

  // For slide type, enterFrom and leaveTo can be objects, so we do fallback above

  return (
    <div
      ref={nodeRef}
      className={`${className} ${baseClasses} ${stateClasses}`}
      aria-hidden={!show}
    >
      {children}
    </div>
  );
}
