import { terser } from 'rollup-plugin-terser';
import rimraf from 'rimraf';

const isProduction = process.env.BUILD === 'production';

function build(name = 'main') {
  return {
    input: 'src/timely.js',
    output: {
      dir: 'dist/',
      format: 'esm',
      plugins: [],
      sourcemap: isProduction ? false : true,
    },
    plugins: [
      isProduction
        ? terser({
            ecma: '2016',
            compress: { drop_console: true },
          })
        : '',
    ],
  };
}

console.log('PROCESS:ENV', isProduction, process.env.BUILD);
rimraf.sync('dist/');

export default build();
