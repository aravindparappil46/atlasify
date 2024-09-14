import Avatar from '@atlaskit/avatar';
import Tooltip from '@atlaskit/tooltip';
import { ReadIcon, UnreadIcon } from '@primer/octicons-react';
import { type FC, useCallback, useContext, useState } from 'react';
import { AppContext } from '../context/App';
import { type AtlasifyNotification, Opacity, Size } from '../types';
import { cn } from '../utils/cn';
import { formatNotificationUpdatedAt } from '../utils/helpers';
import { openNotification } from '../utils/links';
import { HoverGroup } from './HoverGroup';
import { InteractionButton } from './buttons/InteractionButton';
import { NotificationFooter } from './notification/NotificationFooter';
import { NotificationHeader } from './notification/NotificationHeader';
import PresenceActiveIcon from '@atlaskit/icon/glyph/presence-active';
// import { IconButton } from '@atlaskit/button/new';

interface INotificationRow {
  notification: AtlasifyNotification;
  isAnimated?: boolean;
  isRead?: boolean;
}

export const NotificationRow: FC<INotificationRow> = ({
  notification,
  isAnimated = false,
  isRead = false,
}: INotificationRow) => {
  const { settings, markNotificationRead, markNotificationUnread } =
    useContext(AppContext);
  const [animateExit, setAnimateExit] = useState(false);
  const [showAsRead, setShowAsRead] = useState(false);

  const handleNotification = useCallback(() => {
    setAnimateExit(!settings.delayNotificationState);
    setShowAsRead(settings.delayNotificationState);

    openNotification(notification);

    markNotificationRead(notification);
  }, [notification, markNotificationRead, settings]);

  const notificationTitle = notification.subject.title.trim();

  const updatedAt = formatNotificationUpdatedAt(notification);
  const updatedLabel = notification.subject.user
    ? `${notification.subject.user.login} updated ${updatedAt}`
    : `Updated ${updatedAt}`;

  return (
    <div
      id={notification.id}
      className={cn(
        'group flex border-b border-gray-100 bg-white px-3 py-2 hover:bg-gray-100 dark:border-gray-darker dark:bg-gray-dark dark:text-white dark:hover:bg-gray-darker',
        (isAnimated || animateExit) &&
          'translate-x-full opacity-0 transition duration-[350ms] ease-in-out',
        (isRead || showAsRead) && Opacity.READ,
      )}
    >
      <div className="mr-3 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Tooltip content={notification.subject.user.login}>
            <Avatar
              name={notification.subject.user.login}
              src={notification.subject.user.avatar_url}
              size="small"
              // onClick={() => openAccountProfile(account)}
            />
          </Tooltip>
          {notification.unread && (
            <>
              <Tooltip content="Unread">
                <PresenceActiveIcon
                  label="unread"
                  size="small"
                  primaryColor="blue-200"
                />
              </Tooltip>

              {/* <Tooltip content="Mark as unread">
                <IconButton
                  shape="circle"
                  appearance="subtle"
                  icon={(iconProps) => (
                    <PresenceActiveIcon {...iconProps} size="small" />
                  )}
                  label="Mark as unread"
                />
              </Tooltip> */}
            </>
          )}
        </div>
      </div>

      <div
        className="flex-1 truncate cursor-pointer"
        onClick={() => handleNotification()}
      >
        <NotificationHeader notification={notification} />

        <div
          className="flex gap-1 items-center mb-1 truncate text-sm"
          role="main"
          title={notificationTitle}
        >
          <span className="truncate">{notification.subject.title}</span>
          <span className="text-xs" title={updatedLabel}>
            {updatedAt}
          </span>
        </div>

        <NotificationFooter notification={notification} />
      </div>

      {!animateExit && (
        <HoverGroup>
          {notification.unread && (
            <InteractionButton
              title="Mark as Read"
              icon={ReadIcon}
              size={Size.SMALL}
              onClick={() => {
                setAnimateExit(!settings.delayNotificationState);
                setShowAsRead(settings.delayNotificationState);
                markNotificationRead(notification);
              }}
            />
          )}
          {!notification.unread && (
            <InteractionButton
              title="Mark as Unread"
              icon={UnreadIcon}
              size={Size.SMALL}
              onClick={() => {
                setAnimateExit(!settings.delayNotificationState);
                setShowAsRead(false);
                markNotificationUnread(notification);
              }}
            />
          )}
        </HoverGroup>
      )}
    </div>
  );
};
