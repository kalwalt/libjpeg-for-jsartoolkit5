# libjpeg-for-jsartoolkit5

## ⚠️ Not required anymore !! ⚠️
By Emscripten version **v1.38.31** libjpeg can be included in the project simply adding the flag `-s USE_LIBJPEG`
so this library is not necessary anymore to compile jsartoolkit5.

~~This is the libjpeg library used for https://github.com/kalwalt/jsartoolkit5 necessary for compile jsartoolkit5.
Used in combination with https://github.com/artoolkitx/artoolkit5~~

## Building the libjpeg with Emscripten

If you want to build your own copy of libjpeg.bc necessary for the jsartoolkit5 project you can build it by yourself.

### Required resources

You needs Node.js, npm, python2 and emscripten.

1. Install build tools
  1. Install node.js (https://nodejs.org/en/)
  2. Install python2 (https://www.python.org/downloads/)
  3. Install emscripten (https://emscripten.org/docs/getting_started/downloads.html#download-and-install)

### Steps for building the libary

1. Clone the repository with git
```
git clone https://github.com/kalwalt/libjpeg-for-jsartoolkit5.git
```
2. Enter into the **libjpeg-for-jsartoolkit5/tools** folder with a Terminal console
```
cd libjpeg-for-jsartoolkit5/tools
```
3. Run the npm command:
```
npm run build
```
4. Your **libjpeg.bc** bytecode lib will be built into the lib folder.
