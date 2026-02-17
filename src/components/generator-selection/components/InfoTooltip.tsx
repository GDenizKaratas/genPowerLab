import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, X } from '../icons';

interface InfoTooltipProps {
  title: string;
  content: string;
}

export function InfoTooltip({ title, content }: InfoTooltipProps) {
  const [mode, setMode] = useState<'closed' | 'tooltip' | 'modal'>('closed');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  const updatePosition = useCallback(() => {
    if (mode !== 'tooltip' || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const tooltipWidth = 240;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    // Keep within viewport
    if (left < 8) left = 8;
    if (left + tooltipWidth > window.innerWidth - 8) left = window.innerWidth - tooltipWidth - 8;

    // Show above or below based on space
    const spaceAbove = rect.top;
    if (spaceAbove > 120) {
      setTooltipStyle({
        position: 'fixed',
        top: rect.top - 8,
        left,
        width: tooltipWidth,
        transform: 'translateY(-100%)',
        zIndex: 9999,
      });
    } else {
      setTooltipStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left,
        width: tooltipWidth,
        zIndex: 9999,
      });
    }
  }, [mode]);

  useEffect(() => {
    if (mode === 'tooltip') {
      updatePosition();
    }
  }, [mode, updatePosition]);

  useEffect(() => {
    if (mode === 'closed') return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        tooltipRef.current?.contains(target)
      ) return;
      setMode('closed');
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setMode('closed');
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mode]);

  const handleToggle = () => {
    setMode(mode === 'closed' ? 'tooltip' : 'closed');
  };

  const tooltipElement = mode === 'tooltip' && createPortal(
    <div ref={tooltipRef} style={tooltipStyle}>
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 text-left">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-900">{title}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMode('modal')}
              className="text-gray-400 hover:text-blue-500 text-[10px] px-1 py-0.5 rounded hover:bg-gray-100 transition-colors"
              title="Tam ekran"
            >
              ↗
            </button>
            <button
              onClick={() => setMode('closed')}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
        <p className="text-[11px] text-gray-600 leading-relaxed">{content}</p>
      </div>
    </div>,
    document.body
  );

  const modalElement = mode === 'modal' && createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) setMode('closed'); }}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={() => setMode('closed')}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
        <button
          onClick={() => setMode('closed')}
          className="mt-5 w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Anladım
        </button>
      </div>
    </div>,
    document.body
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="text-gray-400 hover:text-blue-500 transition-colors p-0.5"
        aria-label={`${title} hakkında bilgi`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      {tooltipElement}
      {modalElement}
    </>
  );
}
