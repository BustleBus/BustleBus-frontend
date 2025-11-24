const path = require('path');

try {
  console.log('jotai:', require.resolve('jotai', { paths: [__dirname] }));
} catch (e) {
  console.error('jotai failed:', e.message);
}

try {
  console.log('jotai/utils:', require.resolve('jotai/utils', { paths: [__dirname] }));
} catch (e) {
  console.error('jotai/utils failed:', e.message);
}
