import { Page } from 'puppeteer';
import { snapshot, animationFrame, initRendererWithADF } from './_utils';
import * as tableSortable from '../__fixtures__/table-sortable.adf.json';
import * as tableWithMergedCells from '../__fixtures__/table-with-merged-cells.adf.json';
import * as tableWithHeaderColumnButWithoutHeaderRow from '../__fixtures__/table-with-header-column-but-without-header-row.adf.json';
import * as tableWithHeaderColumnButWithoutHeaderRowWithoutNumberColumn from '../__fixtures__/table-with-header-column-but-without-header-row-without-number-column.adf.json';
import { RendererCssClassName } from '../../consts';

const initRenderer = async (page: Page, adf: any) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    viewport: { width: 800, height: 600 },
    adf,
    rendererProps: { allowColumnSorting: true },
  });
};

const getSortableColumnSelector = (nth: number) =>
  `tr:first-of-type .${
    RendererCssClassName.SORTABLE_COLUMN
  }:nth-of-type(${nth})`;

describe('Snapshot Test: Table sorting', () => {
  let page: Page;
  beforeAll(() => {
    // @ts-ignore
    page = global.page;
  });

  afterEach(async () => {
    await animationFrame(page);
    await snapshot(page);
  });

  it('should sort table in asc on the first click', async () => {
    await initRenderer(page, tableSortable);

    await page.waitForSelector(`.${RendererCssClassName.SORTABLE_COLUMN}`);
    await page.click(getSortableColumnSelector(1));
  });

  it('should sort table in desc on the second click', async () => {
    await initRenderer(page, tableSortable);

    await page.waitForSelector(`.${RendererCssClassName.SORTABLE_COLUMN}`);
    await page.click(getSortableColumnSelector(1));
    await animationFrame(page);
    await page.click(getSortableColumnSelector(1));
  });

  it('should back to original table order on the third click', async () => {
    await initRenderer(page, tableSortable);

    await page.waitForSelector(`.${RendererCssClassName.SORTABLE_COLUMN}`);
    await page.click(getSortableColumnSelector(1));
    await animationFrame(page);
    await page.click(getSortableColumnSelector(1));
    await animationFrame(page);
    await page.click(getSortableColumnSelector(1));
  });

  describe('when there is merged cells', () => {
    it('should display not allowed message', async () => {
      await initRenderer(page, tableWithMergedCells);

      await page.waitForSelector(`.${RendererCssClassName.SORTABLE_COLUMN}`);
      await page.hover(getSortableColumnSelector(1));

      await page.waitFor(300); //we need to wait for the tooltip rendering the content
      await page.waitFor('body .Tooltip');
      await animationFrame(page);
      await animationFrame(page);
    });
  });

  describe('when there is no header row', () => {
    describe('when the table has number column', () => {
      describe.each([1, 2, 3])('when hover %d th row', rowNth => {
        it('should not display any message', async () => {
          await initRenderer(page, tableWithHeaderColumnButWithoutHeaderRow);

          await page.hover(`table tr:nth-child(${rowNth}) th`);

          await page.waitFor(300); //we need to wait for the tooltip rendering the content
          await animationFrame(page);
          await animationFrame(page);
        });
      });
    });

    describe('when the table has not number column', () => {
      describe.each([1, 2, 3])('when hover %d th row', rowNth => {
        it('should not display any message', async () => {
          await initRenderer(
            page,
            tableWithHeaderColumnButWithoutHeaderRowWithoutNumberColumn,
          );

          await page.hover(`table tr:nth-child(${rowNth}) th`);

          await page.waitFor(300); //we need to wait for the tooltip rendering the content
          await animationFrame(page);
          await animationFrame(page);
        });
      });
    });
  });
});
