import log from 'electron-log';
import { useCallback, useState } from 'react';
import type {
  Account,
  AccountNotifications,
  AtlasifyError,
  AtlasifyNotification,
  AtlasifyState,
  Status,
} from '../types';
import { markNotificationsAsRead } from '../utils/api/client';
import {
  getAllNotifications,
  setTrayIconColor,
  triggerNativeNotifications,
} from '../utils/notifications';
import { removeNotification } from '../utils/remove-notification';
import { removeNotifications } from '../utils/remove-notifications';

interface NotificationsState {
  notifications: AccountNotifications[];
  removeAccountNotifications: (account: Account) => Promise<void>;
  fetchNotifications: (state: AtlasifyState) => Promise<void>;
  markNotificationRead: (
    state: AtlasifyState,
    notification: AtlasifyNotification,
  ) => Promise<void>;
  markProductNotificationsRead: (
    state: AtlasifyState,
    notification: AtlasifyNotification,
  ) => Promise<void>;
  status: Status;
  globalError: AtlasifyError;
}

export const useNotifications = (): NotificationsState => {
  const [status, setStatus] = useState<Status>('success');
  const [globalError, setGlobalError] = useState<AtlasifyError>();

  const [notifications, setNotifications] = useState<AccountNotifications[]>(
    [],
  );

  const removeAccountNotifications = useCallback(
    async (account: Account) => {
      setStatus('loading');

      const updatedNotifications = notifications.filter(
        (notification) => notification.account !== account,
      );

      setNotifications(updatedNotifications);
      setTrayIconColor(updatedNotifications);
      setStatus('success');
    },
    [notifications],
  );

  const fetchNotifications = useCallback(
    async (state: AtlasifyState) => {
      setStatus('loading');
      setGlobalError(null);

      console.log(
        'ADAM FETCHING WITH PARAM',
        state.settings.fetchOnlyUnreadNotifications,
      );

      const fetchedNotifications = await getAllNotifications(state);

      // Set Global Error if all accounts have the same error
      const allAccountsHaveErrors = fetchedNotifications.every((account) => {
        return account.error !== null;
      });
      let accountErrorsAreAllSame = true;
      const accountError = fetchedNotifications[0]?.error;
      for (const fetchedNotification of fetchedNotifications) {
        if (accountError !== fetchedNotification.error) {
          accountErrorsAreAllSame = false;
          break;
        }
      }

      if (allAccountsHaveErrors) {
        setStatus('error');
        setGlobalError(accountErrorsAreAllSame ? accountError : null);
        return;
      }

      setNotifications(fetchedNotifications);
      triggerNativeNotifications(notifications, fetchedNotifications, state);
      setStatus('success');
    },
    [notifications],
  );

  const markNotificationRead = useCallback(
    async (state: AtlasifyState, notification: AtlasifyNotification) => {
      setStatus('loading');

      try {
        await markNotificationsAsRead(notification.account, [notification.id]);

        const updatedNotifications = removeNotification(
          state.settings,
          notification,
          notifications,
        );

        setNotifications(updatedNotifications);
        setTrayIconColor(updatedNotifications);
      } catch (err) {
        log.error('Error occurred while marking notification as read', err);
      }

      setStatus('success');
    },
    [notifications],
  );

  const markProductNotificationsRead = useCallback(
    async (state: AtlasifyState, notification: AtlasifyNotification) => {
      setStatus('loading');

      // const repoSlug = notification.repository.full_name;

      try {
        // await markRepositoryNotificationsAsRead(
        //   repoSlug,
        //   notification.account.token,
        // );

        const updatedNotifications = removeNotifications(
          state.settings,
          notification,
          notifications,
        );

        setNotifications(updatedNotifications);
        setTrayIconColor(updatedNotifications);
      } catch (err) {
        log.error(
          'Error occurred while marking repository notifications as read',
          err,
        );
      }

      setStatus('success');
    },
    [notifications],
  );

  return {
    status,
    globalError,
    notifications,

    removeAccountNotifications,
    fetchNotifications,
    markNotificationRead,
    markProductNotificationsRead,
  };
};
