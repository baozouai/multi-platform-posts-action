process.env.ESLINT_TSCONFIG = 'tsconfig.json'

module.exports = {
  extends: '@antfu',
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/prefer-ts-expect-error': 'off',
    'no-console': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
  },
}
