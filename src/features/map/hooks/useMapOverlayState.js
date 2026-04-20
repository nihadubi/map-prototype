import { useCallback, useEffect, useState } from 'react';

export function useMapOverlayState() {
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);
  const [isSidebarHoverOpen, setIsSidebarHoverOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPinCardExpanded, setIsPinCardExpanded] = useState(false);
  const [locateMessage, setLocateMessage] = useState('');
  const isSidebarOpen = isSidebarDrawerOpen || isSidebarHoverOpen;

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
    setIsSidebarDrawerOpen(false);
    setIsSidebarHoverOpen(false);
    setIsSettingsOpen(false);
    setIsPinCardExpanded(false);
  }, []);

  const openSidebarDrawer = useCallback(() => {
    setIsSidebarDrawerOpen(true);
  }, []);

  const closeSidebarDrawer = useCallback(() => {
    setIsSidebarDrawerOpen(false);
  }, []);

  const toggleSidebarDrawer = useCallback(() => {
    setIsSidebarDrawerOpen((current) => !current);
  }, []);

  const openSidebarHover = useCallback(() => {
    setIsSidebarHoverOpen(true);
  }, []);

  const closeSidebarHover = useCallback(() => {
    setIsSidebarHoverOpen(false);
  }, []);

  const resetSidebarHover = useCallback(() => {
    setIsSidebarHoverOpen(false);
  }, []);

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
