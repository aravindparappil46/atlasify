import type { AtlasifyState } from '../types';
import { Constants } from './constants';

export function loadState(): AtlasifyState {
  const existing = localStorage.getItem(Constants.STORAGE_KEY);
  const { auth, settings } = (existing && JSON.parse(existing)) || {};
  return { auth, settings };
}

export function saveState(gitifyState: AtlasifyState) {
  const auth = gitifyState.auth;
  const settings = gitifyState.settings;
  const settingsString = JSON.stringify({ auth, settings });
  localStorage.setItem(Constants.STORAGE_KEY, settingsString);
}

export function clearState() {
  localStorage.clear();
}
