import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import webpackPaths from '../configs/webpack.paths';

export default function deleteSourceMaps() {
  const deleteMaps = (directory) => {
    if (fs.existsSync(directory)) {
      const files = fs.readdirSync(directory);
      files.forEach((file) => {
        if (file.endsWith('.js.map')) {
          rimraf.sync(path.join(directory, file));
        }
      });
    }
  };

  deleteMaps(webpackPaths.distMainPath);
  deleteMaps(webpackPaths.distRendererPath);
}
