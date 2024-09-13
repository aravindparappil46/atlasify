import { KeyIcon } from '@primer/octicons-react';
import type { FC } from 'react';
import type { Size } from '../../types';
import type { AuthMethod } from '../../utils/auth/types';

export interface IAuthMethodIcon {
  type: AuthMethod;
  size: Size;
}

export const AuthMethodIcon: FC<IAuthMethodIcon> = (props: IAuthMethodIcon) => {
  return (
    <span title={props.type} className="mr-1">
      {props.type === 'API Token' && <KeyIcon size={props.size} />}
    </span>
  );
};
