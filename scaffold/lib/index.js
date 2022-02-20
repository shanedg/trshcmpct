const relativePathToRepoRoot = '../../';

/**
 * Plopfile
 * See https://plopjs.com/documentation/
 * @param plop plop API object
 */
export default function (plop) {
  plop.setGenerator('project', {
    description: 'scaffold a new js project',

    // inquirer prompts
    // https://www.npmjs.com/package/inquirer
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'project name please (omit @scope)',
      },
      {
        type: 'input',
        name: 'path',
        message: 'project path please',
      },
    ],

    actions: [
      {
        type: 'addMany',
        data: {
          scope: '@trshcmpctr',
        },
        destination: `${relativePathToRepoRoot}{{path}}/`,
        base: 'templates',
        templateFiles: '**/*.hbs',
        // By default, globs don't match file names that start with dot, i.e. '.eslintrc.js.hbs'.
        globOptions: { dot: true },
      },
    ]
  });
}
