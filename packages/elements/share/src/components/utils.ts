import {
  Email,
  EmailValidationResponse,
  isEmail,
  isValidEmail,
  OptionData,
  Value,
} from '@atlaskit/user-picker';
import memoizeOne from 'memoize-one';
import {
  ConfigResponse,
  ConfigResponseMode,
  User,
  UserWithEmail,
} from '../types';

type InviteWarningType = 'ADMIN' | 'DIRECT';

const matchAllowedDomains = memoizeOne(
  (domain: string, config: ConfigResponse | undefined) => {
    return (
      config &&
      config.allowedDomains &&
      config.allowedDomains.indexOf(domain) !== -1
    );
  },
);

const cannotInvite = (
  config: ConfigResponse,
  userDomains: Set<string>,
): boolean => {
  for (const domain of userDomains) {
    if (!matchAllowedDomains(domain, config)) {
      return true;
    }
  }
  return false;
};

const extractDomain = (email: string) => email.replace(/^[^@]+@(.+)$/, '$1');

const removeDuplicates = (values: Set<string>, nextValue: string) =>
  values.add(nextValue);

const checkDomains = (
  config: ConfigResponse,
  selectedUsers: Email[],
): boolean => {
  const usersDomain = selectedUsers.reduce(
    (set, email) => removeDuplicates(set, extractDomain(email.id)),
    new Set<string>(),
  );
  return cannotInvite(config, usersDomain);
};

/**
 * Decides if the admin notified flag should be shown
 *
 * @param config share configuration object
 * @param selectedUsers selected users in the user picker
 */
export const showAdminNotifiedFlag = (
  config: ConfigResponse | undefined,
  selectedUsers: Value,
): boolean => getInviteWarningType(config, selectedUsers) === 'ADMIN';

const extracUsersByEmail = (users: Value): Email[] => {
  return Array.isArray(users) ? users.filter(isEmail) : [users].filter(isEmail);
};

/**
 * Returns the invite warning message type
 *
 * @param config share configuration object
 * @param selectedUsers selected users in the user picker
 */
export const getInviteWarningType = (
  config: ConfigResponse | undefined,
  selectedUsers: Value,
): InviteWarningType | null => {
  if (config && selectedUsers) {
    const mode: ConfigResponseMode = config.mode;
    const selectedEmails: Email[] = extracUsersByEmail(selectedUsers);

    if (!selectedEmails.length) {
      return null;
    }

    const isDomainBasedMode =
      mode === 'ONLY_DOMAIN_BASED_INVITE' || mode === 'DOMAIN_BASED_INVITE';

    if (
      mode === 'EXISTING_USERS_ONLY' ||
      mode === 'INVITE_NEEDS_APPROVAL' ||
      (isDomainBasedMode && checkDomains(config, selectedEmails))
    ) {
      return 'ADMIN';
    } else if (
      mode === 'ANYONE' ||
      (isDomainBasedMode && !checkDomains(config, selectedEmails))
    ) {
      // https://product-fabric.atlassian.net/browse/PTC-2576
      return 'DIRECT';
    }
  }

  return null;
};

export const optionDataToUsers = (optionDataArray: OptionData[]): User[] =>
  optionDataArray.map((optionData: OptionData) => {
    switch (optionData.type) {
      case 'email':
        const user: UserWithEmail = {
          type: 'user',
          email: optionData.id,
        };
        return user;
      default:
        return {
          type: optionData.type || 'user',
          id: optionData.id,
        };
    }
  });

export const allowEmails = (config?: ConfigResponse) =>
  config && config.mode !== 'EXISTING_USERS_ONLY';

const needToCheckDomain = (config?: ConfigResponse) =>
  config && config.mode === 'ONLY_DOMAIN_BASED_INVITE';

export const isValidEmailUsingConfig = memoizeOne(
  (config: ConfigResponse | undefined) => {
    const checkDomain = needToCheckDomain(config);
    return (inputText: string): EmailValidationResponse => {
      const result = isValidEmail(inputText);
      if (
        result === 'VALID' &&
        checkDomain &&
        !matchAllowedDomains(extractDomain(inputText), config)
      ) {
        return 'INVALID';
      }
      return result;
    };
  },
);
