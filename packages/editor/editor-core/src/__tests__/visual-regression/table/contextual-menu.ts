import { snapshot, initFullPageEditorWithAdf } from '../_utils';
import adf from './__fixtures__/default-table.adf.json';
import {
  clickFirstCell,
  selectTableOption,
} from '../../__helpers/page-objects/_table';

describe('Table contextual menu: fullpage', () => {
  let page: any;

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await initFullPageEditorWithAdf(page, adf);
    await clickFirstCell(page);
  });

  it('update contextual menu button position when number column changes', async () => {
    await selectTableOption(page, 'Numbered column');
    await snapshot(page);
  });
});
