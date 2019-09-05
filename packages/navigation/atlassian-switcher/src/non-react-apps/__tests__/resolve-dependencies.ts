const fakeModule = () => {};
const missingModule = null;

const reactMock = jest.fn().mockReturnValue(fakeModule);
const reactDOMMock = jest.fn().mockReturnValue(fakeModule);
const styledComponentsMock = jest.fn().mockReturnValue(fakeModule);

const getModuleWithMocks = () => {
  jest.doMock('react', reactMock);
  jest.doMock('react-dom', reactDOMMock);
  jest.doMock('styled-components', styledComponentsMock);

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
    });
    test('should throw if a dependency is missing', () => {
      const resolveDependencies = getModuleWithMocks();
      expect(() => resolveDependencies()).toThrowError(
        'Atlassian switcher: Could not find React, ReactDOM, styled-components. These dependencies are peer dependencies from "@atlaskit/atlassian-switcher" and need to be provided by the consumer. Run "npm install react@^16.8.0 react-dom@^16.8.0 styled-components@^3.2.6 --save"',
      );
    });
  });
  describe('react missing', () => {
    beforeEach(() => {
      reactMock.mockReturnValue(missingModule);
      reactDOMMock.mockReturnValue(fakeModule);
      styledComponentsMock.mockReturnValue(fakeModule);
    });
    test('should throw if a dependency is missing', () => {
      const resolveDependencies = getModuleWithMocks();
      expect(() => resolveDependencies()).toThrowError(
        'Atlassian switcher: Could not find React. These dependencies are peer dependencies from "@atlaskit/atlassian-switcher" and need to be provided by the consumer. Run "npm install react@^16.8.0 --save"',
      );
    });
  });
  describe('styled components missing', () => {
    beforeEach(() => {
      reactMock.mockReturnValue(fakeModule);
      reactDOMMock.mockReturnValue(fakeModule);
      styledComponentsMock.mockReturnValue(missingModule);
    });
    test('should throw if a dependency is missing', () => {
      const resolveDependencies = getModuleWithMocks();
      expect(() => resolveDependencies()).toThrowError(
        'Atlassian switcher: Could not find styled-components. These dependencies are peer dependencies from "@atlaskit/atlassian-switcher" and need to be provided by the consumer. Run "npm install styled-components@^3.2.6 --save"',
      );
    });
  });
});
