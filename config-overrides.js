const { override, addPostcssPlugins, addLessLoader } = require('customize-cra');
const pxtorem = require('postcss-pxtorem');

const { alias, configPaths } = require('react-app-rewire-alias');

module.exports = override(
    alias(configPaths('tsconfig.paths.json')),

    addLessLoader({
        lessOptions: {
            strictMath: true,
            noIeCompat: true,
            javascriptEnabled: true,
            modifyVars: {
                // for example, you use Ant Design to change theme color.
            },
            cssLoaderOptions: {}, // .less file used css-loader option, not all CSS file.
            cssModules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]', // if you use CSS Modules, and custom `localIdentName`, default is '[local]--[hash:base64:5]'.
            },
        },
    }),

    addPostcssPlugins([
        pxtorem({
            rootValue: 100,
            unitPrecision: 2,
            propList: ['*'],
            exclude: /antd-mobile/i,
        }),
        pxtorem({
            rootValue: 42.67,
            unitPrecision: 2,
            propList: ['*'],
            minPixelValue: 1,
            exclude: file => !/antd-mobile/i.test(file),
        }),
    ]),
);
