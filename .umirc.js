const fs = require('fs');
const path = require('path');
const _ = require('lodash');

// ref: https://umijs.org/config/
export default {
  history: 'hash',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'web',
      dll: false,
      pwa: false,
      locale: {
        default: 'zh-TW',
      },
      routes: {
        exclude: [],
        update: (routes) => {
          const sortRoute = (routeList) => {
            const res = _.chain(routeList).sortBy((o) => {
              // 將:取代為ASCII最大字碼符號~，調整排序先後順序，當無任何path時使用兩個~確保在最底層
              return _.replace(_.get(o, 'path', '~~'), ':', '~');
            }).value();
            return _.map(res, (route) => {
              if (_.has(route, 'routes')) {
                return _.extend(route, {
                  routes: sortRoute(_.get(route, 'routes')),
                });
              }
              return route;
            });
          }
          const newRoute = sortRoute(routes);
          const exportRouteJSON = JSON.stringify(newRoute, null, 2);
          fs.writeFileSync('./src/config/routes.js', `// Do not modify this file, any change will not save.\n\nexport default ${exportRouteJSON};\n`);
          return newRoute;
        },
      },
      hardSource: false,
    }],
  ],
  alias: {
    '@': path.resolve(__dirname, 'src/'),
  },
  extraBabelPlugins: [
    ['import', {
      libraryName: 'ant-design-pro',
      libraryDirectory: 'lib',
      style: true,
      camel2DashComponentName: false,
    }],
  ],
  theme: {
    // "@layout-header-background": "#A8D8B9",
    // "@menu-dark-color": "#038171",
    // "@menu-dark-arrow-color": "@menu-dark-color",
    // "@menu-dark-bg": "@layout-header-background",
    // "@menu-dark-submenu-bg": "#9fc4ac",
    // "@menu-dark-highlight-color": "#e68d0a",
    // "@menu-dark-item-active-bg": "#dcfae7",
    "@font-size-base": "18px",
  },
}
