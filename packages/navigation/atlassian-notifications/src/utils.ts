import { NotificationsProps } from './types';

type Args = Pick<NotificationsProps, 'locale' | 'product'>;

export const getNotificationsSrc = ({ locale, product }: Args) => {
  const path = '/home/notificationsDrawer/iframe.html';
  const query = [];

  if (locale) {
    query.push(`locale=${encodeURIComponent(locale)}`);
  }

  if (product) {
    query.push(`product=${encodeURIComponent(product)}`);
  }

  if (!query.length) {
    return path;
  }

  return `${path}?${query.join('&')}`;
};
