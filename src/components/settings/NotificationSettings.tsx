import { BellIcon } from '@primer/octicons-react';
import { type FC, useContext } from 'react';
import { AppContext } from '../../context/App';
import { GroupBy } from '../../types';
import { Checkbox } from '../fields/Checkbox';
import { RadioGroup } from '../fields/RadioGroup';
import { Legend } from './Legend';

export const NotificationSettings: FC = () => {
  const { settings, updateSetting } = useContext(AppContext);

  return (
    <fieldset>
      <Legend icon={BellIcon}>Notifications</Legend>
      <RadioGroup
        name="groupBy"
        label="Group by:"
        value={settings.groupBy}
        options={[
          { label: 'Repository', value: GroupBy.REPOSITORY },
          { label: 'Date', value: GroupBy.DATE },
        ]}
        onChange={(evt) => {
          updateSetting('groupBy', evt.target.value as GroupBy);
        }}
      />

      <Checkbox
        name="markAsDoneOnOpen"
        label="Mark as done on open"
        checked={settings.markAsDoneOnOpen}
        onChange={(evt) =>
          updateSetting('markAsDoneOnOpen', evt.target.checked)
        }
        tooltip={
          <div>
            <strong>Mark as Done</strong> feature is supported in GitHub Cloud
            and GitHub Enterprise Server 3.13 or later.
          </div>
        }
      />
      <Checkbox
        name="markAsDoneOnUnsubscribe"
        label="Mark as done on unsubscribe"
        checked={settings.markAsDoneOnUnsubscribe}
        onChange={(evt) =>
          updateSetting('markAsDoneOnUnsubscribe', evt.target.checked)
        }
        tooltip={
          <div>
            <strong>Mark as Done</strong> feature is supported in GitHub Cloud
            and GitHub Enterprise Server 3.13 or later.
          </div>
        }
      />
      <Checkbox
        name="delayNotificationState"
        label="Delay notification state"
        checked={settings.delayNotificationState}
        onChange={(evt) =>
          updateSetting('delayNotificationState', evt.target.checked)
        }
        tooltip={
          <div>
            Keep the notification within Gitify window upon interaction (click,
            mark as read, mark as done, etc) until the next refresh window
            (scheduled or user initiated).
          </div>
        }
      />
    </fieldset>
  );
};
