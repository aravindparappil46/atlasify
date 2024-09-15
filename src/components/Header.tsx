import { type FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconButton } from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import { Inline } from '@atlaskit/primitives';

import { AppContext } from '../context/App';

interface IHeader {
  children: string;
  fetchOnBack?: boolean;
}

export const Header: FC<IHeader> = (props: IHeader) => {
  const navigate = useNavigate();

  const { fetchNotifications } = useContext(AppContext);

  return (
    <div className="mx-8 mt-2 py-2">
      <Inline grow="fill" spread="space-between">
        <IconButton
          label="Go Back"
          title="Go Back"
          icon={ArrowLeftIcon}
          appearance="subtle"
          shape="circle"
          onClick={() => {
            navigate(-1);
            if (props.fetchOnBack) {
              fetchNotifications();
            }
          }}
        />

        <Heading size="medium">{props.children}</Heading>
      </Inline>
    </div>
  );
};
