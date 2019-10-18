import { processPluginPreset } from '../../../../../labs/next/presets/utils';

describe('processPluginPreset', () => {
  it('should be able to override any plugin', () => {
    const plugin1 = jest.fn(() => 'plugin-1');
    const plugin2 = jest.fn(() => 'plugin-2');
    const plugin2Options = { hasOptions: true };

    const preset: any = [plugin1, plugin2, [plugin2, plugin2Options]];

    const plugins = processPluginPreset(preset);
    expect(plugins).toEqual(['plugin-1', 'plugin-2']);
    expect(plugin1).toBeCalledTimes(1);
    expect(plugin2).toBeCalledTimes(1);
    expect(plugin2).toBeCalledWith(plugin2Options);
  });

  it('should be able to override aleady overriden plugin', () => {
    const plugin1 = jest.fn(() => 'plugin-1');
    const plugin2 = jest.fn(() => 'plugin-2');

    const plugin2Options = { hasOptions: true };
    const plugin2Options2 = { hasMoreOptions: true };

    const preset: any = [
      plugin2,
      plugin1,
      [plugin2, plugin2Options],
      [plugin2, plugin2Options2],
    ];

    const plugins = processPluginPreset(preset);
    expect(plugins).toEqual(['plugin-2', 'plugin-1']);
    expect(plugin1).toBeCalledTimes(1);
    expect(plugin2).toBeCalledTimes(1);
    expect(plugin2).toBeCalledWith(plugin2Options2);
  });

  it('should throw if same plugin is used more than once without override options', () => {
    const plugin1 = jest.fn(() => 'plugin-1');
    const plugin2 = jest.fn(() => 'plugin-2');

    const preset: any = [plugin1, plugin2, plugin1];

    expect(() => {
      processPluginPreset(preset);
    }).toThrow();
  });
});
