const fakeModule = () => {};
const missingModule = null;

const reactMock = jest.fn().mockReturnValue(fakeModule);
const reactDOMMock = jest.fn().mockReturnValue(fakeModule);
const styledComponentsMock = jest.fn().mockReturnValue(fakeModule);
const reactIntlMock = jest.fn().mockReturnValue(fakeModule);

const getModuleWithMocks = () => {
  jest.doMock('react', reactMock);
  jest.doMock('react-dom', reactDOMMock);
  jest.doMock('styled-components', styledComponentsMock);
  jest.doMock('react-intl', reactIntlMock);

  return require('../resolve-dependencies').resolveDependencies;
};

describe('resolve-dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('all missing', () => {
    beforeEach(() => {
      reactMock.mockReturnValue(missingModule);
      reactDOMMock.mockReturnValue(missingModule);
      styledComponentsMock.mockReturnValue(missingModule);
      reactIntlMock.mockReturnValue(missingModule);
    });
    test('should throw if a dependency is missing', () => {
      const resolveDependencies = getModuleWithMocks();
      expect(() => resolveDependencies()).toThrowError(
        'Atlassian switcher: Could not find React, ReactDOM, styled-components, react-intl. These dependencies are peer dependencies from "@atlaskit/atlassian-switcher" and need to be provided by the consumer.',
      );
    });
  });
  describe('react missing', () => {
    beforeEach(() => {
      reactMock.mockReturnValue(missingModule);
      reactDOMMock.mockReturnValue(fakeModule);
      styledComponentsMock.mockReturnValue(fakeModule);
      reactIntlMock.mockReturnValue(fakeModule);
    });
    test('should throw if a dependency is missing', () => {
      const resolveDependencies = getModuleWithMocks();
      expect(() => resolveDependencies()).toThrowError(
        'Atlassian switcher: Could not find React. These dependencies are peer dependencies from "@atlaskit/atlassian-switcher" and need to be provided by the consumer.',
      );
    });
  });
  describe('styled components missing', () => {
    beforeEach(() => {
      reactMock.mockReturnValue(fakeModule);
      reactDOMMock.mockReturnValue(fakeModule);
      styledComponentsMock.mockReturnValue(missingModule);
      reactIntlMock.mockReturnValue(fakeModule);
    });
    test('should throw if a dependency is missing', () => {
      const resolveDependencies = getModuleWithMocks();
      expect(() => resolveDependencies()).toThrowError(
        'Atlassian switcher: Could not find styled-components. These dependencies are peer dependencies from "@atlaskit/atlassian-switcher" and need to be provided by the consumer.',
      );
    });
  });

  describe('react intl missing', () => {
    beforeEach(() => {
      reactMock.mockReturnValue(fakeModule);
      reactDOMMock.mockReturnValue(fakeModule);
      styledComponentsMock.mockReturnValue(fakeModule);
      reactIntlMock.mockReturnValue(missingModule);
    });
    test('should throw if a dependency is missing', () => {
      const resolveDependencies = getModuleWithMocks();
      expect(() => resolveDependencies()).toThrowError(
        'Atlassian switcher: Could not find react-intl. These dependencies are peer dependencies from "@atlaskit/atlassian-switcher" and need to be provided by the consumer.',
      );
    });
  });
});
