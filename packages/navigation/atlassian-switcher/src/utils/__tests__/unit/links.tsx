import {
  getFixedProductLinks,
  getAdministrationLinks,
  getSuggestedProductLink,
} from '../../links';
import {
  Product,
  WorklensProductType,
  ProvisionedProducts,
} from '../../../types';

import { resolveRecommendations } from '../../../providers/recommendations';

const generateProvisionedProducts = (
  activeProducts: WorklensProductType[],
): ProvisionedProducts =>
  activeProducts.reduce(
    (acc, product) => ({
      ...acc,
      [product]: true,
    }),
    {},
  );

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
        '/plugins/servlet/ac/com.atlassian.jira.emcee/discover?source=app_switcher';
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
        '/wiki/plugins/servlet/ac/com.atlassian.confluence.emcee/discover?source=app_switcher';
      expect(result.map(({ href }) => href)).toContain(expectedResult);
    });
  });

  describe('getXSellLink', () => {
    const suggestedProducts = resolveRecommendations();
    it('should offer both JSW and Confluence if no products are active', () => {
      const provisionedProducts = generateProvisionedProducts([]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty(
        'key',
        WorklensProductType.JIRA_SOFTWARE,
      );
      expect(result[1]).toHaveProperty('key', WorklensProductType.CONFLUENCE);
    });
    it('should offer both JSW and JSD if Confluence is active', () => {
      const provisionedProducts = generateProvisionedProducts([
        WorklensProductType.CONFLUENCE,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty(
        'key',
        WorklensProductType.JIRA_SOFTWARE,
      );
      expect(result[1]).toHaveProperty(
        'key',
        WorklensProductType.JIRA_SERVICE_DESK,
      );
    });
    it('should offer both Confluence and JSD if Jira is active', () => {
      const provisionedProducts = generateProvisionedProducts([
        WorklensProductType.JIRA_SOFTWARE,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('key', WorklensProductType.CONFLUENCE);
      expect(result[1]).toHaveProperty(
        'key',
        WorklensProductType.JIRA_SERVICE_DESK,
      );
    });
    it('should offer Jira Service Desk if Confluence and JSW are active', () => {
      const provisionedProducts = generateProvisionedProducts([
        WorklensProductType.JIRA_SOFTWARE,
        WorklensProductType.CONFLUENCE,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
      );
      expect(result.length).toEqual(1);
      expect(result[0]).toHaveProperty(
        'key',
        WorklensProductType.JIRA_SERVICE_DESK,
      );
    });
    it('should offer Confluence if JSW and JSD are active', () => {
      const provisionedProducts = generateProvisionedProducts([
        WorklensProductType.JIRA_SOFTWARE,
        WorklensProductType.JIRA_SERVICE_DESK,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
      );
      expect(result.length).toEqual(1);
      expect(result[0]).toHaveProperty('key', WorklensProductType.CONFLUENCE);
    });
    it('should return Jira if Confluence and JSD are active', () => {
      const provisionedProducts = generateProvisionedProducts([
        WorklensProductType.JIRA_SERVICE_DESK,
        WorklensProductType.CONFLUENCE,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
      );
      expect(result[0]).toHaveProperty(
        'key',
        WorklensProductType.JIRA_SOFTWARE,
      );
    });
    it('should return any empty array if Confluence, JSD and JSW are active', () => {
      const provisionedProducts = generateProvisionedProducts([
        WorklensProductType.JIRA_SERVICE_DESK,
        WorklensProductType.CONFLUENCE,
        WorklensProductType.JIRA_SOFTWARE,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
      );
      expect(result).toHaveLength(0);
    });
  });
});
