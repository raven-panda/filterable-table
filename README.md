# Filterable Table

This library provides a table to show simple data (string, number, dates), and comes with a pagination, filtering and sorting features.

## Built with

- [![React][React.js]][React-url]
- [![TypeScript][TypeScript]][TypeScript-url]

## Documentation

Everything you need to know is documented in the `docs` directory of this repo, into separated markdown files by category. Here's the list of the documentation available :

1. [Filterable Table component](https://github.com/raven-panda/filterable-table/blob/main/docs/1-table-component.md)
2. [Front-end data filtering / sorting](https://github.com/raven-panda/filterable-table/blob/main/docs/2-filters-and-pagination.md)
3. [Styling the table](https://github.com/raven-panda/filterable-table/blob/main/docs/3-styling-the-table.md)

## Install, edit and build the project

1. Install this library using `git clone https://github.com/raven-panda/filterable-table.git`

2. Start editing the project ! The project follow this structure :

```
/src
| /components (react components)
  | /[component category namespace]
  | | [component name].tsx (each component include its props interface in the file right before component declaration)
  | index.ts (export all of the components from here)
| /icons (stores image files used as icons)
| /styles (stores stylesheets, remember to import them into the src/index.ts if you want them to be included in the build)
| /types (reusable types or interfaces, not including component props interface)
  | index.ts (export the types files here)
  | [type category or namespace].ts
| /utils (reusable utils functions, don't export them in the main index.ts in order to not get them exposed as it is unnecessary)
  | [utils category or namespace].ts
| index.ts (export all in components/index.ts and types.ts, and import stylesheets here)
```

3. Build your project using the script `build` defined in the package.json.

4. And you can use it in another project by adding a dependencie in the package.json, but in place of the version you can write a relative path pointing the root of your local library project directory (e.g. if both projects are in the same directory : `"@raven_panda/filterable-table": "../[name of the root dir of the project]"`). Remember that when you change some code, you need to rebuild project and remove node_modules and lock file from the other project where you import it and reinstall packages to make it work properly.

## Usage

You can install the package using `npm install @raven_panda/filterable-table` if you use npm, `yarn add @raven_panda/filterable-table` if you use yarn, etc.

Or you can use it locally by following steps 1, 3, and 4 of [Getting started - Install, edit and build the project](#install-edit-and-build-the-project).

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/