const {
  getDevServer,
  getEntries,
  getMode,
} = require('../webpack-helpers');

describe('webpack helper', () => {
  it('sets dev server options', () => {
    expect(getDevServer()).toStrictEqual({
      open: true,
    });
  });

  it('sets entry points', () => {
    const entries = getEntries();
    expect(entries).toEqual(
      expect.objectContaining({
        index: expect.any(String),
      })
    );

    const entryList = Object.keys(entries);
    expect(entryList)
      .toEqual(
        expect.arrayContaining(['index'])
      );
  });

  it('sets development mode by default', () => {
    expect(getMode({}))
      .toEqual('development');
  });

  it('sets production mode from environment flag', () => {
    expect(getMode({
      production: true,
    }))
      .toEqual('production');
  });

});
