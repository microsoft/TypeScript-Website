import { loadTheme } from 'office-ui-fabric-react';

// https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/index.html

export const palette = {
  themePrimary: '#3178c6',
  themeLighterAlt: '#f5f9fd',
  themeLighter: '#d9e7f6',
  themeLight: '#b9d2ee',
  themeTertiary: '#7aaadd',
  themeSecondary: '#4688ce',
  themeDarkAlt: '#2d6eb3',
  themeDark: '#265d97',
  themeDarker: '#1c446f',
  neutralLighterAlt: '#f8f8f8',
  neutralLighter: '#f4f4f4',
  neutralLight: '#eaeaea',
  neutralQuaternaryAlt: '#dadada',
  neutralQuaternary: '#d0d0d0',
  neutralTertiaryAlt: '#c8c8c8',
  neutralTertiary: '#7da5be',
  neutralSecondary: '#5d8ca9',
  neutralPrimaryAlt: '#417494',
  neutralPrimary: '#00273f',
  neutralDark: '#174a6a',
  black: '#093855',
  white: '#ffffff',
} as const 

loadTheme({
  palette
});
