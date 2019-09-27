import {
  getFixedProductLinks,
  getAdministrationLinks,
  getSuggestedProductLink,
} from '../../links';
import {
  Product,
  WorklensProductType,
  CurrentSiteResponse,
  ProductKey,
} from '../../../types';

import { resolveRecommendations } from '../../../providers/recommendations';

const HOSTNAME = 'my-hostname.com';
const generateCurrentSite = (
  activeProducts: WorklensProductType[],
): CurrentSiteResponse => ({
  url: HOSTNAME,
  products: activeProducts.map(productType => ({
    activityCount: 0,
    productType,
    url: '#',
  })),
});

describe('utils/links', () => {
  describe('fixed product links', () => {
    it('should have link for People', () => {
      const isDiscoverMoreForEveryoneEnabled = false;
      const expectedProducts = ['people'];
      const fixedLinks = getFixedProductLinks({
        canShowPeopleLink: true,
        isDiscoverMoreForEveryoneEnabled,
      });
      expect(fixedLinks.map(({ key }) => key)).toMatchObject(expectedProducts);
    });
    it('should have discover more button if enabled', () => {
      const isDiscoverMoreForEveryoneEnabled = true;
      const expectedProducts = ['people', 'discover-more'];
      const fixedLinks = getFixedProductLinks({
        canShowPeopleLink: true,
        isDiscoverMoreForEveryoneEnabled,
      });
      expect(fixedLinks.map(({ key }) => key)).toMatchObject(expectedProducts);
    });
  });

  describe('getAdministrationLinks', () => {
    let isEmceeLinkEnabled = false;
    it('should assemble admin links for site admins', () => {
      const isAdmin = true;
      const isDiscoverMoreForEveryoneEnabled = false;
      const result = getAdministrationLinks(
        isAdmin,
        isDiscoverMoreForEveryoneEnabled,
        isEmceeLinkEnabled,
      );
      const expectedResult = [`/admin/billing/addapplication`, `/admin`];
      expect(result.map(({ href }) => href)).toMatchObject(expectedResult);
    });
    it('should assemble admin links for site trusted users', () => {
      const isAdmin = false;
      const isDiscoverMoreForEveryoneEnabled = false;
      const result = getAdministrationLinks(
        isAdmin,
        isDiscoverMoreForEveryoneEnabled,
        isEmceeLinkEnabled,
      );
      const expectedResult = [
        `/trusted-admin/billing/addapplication`,
        `/trusted-admin`,
      ];
      expect(result.map(({ href }) => href)).toMatchObject(expectedResult);
    });
    it('should not include discover admin link if more if discover more button is enabled for all users', () => {
      const isDiscoverMoreForEveryoneEnabled = true;
      const result = getAdministrationLinks(
        true,
        isDiscoverMoreForEveryoneEnabled,
        isEmceeLinkEnabled,
      );

      const expectedResult = [`administration`];
      expect(result.map(({ key }) => key)).toMatchObject(expectedResult);
    });
    it('When product is Jira & Emcee enabled, should include Jira Emcee link', () => {
      const product = Product.JIRA;
      isEmceeLinkEnabled = true;
      const isDiscoverMoreForEveryoneEnabled = false;
      const result = getAdministrationLinks(
        true,
        isDiscoverMoreForEveryoneEnabled,
        isEmceeLinkEnabled,
        product,
      );

      const expectedResult =
        '/plugins/servlet/ac/com.atlassian.jira.emcee/discover#!/discover?source=app_switcher';
      expect(result.map(({ href }) => href)).toContain(expectedResult);
    });
    it('When product is Confluence & Emcee enabled, should include Confluence Emcee link', () => {
      const product = Product.CONFLUENCE;
      isEmceeLinkEnabled = true;
      const isDiscoverMoreForEveryoneEnabled = false;
      const result = getAdministrationLinks(
        true,
        isDiscoverMoreForEveryoneEnabled,
        isEmceeLinkEnabled,
        product,
      );

      const expectedResult =
        '/wiki/plugins/servlet/ac/com.atlassian.confluence.emcee/discover#!/discover?source=app_switcher';
      expect(result.map(({ href }) => href)).toContain(expectedResult);
    });
  });

  describe('getXSellLink', () => {
    const suggestedProducts = resolveRecommendations();
    it('should offer both JSW and Confluence if no products are active', () => {
      const currentSite = generateCurrentSite([]);
      const result = getSuggestedProductLink(currentSite, suggestedProducts);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('key', ProductKey.JIRA_SOFTWARE);
      expect(result[1]).toHaveProperty('key', ProductKey.CONFLUENCE);
    });
    it('should offer both JSW and JSD if Confluence is active', () => {
      const currentSite = generateCurrentSite([WorklensProductType.CONFLUENCE]);
      const result = getSuggestedProductLink(currentSite, suggestedProducts);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('key', ProductKey.JIRA_SOFTWARE);
      expect(result[1]).toHaveProperty('key', ProductKey.JIRA_SERVICE_DESK);
    });
    it('should offer both Confluence and JSD if Jira is active', () => {
      const currentSite = generateCurrentSite([
        WorklensProductType.JIRA_SOFTWARE,
      ]);
      const result = getSuggestedProductLink(currentSite, suggestedProducts);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('key', ProductKey.CONFLUENCE);
      expect(result[1]).toHaveProperty('key', ProductKey.JIRA_SERVICE_DESK);
    });
    it('should offer Jira Service Desk if Confluence and JSW are active', () => {
      const currentSite = generateCurrentSite([
        WorklensProductType.JIRA_SOFTWARE,
        WorklensProductType.CONFLUENCE,
      ]);
      const result = getSuggestedProductLink(currentSite, suggestedProducts);
      expect(result.length).toEqual(1);
      expect(result[0]).toHaveProperty('key', ProductKey.JIRA_SERVICE_DESK);
    });
    it('should offer Confluence if JSW and JSD are active', () => {
      const currentSite = generateCurrentSite([
        WorklensProductType.JIRA_SOFTWARE,
        WorklensProductType.JIRA_SERVICE_DESK,
      ]);
      const result = getSuggestedProductLink(currentSite, suggestedProducts);
      expect(result.length).toEqual(1);
      expect(result[0]).toHaveProperty('key', ProductKey.CONFLUENCE);
    });
    it('should return Jira if Confluence and JSD are active', () => {
      const currentSite = generateCurrentSite([
        WorklensProductType.JIRA_SERVICE_DESK,
        WorklensProductType.CONFLUENCE,
      ]);
      const result = getSuggestedProductLink(currentSite, suggestedProducts);
      expect(result[0]).toHaveProperty('key', ProductKey.JIRA_SOFTWARE);
    });
    it('should return any empty array if Confluence, JSD and JSW are active', () => {
      const licenseInformation = generateCurrentSite([
        WorklensProductType.JIRA_SERVICE_DESK,
        WorklensProductType.CONFLUENCE,
        WorklensProductType.JIRA_SOFTWARE,
      ]);
      const result = getSuggestedProductLink(
        licenseInformation,
        suggestedProducts,
      );
      expect(result).toHaveLength(0);
    });
  });
});
