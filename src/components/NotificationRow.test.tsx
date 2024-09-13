import { fireEvent, render, screen } from '@testing-library/react';
import {
  mockAtlassianCloudAccount,
  mockAuth,
  mockSettings,
} from '../__mocks__/state-mocks';
import { AppContext } from '../context/App';
import { GroupBy, type Link } from '../types';
import { mockSingleNotification } from '../utils/api/__mocks__/response-mocks';
import type { UserType } from '../utils/api/typesGitHub';
import * as comms from '../utils/comms';
import * as links from '../utils/links';
import { NotificationRow } from './NotificationRow';

describe('components/NotificationRow.tsx', () => {
  jest.spyOn(links, 'openNotification');
  jest.spyOn(comms, 'openExternalLink').mockImplementation();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render itself & its children - group by date', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('2024').valueOf());

    const props = {
      notification: mockSingleNotification,
      account: mockAtlassianCloudAccount,
    };

    const tree = render(
      <AppContext.Provider
        value={{ settings: { ...mockSettings, groupBy: GroupBy.DATE } }}
      >
        <NotificationRow {...props} />
      </AppContext.Provider>,
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render itself & its children - group by repositories', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('2024').valueOf());

    const props = {
      notification: mockSingleNotification,
      account: mockAtlassianCloudAccount,
    };

    const tree = render(
      <AppContext.Provider
        value={{ settings: { ...mockSettings, groupBy: GroupBy.REPOSITORY } }}
      >
        <NotificationRow {...props} />
      </AppContext.Provider>,
    );
    expect(tree).toMatchSnapshot();
  });

  describe('notification interactions', () => {
    it('should open a notification in the browser - click', () => {
      const markNotificationRead = jest.fn();

      const props = {
        notification: mockSingleNotification,
        account: mockAtlassianCloudAccount,
      };

      render(
        <AppContext.Provider
          value={{
            settings: mockSettings,
            markNotificationRead,
            auth: mockAuth,
          }}
        >
          <NotificationRow {...props} />
        </AppContext.Provider>,
      );

      fireEvent.click(screen.getByRole('main'));
      expect(links.openNotification).toHaveBeenCalledTimes(1);
      expect(markNotificationRead).toHaveBeenCalledTimes(1);
    });

    it('should open a notification in the browser - delay notification setting enabled', () => {
      const markNotificationRead = jest.fn();

      const props = {
        notification: mockSingleNotification,
        account: mockAtlassianCloudAccount,
      };

      render(
        <AppContext.Provider
          value={{
            settings: {
              ...mockSettings,
              delayNotificationState: true,
            },
            markNotificationRead,
            auth: mockAuth,
          }}
        >
          <NotificationRow {...props} />
        </AppContext.Provider>,
      );

      fireEvent.click(screen.getByRole('main'));
      expect(links.openNotification).toHaveBeenCalledTimes(1);
      expect(markNotificationRead).toHaveBeenCalledTimes(1);
    });

    it('should open a notification in the browser - key down', () => {
      const markNotificationRead = jest.fn();

      const props = {
        notification: mockSingleNotification,
        account: mockAtlassianCloudAccount,
      };

      render(
        <AppContext.Provider
          value={{
            settings: mockSettings,
            markNotificationRead,
            auth: mockAuth,
          }}
        >
          <NotificationRow {...props} />
        </AppContext.Provider>,
      );

      fireEvent.click(screen.getByRole('main'));
      expect(links.openNotification).toHaveBeenCalledTimes(1);
      expect(markNotificationRead).toHaveBeenCalledTimes(1);
    });

    it('should mark a notification as read', () => {
      const markNotificationRead = jest.fn();

      const props = {
        notification: mockSingleNotification,
        account: mockAtlassianCloudAccount,
      };

      render(
        <AppContext.Provider
          value={{
            settings: mockSettings,
            markNotificationRead,
          }}
        >
          <NotificationRow {...props} />
        </AppContext.Provider>,
      );

      fireEvent.click(screen.getByTitle('Mark as Read'));
      expect(markNotificationRead).toHaveBeenCalledTimes(1);
    });

    it('should mark a notification as done', () => {
      const markNotificationDone = jest.fn();

      const props = {
        notification: mockSingleNotification,
        account: mockAtlassianCloudAccount,
      };

      render(
        <AppContext.Provider
          value={{ settings: mockSettings, markNotificationDone }}
        >
          <NotificationRow {...props} />
        </AppContext.Provider>,
      );

      fireEvent.click(screen.getByTitle('Mark as Done'));
      expect(markNotificationDone).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe from a notification thread', () => {
      const unsubscribeNotification = jest.fn();

      const props = {
        notification: mockSingleNotification,
        account: mockAtlassianCloudAccount,
      };

      render(
        <AppContext.Provider value={{}}>
          <AppContext.Provider
            value={{ settings: mockSettings, unsubscribeNotification }}
          >
            <NotificationRow {...props} />
          </AppContext.Provider>
        </AppContext.Provider>,
      );
      fireEvent.click(screen.getByTitle('Unsubscribe from Thread'));
      expect(unsubscribeNotification).toHaveBeenCalledTimes(1);
    });

    it('should open notification user profile', () => {
      const openExternalLinkMock = jest.spyOn(comms, 'openExternalLink');

      const props = {
        notification: {
          ...mockSingleNotification,
          subject: {
            ...mockSingleNotification.subject,
            user: {
              login: 'some-user',
              html_url: 'https://github.com/some-user' as Link,
              avatar_url:
                'https://avatars.githubusercontent.com/u/123456789?v=4' as Link,
              type: 'User' as UserType,
            },
            reviews: null,
          },
        },
        account: mockAtlassianCloudAccount,
      };

      render(
        <AppContext.Provider
          value={{
            settings: { ...mockSettings },
            auth: mockAuth,
          }}
        >
          <NotificationRow {...props} />
        </AppContext.Provider>,
      );

      fireEvent.click(screen.getByTitle('View User Profile'));
      expect(openExternalLinkMock).toHaveBeenCalledTimes(1);
      expect(openExternalLinkMock).toHaveBeenCalledWith(
        props.notification.subject.user.html_url,
      );
    });
  });
});
