module.exports = {
  input: ['.tmp/locale-extract/**/*.{js,jsx}'],
  output: './',
  options: {
    lngs: ['en', 'de'],
    defaultLng: 'en',
    defaultValue: '__STRING_NOT_TRANSLATED__',
    resource: {
      loadPath: 'translations/{{lng}}/translation.json',
      savePath: 'translations/{{lng}}/translation.json',
    },
    func: {
      list: ['i18next.t', 'i18n.t', 't'],
    },
  },
};
