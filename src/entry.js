import plugin, * as components from '@/entry.esm';

Object.entries(components).forEach(([componentName, component]) => {
  if (componentName !== 'default') {
    plugin[componentName] = component;
  }
});

export default plugin;
