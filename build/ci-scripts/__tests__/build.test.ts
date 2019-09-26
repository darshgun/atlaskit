// @ts-ignore
import build from '../build';

describe('Build', () => {
  describe('All packages', () => {
    it.todo('should create entry point directories');
    it.todo('should build all JS packages');
    it.todo('should build all TS packages');
    it.todo('should copy all version.json across');
    it.todo('should validate dists');
  });

  describe('Single package', () => {
    it.todo('should create entry point directory');
    it.todo('should build JS package if it is JS');
    it.todo('should build TS package if it is TS');
    it.todo('should copy version.json across');
    it.todo('should validate dist');
  });

  describe('Watch mode', () => {
    it.todo('should run the main build once before commencing watch');
    it.todo('should run the JS compilation in watch mode for a JS package');
    it.todo('should run the TS compilation in watch mode for a TS package');
    // TODO: Add cjs/esm flag stubs once they are refined
    // TODO: Add link/yalc push callback stubs once it is refined
  });
});
