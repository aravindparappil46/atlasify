import {
  type FC,
  Fragment,
  type MouseEvent,
  useContext,
  useMemo,
  useState,
} from 'react';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import Badge from '@atlaskit/badge';
import { IconButton } from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronLeftIcon from '@atlaskit/icon/glyph/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import HipchatMediaAttachmentCountIcon from '@atlaskit/icon/glyph/hipchat/media-attachment-count';
import { BitbucketIcon } from '@atlaskit/logo';
import { Box, Flex, Inline, Stack } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { AppContext } from '../../context/App';
import type {
  Account,
  AtlassifyError,
  AtlassifyNotification,
} from '../../types';
import { Constants } from '../../utils/constants';
import { openAccountProfile, openMyPullRequests } from '../../utils/links';
import { AllRead } from '../AllRead';
import { Oops } from '../Oops';
import { NotificationRow } from './NotificationRow';
import { ProductNotifications } from './ProductNotifications';
interface IAccountNotifications {
  account: Account;
  notifications: AtlassifyNotification[];
  error: AtlassifyError | null;
}

export const AccountNotifications: FC<IAccountNotifications> = (
  props: IAccountNotifications,
) => {
  const { account, notifications } = props;

  const { markNotificationsRead, settings } = useContext(AppContext);

  const [showAccountNotifications, setShowAccountNotifications] =
    useState(true);

  const groupedNotifications = Object.values(
    notifications?.reduce(
      (acc: { [key: string]: AtlassifyNotification[] }, notification) => {
        const key = notification.product.name;
        if (!acc[key]) acc[key] = [];
        acc[key].push(notification);
        return acc;
      },
      {},
    ),
  ).sort((a, b) => a[0].product.name.localeCompare(b[0].product.name));

  const toggleAccountNotifications = () => {
    setShowAccountNotifications(!showAccountNotifications);
  };

  const hasNotifications = useMemo(
    () => notifications.length > 0,
    [notifications],
  );

  const ChevronIcon = !hasNotifications
    ? ChevronLeftIcon
    : showAccountNotifications
      ? ChevronDownIcon
      : ChevronRightIcon;

  const toggleAccountNotificationsLabel = !hasNotifications
    ? 'No notifications for account'
    : showAccountNotifications
      ? 'Hide account notifications'
      : 'Show account notifications';

  return (
    <Stack>
      <Box
        onClick={toggleAccountNotifications}
        paddingInline="space.100"
        paddingBlock="space.050"
        backgroundColor={
          props.error
            ? 'color.background.accent.red.subtler'
            : 'color.background.brand.subtlest'
        }
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Inline space="space.100" alignBlock="center">
            <Tooltip content="Open account profile" position="right">
              <AvatarItem
                avatar={
                  <Avatar
                    name={account.name}
                    src={account.avatar}
                    size="xsmall"
                    appearance="circle"
                  />
                }
                primaryText={account.name}
                onClick={(event: MouseEvent<HTMLElement>) => {
                  // Don't trigger onClick of parent element.
                  event.stopPropagation();
                  openAccountProfile(account);
                }}
                testId="account-profile"
              />
            </Tooltip>{' '}
            <Badge
              appearance="primary"
              max={Constants.MAX_NOTIFICATIONS_PER_ACCOUNT - 1}
            >
              {notifications.length}
            </Badge>
          </Inline>

          <Inline space="space.100">
            <Tooltip content="My pull requests" position="bottom">
              <IconButton
                label="My pull requests"
                icon={(iconProps) => (
                  <BitbucketIcon {...iconProps} size="xsmall" />
                )}
                shape="circle"
                spacing="compact"
                appearance="subtle"
                onClick={(event: MouseEvent<HTMLElement>) => {
                  // Don't trigger onClick of parent element.
                  event.stopPropagation();
                  openMyPullRequests();
                }}
                testId="account-pull-requests"
              />
            </Tooltip>

            <Tooltip
              content="Mark all account notifications as read"
              position="bottom"
            >
              <IconButton
                label="Mark all account notifications as read"
                icon={(iconProps) => (
                  <HipchatMediaAttachmentCountIcon
                    {...iconProps}
                    size="small"
                  />
                )}
                shape="circle"
                spacing="compact"
                appearance="subtle"
                onClick={(event: MouseEvent<HTMLElement>) => {
                  // Don't trigger onClick of parent element.
                  event.stopPropagation();
                  markNotificationsRead(notifications);
                }}
                testId="account-mark-as-read"
              />
            </Tooltip>

            <Tooltip
              content={toggleAccountNotificationsLabel}
              position="bottom"
            >
              <IconButton
                label={toggleAccountNotificationsLabel}
                icon={ChevronIcon}
                shape="circle"
                spacing="compact"
                appearance="subtle"
                testId="account-toggle"
              />
            </Tooltip>
          </Inline>
        </Flex>
      </Box>

      {showAccountNotifications && (
        <Fragment>
          {props.error && <Oops error={props.error} />}
          {!hasNotifications && !props.error && <AllRead />}
          {settings.groupNotificationsByProduct
            ? Object.values(groupedNotifications).map(
                (productNotifications) => {
                  return (
                    <ProductNotifications
                      key={productNotifications[0].product.name}
                      productNotifications={productNotifications}
                    />
                  );
                },
              )
            : notifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                />
              ))}
        </Fragment>
      )}
    </Stack>
  );
};
