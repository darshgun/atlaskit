/* eslint-disable no-global-assign */

import { createDateParser } from '../../';
import { toDate, toDateObj } from '../../utils';

const DATE_INVARIANT = new Date(2000, 7, 28);

describe('date-parser', () => {
  describe('Invalid Dates', () => {
    const parseDate = createDateParser('en-US');

    it.each([['potato'], ['13/'], ['13/1'], ['2/30']])(
      'parseDate(%s)',
      dateString => {
        expect(isNaN(parseDate(dateString).getTime())).toEqual(true);
      },
    );
  });

  describe('Partial Dates', () => {
    const parseDate = createDateParser('en-US');
    const now = toDateObj(new Date());

    it.each([
      ['0', toDate(now)],
      ['02', toDate({ ...now, month: 2 })],
      ['02/', toDate({ ...now, month: 2 })],
      ['02/1', toDate({ ...now, month: 2, day: 1 })],
      ['02/18', toDate({ ...now, month: 2, day: 18 })],
      ['02/18/', toDate({ ...now, month: 2, day: 18 })],
      ['02/18/1', toDate({ year: 2001, month: 2, day: 18 })],
      ['02/18/19', toDate({ year: 2019, month: 2, day: 18 })],
    ])('parseDate(%s)', (dateString, expected) => {
      expect(parseDate(dateString)).toEqual(expected);
    });
  });

  describe('Localization', () => {
    let IntlBefore: typeof Intl;

    // Setup
    beforeEach(() => {
      IntlBefore = Intl;
    });

    afterEach(() => {
      // @ts-ignore
      Intl = IntlBefore;
    });

    it.each([
      ['ca-ES', '28/8/2000', '18/2/1993'],
      ['zh-TW', '2000/8/28', '1993/2/18'],
      ['cs-CZ', '28. 8. 2000', '18. 2. 1993'],
      ['da-DK', '28.8.2000', '18.2.1993'],
      ['de-DE', '28.8.2000', '18.2.1993'],
      ['el-GR', '28/8/2000', '18/2/1993'],
      ['en-US', '8/28/2000', '2/18/1993'],
      ['fi-FI', '28.8.2000', '18.2.1993'],
      ['fr-FR', '28/08/2000', '18/02/1993'],
      ['he-IL', '28.8.2000', '18.2.1993'],
      ['hu-HU', '2000. 08. 28.', '1993. 02. 18.'],
      ['is-IS', '2000-8-28', '1993-2-18'],
      ['it-IT', '28/8/2000', '18/2/1993'],
      ['ja-JP', '2000/8/28', '1993/2/18'],
      ['ko-KR', '2000. 8. 28.', '1993. 2. 18.'],
      ['nl-NL', '28-8-2000', '18-2-1993'],
      ['nb-NO', '28.8.2000', '18.2.1993'],
      ['pl-PL', '28.08.2000', '18.02.1993'],
      ['pt-BR', '28/08/2000', '18/02/1993'],
      ['ro-RO', '28.08.2000', '18.02.1993'],
      ['ru-RU', '28.08.2000', '18.02.1993'],
      ['hr-HR', '28. 08. 2000.', '18. 02. 1993.'],
      ['sk-SK', '28. 8. 2000', '18. 2. 1993'],
      ['sq-AL', '2000-8-28', '1993-2-18'],
      ['sv-SE', '2000-08-28', '1993-02-18'],
      ['tr-TR', '28.08.2000', '18.02.1993'],
      ['ur-PK', '2000-8-28', '1993-2-18'],
      ['id-ID', '28/8/2000', '18/2/1993'],
      ['uk-UA', '28.08.2000', '18.02.1993'],
      ['be-BY', '2000-8-28', '1993-2-18'],
      ['sl-SI', '28. 8. 2000', '18. 2. 1993'],
      ['et-EE', '28.8.2000', '18.2.1993'],
      ['lv-LV', '2000.08.28.', '1993.02.18.'],
      ['lt-LT', '2000-08-28', '1993-02-18'],
      ['vi-VN', '28/8/2000', '18/2/1993'],
      ['hy-AM', '2000-8-28', '1993-2-18'],
      ['az-Latn-AZ', '2000-8-28', '1993-2-18'],
      ['eu-ES', '2000-8-28', '1993-2-18'],
      ['mk-MK', '2000-8-28', '1993-2-18'],
      ['af-ZA', '2000-8-28', '1993-2-18'],
      ['ka-GE', '2000-8-28', '1993-2-18'],
      ['fo-FO', '2000-8-28', '1993-2-18'],
      ['hi-IN', '28/8/2000', '18/2/1993'],
      ['ms-MY', '28/8/2000', '18/2/1993'],
      ['kk-KZ', '2000-8-28', '1993-2-18'],
      ['ky-KG', '2000-8-28', '1993-2-18'],
      ['sw-KE', '28/8/2000', '18/2/1993'],
      ['uz-Latn-UZ', '2000-8-28', '1993-2-18'],
      ['tt-RU', '28/08/2000', '18/02/1993'],
      ['pa-IN', '2000-8-28', '1993-2-18'],
      ['gu-IN', '28/8/2000', '18/2/1993'],
      ['ta-IN', '28/8/2000', '18/2/1993'],
      ['te-IN', '28/8/2000', '18/2/1993'],
      ['kn-IN', '28/8/2000', '18/2/1993'],
      ['sa-IN', '28/08/2000', '18/02/1993'],
      ['mn-MN', '2000-8-28', '1993-2-18'],
      ['gl-ES', '2000-8-28', '1993-2-18'],
      ['kok-IN', '28/08/2000', '18/02/1993'],
      ['syr-SY', '28/08/2000', '18/02/1993'],
      ['dv-MV', '28/08/2000', '18/02/1993'],
      ['zh-CN', '2000/8/28', '1993/2/18'],
      ['de-CH', '28.8.2000', '18.2.1993'],
      ['en-GB', '28/08/2000', '18/02/1993'],
      ['es-MX', '28/8/2000', '18/2/1993'],
      ['fr-BE', '28/08/2000', '18/02/1993'],
      ['it-CH', '28/8/2000', '18/2/1993'],
      ['nl-BE', '28/8/2000', '18/2/1993'],
      ['nn-NO', '2000-8-28', '1993-2-18'],
      ['pt-PT', '28/08/2000', '18/02/1993'],
      ['sr-Latn-CS', '28.8.2000.', '18.2.1993.'],
      ['sv-FI', '2000-08-28', '1993-02-18'],
      ['az-Cyrl-AZ', '2000-8-28', '1993-2-18'],
      ['ms-BN', '28/8/2000', '18/2/1993'],
      ['uz-Cyrl-UZ', '2000-8-28', '1993-2-18'],
      ['zh-HK', '28/8/2000', '18/2/1993'],
      ['de-AT', '28.8.2000', '18.2.1993'],
      ['en-AU', '28/08/2000', '18/02/1993'],
      ['es-ES', '28/8/2000', '18/2/1993'],
      ['fr-CA', '2000-08-28', '1993-02-18'],
      ['sr-Cyrl-CS', '28.8.2000.', '18.2.1993.'],
      ['de-LU', '28.8.2000', '18.2.1993'],
      ['en-CA', '2000-08-28', '1993-02-18'],
      ['es-GT', '28/8/2000', '18/2/1993'],
      ['fr-CH', '28.08.2000', '18.02.1993'],
      ['zh-MO', '2000/8/28', '1993/2/18'],
      ['de-LI', '28.8.2000', '18.2.1993'],
      ['en-NZ', '28/08/2000', '18/02/1993'],
      ['es-CR', '28/8/2000', '18/2/1993'],
      ['fr-LU', '28/08/2000', '18/02/1993'],
      ['en-IE', '28/8/2000', '18/2/1993'],
      ['es-PA', '08/28/2000', '02/18/1993'],
      ['fr-MC', '28/08/2000', '18/02/1993'],
      ['en-ZA', '2000/08/28', '1993/02/18'],
      ['es-DO', '28/8/2000', '18/2/1993'],
      ['en-JM', '28/08/2000', '18/02/1993'],
      ['es-VE', '28/8/2000', '18/2/1993'],
      ['en-029', '8/28/2000', '2/18/1993'],
      ['es-CO', '28/8/2000', '18/2/1993'],
      ['en-BZ', '28/08/2000', '18/02/1993'],
      ['es-PE', '28/8/2000', '18/2/1993'],
      ['en-TT', '28/08/2000', '18/02/1993'],
      ['es-AR', '28/8/2000', '18/2/1993'],
      ['en-ZW', '28/8/2000', '18/2/1993'],
      ['es-EC', '28/8/2000', '18/2/1993'],
      ['en-PH', '28/08/2000', '18/02/1993'],
      ['es-CL', '28-08-2000', '18-02-1993'],
      ['es-UY', '28/8/2000', '18/2/1993'],
      ['es-PY', '28/8/2000', '18/2/1993'],
      ['es-BO', '28/8/2000', '18/2/1993'],
      ['es-SV', '28/8/2000', '18/2/1993'],
      ['es-HN', '28/8/2000', '18/2/1993'],
      ['es-NI', '28/8/2000', '18/2/1993'],
      ['es-PR', '08/28/2000', '02/18/1993'],
      ['am-ET', '28/8/2000', '18/2/1993'],
      ['tzm-Latn-DZ', '28/08/2000', '18/02/1993'],
      ['iu-Latn-CA', '28/08/2000', '18/02/1993'],
      ['sma-NO', '28/08/2000', '18/02/1993'],
      ['mn-Mong-CN', '2000-8-28', '1993-2-18'],
      ['gd-GB', '28/08/2000', '18/02/1993'],
      ['en-MY', '28/08/2000', '18/02/1993'],
      ['prs-AF', '28/08/2000', '18/02/1993'],
      ['wo-SN', '28/08/2000', '18/02/1993'],
      ['rw-RW', '2000-8-28', '1993-2-18'],
      ['qut-GT', '28/08/2000', '18/02/1993'],
      ['sah-RU', '28/08/2000', '18/02/1993'],
      ['gsw-FR', '28/08/2000', '18/02/1993'],
      ['co-FR', '28/08/2000', '18/02/1993'],
      ['oc-FR', '28/08/2000', '18/02/1993'],
      ['mi-NZ', '28/08/2000', '18/02/1993'],
      ['ga-IE', '2000-8-28', '1993-2-18'],
      ['se-SE', '28/08/2000', '18/02/1993'],
      ['br-FR', '2000-8-28', '1993-2-18'],
      ['smn-FI', '28/08/2000', '18/02/1993'],
      ['moh-CA', '28/08/2000', '18/02/1993'],
      ['arn-CL', '28/08/2000', '18/02/1993'],
      ['ii-CN', '28/08/2000', '18/02/1993'],
      ['dsb-DE', '28/08/2000', '18/02/1993'],
      ['ig-NG', '2000-8-28', '1993-2-18'],
      ['kl-GL', '28/08/2000', '18/02/1993'],
      ['lb-LU', '28/08/2000', '18/02/1993'],
      ['ba-RU', '28/08/2000', '18/02/1993'],
      ['nso-ZA', '28/08/2000', '18/02/1993'],
      ['quz-BO', '28/08/2000', '18/02/1993'],
      ['yo-NG', '2000-8-28', '1993-2-18'],
      ['ha-Latn-NG', '2000-8-28', '1993-2-18'],
      ['fil-PH', '8/28/2000', '2/18/1993'],
      ['fy-NL', '28/08/2000', '18/02/1993'],
      ['ne-NP', '2000-8-28', '1993-2-18'],
      ['se-NO', '28/08/2000', '18/02/1993'],
      ['iu-Cans-CA', '28/08/2000', '18/02/1993'],
      ['sr-Latn-RS', '28.8.2000.', '18.2.1993.'],
      ['si-LK', '2000-8-28', '1993-2-18'],
      ['sr-Cyrl-RS', '28.8.2000.', '18.2.1993.'],
      ['lo-LA', '2000-8-28', '1993-2-18'],
      ['km-KH', '2000-8-28', '1993-2-18'],
      ['cy-GB', '2000-8-28', '1993-2-18'],
      ['bo-CN', '28/08/2000', '18/02/1993'],
      ['sms-FI', '28/08/2000', '18/02/1993'],
      ['as-IN', '28/08/2000', '18/02/1993'],
      ['ml-IN', '28/8/2000', '18/2/1993'],
      ['en-IN', '28/8/2000', '18/2/1993'],
      ['or-IN', '2000-8-28', '1993-2-18'],
      ['tk-TM', '28/08/2000', '18/02/1993'],
      ['bs-Latn-BA', '2000-8-28', '1993-2-18'],
      ['mt-MT', '2000-8-28', '1993-2-18'],
      ['sr-Cyrl-ME', '28.8.2000.', '18.2.1993.'],
      ['se-FI', '28/08/2000', '18/02/1993'],
      ['zu-ZA', '2000-8-28', '1993-2-18'],
      ['xh-ZA', '28/08/2000', '18/02/1993'],
      ['tn-ZA', '28/08/2000', '18/02/1993'],
      ['hsb-DE', '28/08/2000', '18/02/1993'],
      ['bs-Cyrl-BA', '2000-8-28', '1993-2-18'],
      ['tg-Cyrl-TJ', '2000-8-28', '1993-2-18'],
      ['sr-Latn-BA', '28.8.2000.', '18.2.1993.'],
      ['smj-NO', '28/08/2000', '18/02/1993'],
      ['rm-CH', '2000-8-28', '1993-2-18'],
      ['smj-SE', '28/08/2000', '18/02/1993'],
      ['quz-EC', '28/08/2000', '18/02/1993'],
      ['quz-PE', '28/08/2000', '18/02/1993'],
      ['hr-BA', '28. 08. 2000.', '18. 02. 1993.'],
      ['sr-Latn-ME', '28.8.2000.', '18.2.1993.'],
      ['sma-SE', '28/08/2000', '18/02/1993'],
      ['en-SG', '28/08/2000', '18/02/1993'],
      ['ug-CN', '28/08/2000', '18/02/1993'],
      ['sr-Cyrl-BA', '28.8.2000.', '18.2.1993.'],
    ])(
      'createDateParser(%s)(%s)',
      (locale, inputDateString, formatDateString) => {
        // @ts-ignore
        Intl = {
          DateTimeFormat: () => {
            return {
              format: () => formatDateString,
            };
          },
        };
        expect(createDateParser(locale)(inputDateString)).toEqual(
          DATE_INVARIANT,
        );
      },
    );
  });
});
