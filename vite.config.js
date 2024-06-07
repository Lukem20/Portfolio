import { defineConfig } from "vite";
import path from 'path';
import fs from 'fs';

function getHtmlEntryFiles (srcDir) {
    const entry = {};

    function traverseDirectory (currentDir) {
        const files = fs.readdirSync(currentDir);

        files.forEach((file) => {
            const filePath = path.join(currentDir, file);
            const isDirectory = fs.statSync(filePath).isDirectory();

            if (isDirectory) {
                traverseDirectory(filePath);
            } else if (path.extname(file) === '.html') {
                const name = path.relative(srcDir, filePath).replace(/\..*$/, '');
                entry[name] = filePath;
            }
        });
    }

    traverseDirectory(srcDir);

    return entry;
}

export default defineConfig({
    root: 'src',
    build: {
        rollupOptions: {
            input: getHtmlEntryFiles('src')
        },
        outDir: '../dist',
        emptyOutDir: true
    },
    optimizeDeps: {
        entries: 'src/**/*{.hmtl, .css, .js}'
    },
    publicDir: 'src/images',

});