import { DetailedHTMLProps, IframeHTMLAttributes } from 'react';

type IframeProps = DetailedHTMLProps<
  IframeHTMLAttributes<HTMLIFrameElement>,
  HTMLIFrameElement
>;

export type NotificationsProps = Omit<IframeProps, 'src'> & {
  locale?: 'confluence' | 'jira' | string;
  product?: string;
  testId?: string;
};
