import { useCallback, useEffect, useRef, useState } from 'react';

const SIDEBAR_HOVER_CLOSE_DELAY_MS = 110;

export function useMapOverlayState() {
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);
  const [isSidebarHoverOpen, setIsSidebarHoverOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPinCardExpanded, setIsPinCardExpanded] = useState(false);
  const [locateMessage, setLocateMessage] = useState('');
  const sidebarHoverCloseTimeoutRef = useRef(null);
  const isSidebarOpen = isSidebarDrawerOpen || isSidebarHoverOpen;

  const clearSidebarHoverCloseTimeout = useCallback(() => {
    if (sidebarHoverCloseTimeoutRef.current) {
      window.clearTimeout(sidebarHoverCloseTimeoutRef.current);
      sidebarHoverCloseTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!locateMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setLocateMessage('');
    }, 4200);

    return () => window.clearTimeout(timeoutId);
  }, [locateMessage]);

  useEffect(() => {
    return () => {
      clearSidebarHoverCloseTimeout();
    };
  }, [clearSidebarHoverCloseTimeout]);

  const closePanels = useCallback(() => {
    clearSidebarHoverCloseTimeout();
    setIsSidebarDrawerOpen(false);
    setIsSidebarHoverOpen(false);
    setIsSettingsOpen(false);
    setIsPinCardExpanded(false);
  }, [clearSidebarHoverCloseTimeout]);

  const openSidebarDrawer = useCallback(() => {
    clearSidebarHoverCloseTimeout();
    setIsSidebarDrawerOpen(true);
  }, [clearSidebarHoverCloseTimeout]);

  const closeSidebarDrawer = useCallback(() => {
    clearSidebarHoverCloseTimeout();
    setIsSidebarDrawerOpen(false);
  }, [clearSidebarHoverCloseTimeout]);

  const toggleSidebarDrawer = useCallback(() => {
    clearSidebarHoverCloseTimeout();
    setIsSidebarDrawerOpen((current) => !current);
  }, [clearSidebarHoverCloseTimeout]);

  const openSidebarHover = useCallback(() => {
    clearSidebarHoverCloseTimeout();
    setIsSidebarHoverOpen(true);
  }, [clearSidebarHoverCloseTimeout]);

  const closeSidebarHover = useCallback(() => {
    clearSidebarHoverCloseTimeout();
    sidebarHoverCloseTimeoutRef.current = window.setTimeout(() => {
      setIsSidebarHoverOpen(false);
      sidebarHoverCloseTimeoutRef.current = null;
    }, SIDEBAR_HOVER_CLOSE_DELAY_MS);
  }, [clearSidebarHoverCloseTimeout]);

  const resetSidebarHover = useCallback(() => {
    clearSidebarHoverCloseTimeout();
    setIsSidebarHoverOpen(false);
  }, [clearSidebarHoverCloseTimeout]);

  return {
    isSidebarOpen,
    isSidebarBackdropVisible: isSidebarDrawerOpen,
    openSidebarDrawer,
    closeSidebarDrawer,
    toggleSidebarDrawer,
    openSidebarHover,
    closeSidebarHover,
    resetSidebarHover,
    isSettingsOpen,
    setIsSettingsOpen,
    isPinCardExpanded,
    setIsPinCardExpanded,
    locateMessage,
    setLocateMessage,
    closePanels,
  };
}
