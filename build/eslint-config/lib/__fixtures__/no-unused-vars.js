/**
 * This fixture exercises no-unused-vars with custom options.
 * 
 * eslint(no-unused-vars)
 * https://eslint.org/docs/rules/no-unused-vars
 * 
 * ESLint errors and warnings in this file are intentional.
 * Package lint script should ignore paths under __fixtures__.
 */
const unusedVariable = true; // 'unusedVariable' is assigned a value but never used. eslint(no-unused-vars)
const fnWithAnUnusedArgument = unusedArgument => { console.log('unused arg'); }; // 'unusedArgument' is defined but never used. Allowed unused args must match /^_/u. eslint(no-unused-vars)
const fnWithAnUnusedArgumentPrefixed = _unusedArgument => { console.log('unused arg with prefix'); };

/**
 * Export anything that ESLint shouldn't find unused.
 */
module.exports = {
  fnWithAnUnusedArgument,
  fnWithAnUnusedArgumentPrefixed,
};
