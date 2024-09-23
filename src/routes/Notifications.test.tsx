import { render } from '@testing-library/react';
import { mockAccountNotifications } from '../__mocks__/notifications-mocks';
import { AppContext } from '../context/App';
import { Errors } from '../utils/errors';
import { NotificationsRoute } from './Notifications';

jest.mock('../components/notifications/AccountNotifications', () => ({
  AccountNotifications: () => <p>AccountNotifications</p>,
}));

jest.mock('../components/AllRead', () => ({
  AllRead: () => <p>AllRead</p>,
}));

jest.mock('../components/Oops', () => ({
  Oops: () => <p>Oops</p>,
}));

describe('routes/Notifications.tsx', () => {
  it('should render itself & its children (with notifications)', () => {
    const tree = render(
      <AppContext.Provider value={{ notifications: mockAccountNotifications }}>
        <NotificationsRoute />
      </AppContext.Provider>,
    );

    expect(tree).toMatchSnapshot();
  });

  it('should render itself & its children', () => {
    const tree = render(
      <AppContext.Provider value={{ notifications: [] }}>
        <NotificationsRoute />
      </AppContext.Provider>,
    );

    expect(tree).toMatchSnapshot();
  });

  describe('should render itself & its children (error conditions - oops)', () => {
    it('bad credentials', () => {
      const tree = render(
        <AppContext.Provider
          value={{
            notifications: [],
            status: 'error',
            globalError: Errors.BAD_CREDENTIALS,
          }}
        >
          <NotificationsRoute />
        </AppContext.Provider>,
      );

      expect(tree).toMatchSnapshot();
    });

    it('unknown error', () => {
      const tree = render(
        <AppContext.Provider
          value={{
            notifications: [],
            status: 'error',
            globalError: Errors.UNKNOWN,
          }}
        >
          <NotificationsRoute />
        </AppContext.Provider>,
      );

      expect(tree).toMatchSnapshot();
    });

    it('default error', () => {
      const tree = render(
        <AppContext.Provider
          value={{
            notifications: [],
            status: 'error',
            globalError: null,
          }}
        >
          <NotificationsRoute />
        </AppContext.Provider>,
      );

      expect(tree).toMatchSnapshot();
    });
  });
});
