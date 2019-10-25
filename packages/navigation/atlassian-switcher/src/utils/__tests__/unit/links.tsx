import {
  getFixedProductLinks,
  getAdministrationLinks,
  getSuggestedProductLink,
  getJoinableSiteLinks,
  JoinableSiteItemType,
} from '../../links';
import {
  Product,
  WorklensProductType,
  ProvisionedProducts,
  ProductKey,
} from '../../../types';

import { resolveRecommendations } from '../../../providers/recommendations';
import mockJoinableSites from '../../../../test-helpers/mockJoinableSites';

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
    it('should have discover more button if enabled', () => {
      const isDiscoverMoreForEveryoneEnabled = true;
      const expectedProducts = ['discover-more'];
      const fixedLinks = getFixedProductLinks({
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
      const provisionedProducts = generateProvisionedProducts([]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('key', ProductKey.JIRA_SOFTWARE);
      expect(result[1]).toHaveProperty('key', ProductKey.CONFLUENCE);
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
      expect(result[0]).toHaveProperty('key', ProductKey.JIRA_SOFTWARE);
      expect(result[1]).toHaveProperty('key', ProductKey.JIRA_SERVICE_DESK);
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
      expect(result[0]).toHaveProperty('key', ProductKey.CONFLUENCE);
      expect(result[1]).toHaveProperty('key', ProductKey.JIRA_SERVICE_DESK);
    });
    it('should offer Jira Service Desk and Opsgenie if Confluence and JSW are active', () => {
      const provisionedProducts = generateProvisionedProducts([
        WorklensProductType.JIRA_SOFTWARE,
        WorklensProductType.CONFLUENCE,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
      );
      expect(result.length).toEqual(2);
      expect(result[0]).toHaveProperty('key', ProductKey.JIRA_SERVICE_DESK);
      expect(result[1]).toHaveProperty('key', ProductKey.OPSGENIE);
    });
    it('should offer Confluence and Opsgenie, if JSW and JSD are active', () => {
      const provisionedProducts = generateProvisionedProducts([
        WorklensProductType.JIRA_SOFTWARE,
        WorklensProductType.JIRA_SERVICE_DESK,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
      );
      expect(result.length).toEqual(2);
      expect(result[0]).toHaveProperty('key', ProductKey.CONFLUENCE);
      expect(result[1]).toHaveProperty('key', ProductKey.OPSGENIE);
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
      expect(result[0]).toHaveProperty('key', ProductKey.JIRA_SOFTWARE);
    });
    it('should offer Opsgenie if Confluence, JSD and JSW are active', () => {
      const provisionedProducts = generateProvisionedProducts([
        WorklensProductType.JIRA_SERVICE_DESK,
        WorklensProductType.CONFLUENCE,
        WorklensProductType.JIRA_SOFTWARE,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('key', ProductKey.OPSGENIE);
    });

    it('should return an empty array if Confluence, JSD, JSW, and Opsgenie are active', () => {
      const provisionedProducts = generateProvisionedProducts([
        WorklensProductType.JIRA_SERVICE_DESK,
        WorklensProductType.CONFLUENCE,
        WorklensProductType.JIRA_SOFTWARE,
        WorklensProductType.OPSGENIE,
      ]);
      const result = getSuggestedProductLink(
        provisionedProducts,
        suggestedProducts,
      );
      expect(result).toHaveLength(0);
    });
  });

  describe('getJoinableSiteLinks', () => {
    it('should return an array', () => {
      const result = getJoinableSiteLinks();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return 3 items at maximum', () => {
      const result = getJoinableSiteLinks(
        mockJoinableSites.sites.map(site =>
          Object.assign({}, site, { relevance: 10 }),
        ),
      );
      expect(result.length).toBe(3);
    });

    it('should not return any site with no products', () => {
      const result = getJoinableSiteLinks(
        mockJoinableSites.sites.map(site =>
          Object.assign({}, site, { products: [] }),
        ),
      );
      expect(result.length).toBe(0);
    });

    it('should not return any site with no users', () => {
      const result = getJoinableSiteLinks(
        mockJoinableSites.sites.map(site =>
          Object.assign({}, site, { users: [] }),
        ),
      );
      expect(result.length).toBe(0);
    });

    it('should not return any site with 0 relevance score', () => {
      const result = getJoinableSiteLinks(
        mockJoinableSites.sites.map(site =>
          Object.assign({}, site, { relevance: 0 }),
        ),
      );
      expect(result.length).toBe(0);
    });

    it('should always return the site if there is only one item', () => {
      const oneSite = mockJoinableSites.sites.slice(0, 1);

      let result: JoinableSiteItemType[] = getJoinableSiteLinks(
        oneSite.map(site => Object.assign({}, site, { products: [] })),
      );
      expect(result.length).toBe(1);

      result = getJoinableSiteLinks(
        oneSite.map(site => Object.assign({}, site, { users: [] })),
      );
      expect(result.length).toBe(1);

      result = getJoinableSiteLinks(
        oneSite.map(site => Object.assign({}, site, { relevance: 0 })),
      );
      expect(result.length).toBe(1);
    });
  });
});
