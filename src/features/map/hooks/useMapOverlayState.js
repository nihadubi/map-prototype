import { useCallback, useEffect, useState } from 'react';

export function useMapOverlayState() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPinCardExpanded, setIsPinCardExpanded] = useState(false);
  const [locateMessage, setLocateMessage] = useState('');

  useEffect(() => {
    if (!locateMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setLocateMessage('');
    }, 4200);

    return () => window.clearTimeout(timeoutId);
  }, [locateMessage]);

  const closePanels = useCallback(() => {
    setIsSidebarOpen(false);
    setIsSettingsOpen(false);
    setIsPinCardExpanded(false);
  }, []);

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isPinCardExpanded,
    setIsPinCardExpanded,
    locateMessage,
    setLocateMessage,
    closePanels,
  };
}
