import rimraf from 'rimraf';
import typescript from '@rollup/plugin-typescript';

const isProduction = process.env.BUILD === 'production';

function build(name = 'main') {
  return {
    input: 'src/timely.ts',
    output: {
      dir: 'dist/',
      format: 'esm',
      plugins: [],
      sourcemap: isProduction ? false : true,
    },
    plugins: [typescript()],
  };
}

console.log('process.env.BUILD', process.env.BUILD);
rimraf.sync('dist/');

export default build();
