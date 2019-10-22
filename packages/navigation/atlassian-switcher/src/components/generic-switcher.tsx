import * as React from 'react';
import { Messages } from 'react-intl';
import Switcher from '../primitives/themed-switcher';
import CommonDataProvider from '../providers/common-data-provider';
import {
  Product,
  FeatureMap,
  DiscoverMoreCallback,
  TriggerXFlowCallback,
} from '../types';
import { mapResultsToSwitcherProps } from '../utils/map-results-to-switcher-props';
import {
  AvailableProductsProvider,
  AvailableProductsDataProvider,
} from '../providers/products-data-provider';
import { JoinableSitesProvider } from '../providers/joinable-sites-data-provider';
import { WithTheme } from '../theme/types';

type GenericSwitcherProps = WithTheme & {
  cloudId?: string;
  messages: Messages;
  features: FeatureMap;
  triggerXFlow: TriggerXFlowCallback;
  onDiscoverMoreClicked: DiscoverMoreCallback;
  product: Exclude<Product, Product.JIRA | Product.CONFLUENCE>;
  availableProductsDataProvider?: AvailableProductsDataProvider;
  fetchJoinableSites?: any;
};

// TODO: replace this with real props
const fetchJoinableSites = new Promise(resolve => {
  setTimeout(() => {
    resolve(
      {
        uuid: '{c61fea50-a32f-4fb3-bf3b-a739ee700302}',
        expiration: 1571523829597,
        sites: [
          {
            cloudId: '05b02b6f-aad5-449e-b4e2-8d6a0c632e26',
            products: ['jira-software.ondemand'],
            url: 'https://atl-jsoler-20190708v3.jira-dev.com',
            displayName: 'atl-jsoler-20190708v3',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/jersey.png',
            relevance: 10,
            users: [
              {
                avatarUrl:
                  'https://secure.gravatar.com/avatar/8d798826168832a434df4285c75d2e07?d=https%3A%2F%2Favatar-management--avatars.us-west-2.staging.public.atl-paas.net%2Finitials%2FYG-1.png',
                displayName: 'Yoni Gozman2',
                relevance: 10,
              },
            ],
          },
          {
            cloudId: '0b080b56-bb7f-4572-b5bc-d44c33c2d54a',
            products: ['jira-software.ondemand'],
            url: 'https://fake-saml-scim.jira-dev.com',
            displayName: 'fake-saml-scim',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/globe.png',
            relevance: 10,
            users: [
              {
                avatarUrl:
                  'https://secure.gravatar.com/avatar/8d798826168832a434df4285c75d2e07?d=https%3A%2F%2Favatar-management--avatars.us-west-2.staging.public.atl-paas.net%2Finitials%2FYG-1.png',
                displayName: 'Yoni Gozman2',
                relevance: 10,
              },
            ],
          },
          {
            cloudId: '0c7e15f2-f933-463b-b818-10a18fa0f173',
            products: ['jira-software.ondemand'],
            url: 'https://14122.jira-dev.com',
            displayName: '14122',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/globe.png',
            relevance: 10,
            users: [
              {
                avatarUrl:
                  'https://secure.gravatar.com/avatar/8d798826168832a434df4285c75d2e07?d=https%3A%2F%2Favatar-management--avatars.us-west-2.staging.public.atl-paas.net%2Finitials%2FYG-1.png',
                displayName: 'Yoni Gozman2',
                relevance: 10,
              },
            ],
          },
          {
            cloudId: '11915d9c-23a0-4eb5-8feb-cb7446b3737e',
            products: ['jira-software.ondemand'],
            url: 'https://people-and-teams.jira-dev.com',
            displayName: 'people-and-teams',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/rocket.png',
            relevance: 10,
            users: [
              {
                avatarUrl:
                  'https://secure.gravatar.com/avatar/8d798826168832a434df4285c75d2e07?d=https%3A%2F%2Favatar-management--avatars.us-west-2.staging.public.atl-paas.net%2Finitials%2FYG-1.png',
                displayName: 'Yoni Gozman2',
                relevance: 10,
              },
            ],
          },
          {
            cloudId: '1102cbc0-3189-4f02-9c94-756c0ffc858a',
            products: ['jira-software.ondemand'],
            url: 'https://atl-xflow-release-332.jira-dev.com',
            displayName: 'atl-xflow-release-332',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/flag.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: '149ad985-6ab2-4967-9b52-649343d9cfb7',
            products: ['jira-software.ondemand'],
            url: 'https://sa2.jira-dev.com',
            displayName: 'sa2',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/jersey.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: '3407e1b3-af41-4c37-b9f8-2fa9cac21c80',
            products: ['jira-software.ondemand'],
            url: 'https://sbakshi.jira-dev.com',
            displayName: 'sbakshi',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/star.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: '387fc1a2-acce-465c-a0b8-cd6b91fbb28a',
            products: ['jira-software.ondemand'],
            url: 'https://jfield82.jira-dev.com',
            displayName: 'jfield82',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/rings.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: '4143f9ec-46cd-4812-9092-b3ea4ee249dc',
            products: ['jira-software.ondemand'],
            url: 'https://pumbaa-partner.jira-dev.com',
            displayName: 'pumbaa-partner',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/compass.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: '5219e9e8-d8fc-4224-8840-9e96501c3ffe',
            products: ['jira-software.ondemand'],
            url: 'https://31653.jira-dev.com',
            displayName: '31653',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/koala.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: '5dbb5bc4-9bc2-4b24-a9ce-2fa1ebc88790',
            products: ['jira-software.ondemand'],
            url: 'https://blitz-16-jpy.jira-dev.com',
            displayName: 'blitz-16-jpy',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/rings.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: '670e879b-55ad-476e-8b20-b4aaf769352f',
            products: ['jira-software.ondemand'],
            url: 'https://e204.jira-dev.com',
            displayName: 'e204',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/compass.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: '741a9d17-54c2-4707-9050-9ac17b930351',
            products: ['jira-software.ondemand'],
            url: 'https://19999.jira-dev.com',
            displayName: '19999',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/lightbulb.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: '7a666dfd-b01e-48ad-b16a-ae2e702813fb',
            products: ['jira-software.ondemand'],
            url: 'https://jfield81.jira-dev.com',
            displayName: 'jfield81',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/globe.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: '7bee1100-6a94-4fb1-a608-b3e47c5c0f0e',
            products: ['jira-software.ondemand'],
            url: 'https://atl-gburrows-ps.jira-dev.com',
            displayName: 'atl-gburrows-ps',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/globe.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: '829ed86e-25eb-4509-b248-71aa00d84b6b',
            products: ['jira-software.ondemand'],
            url: 'https://parthacontinueurltest.jira-dev.com',
            displayName: 'parthacontinueurltest',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/rings.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: '8b0c7b6d-26f1-4de8-8367-243473a557cc',
            products: ['jira-software.ondemand'],
            url: 'https://aemelyanenko.jira-dev.com',
            displayName: 'aemelyanenko',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/trophy.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: '8d67503c-22ac-47bc-a6e4-9e87f712ab74',
            products: ['jira-software.ondemand'],
            url: 'https://mobile-jss.jira-dev.com',
            displayName: 'mobile-jss',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/site.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: '954f8d12-48db-49ce-8ab1-9e4cf931680d',
            products: ['jira-software.ondemand'],
            url: 'https://atl-grow-jsw-ylim-190822132006.jira-dev.com',
            displayName: 'atl-grow-jsw-ylim-190822132006',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/globe.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: 'TEST--23190506-a7e5-4687-8864-f5e0e2059b95',
            products: ['jira-software.ondemand'],
            url:
              'https://atl-vertigo--jira-jira-branch-ygozman--4.jira-dev.com',
            displayName: 'atl-vertigo--jira-jira-branch-ygozman--4',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/rocket.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: 'TEST--a8218ee0-77ca-41e3-a556-8c03d87b1c4e',
            products: ['jira-software.ondemand'],
            url:
              'https://atl-vertigo--jira-jira-branch-amaheshwar--4.jira-dev.com',
            displayName: 'atl-vertigo--jira-jira-branch-amaheshwar--4',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/cup.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: 'ab6fca3c-eaac-4f5f-8f7c-e4cac86f17e9',
            products: ['jira-software.ondemand'],
            url: 'https://prs-test1.jira-dev.com',
            displayName: 'prs-test1',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/rocket.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: 'acc91765-8c87-4c8c-a00f-c7f54ac3cd87',
            products: ['jira-software.ondemand'],
            url: 'https://22176.jira-dev.com',
            displayName: '22176',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/trophy.png',
            relevance: 0,
            users: [],
          },
          {
            cloudId: 'b27c5e28-c22c-4a9c-908f-c733b3e5935a',
            products: ['jira-software.ondemand'],
            url: 'https://atl-xflow-release-289.jira-dev.com',
            displayName: 'atl-xflow-release-289',
            avatarUrl:
              'https://site-admin-avatar-cdn.staging.public.atl-paas.net/avatars/240/pencilmarker.png',
            relevance: 0,
            users: [],
          },
        ],
      }.sites,
    );
  }, 5000);
});

export default (props: GenericSwitcherProps) => (
  <JoinableSitesProvider fetchJoinableSites={() => fetchJoinableSites}>
    {joinableSites => (
      <AvailableProductsProvider
        availableProductsDataProvider={props.availableProductsDataProvider}
      >
        {availableProducts => (
          <CommonDataProvider
            cloudId={props.cloudId}
            disableRecentContainers={props.features.disableRecentContainers}
          >
            {providerResults => {
              const switcherLinks = mapResultsToSwitcherProps(
                props.cloudId,
                providerResults,
                props.features,
                availableProducts,
                props.product,
                joinableSites,
              );
              return <Switcher {...props} {...switcherLinks} />;
            }}
          </CommonDataProvider>
        )}
      </AvailableProductsProvider>
    )}
  </JoinableSitesProvider>
);
