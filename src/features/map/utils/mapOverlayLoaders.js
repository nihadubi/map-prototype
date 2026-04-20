let addPinPanelPromise;
let settingsPanelPromise;
let pinCardPromise;

export function loadAddPinPanelModule() {
  if (!addPinPanelPromise) {
    addPinPanelPromise = import('../../pins/components/add-pin/AddPinPanel');
  }

  return addPinPanelPromise;
}

export function loadSettingsPanelModule() {
  if (!settingsPanelPromise) {
    settingsPanelPromise = import('../components/overlay/SettingsPanel');
  }

  return settingsPanelPromise;
}

export function loadPinCardModule() {
  if (!pinCardPromise) {
    pinCardPromise = import('../components/overlay/PinCard');
  }

  return pinCardPromise;
}
