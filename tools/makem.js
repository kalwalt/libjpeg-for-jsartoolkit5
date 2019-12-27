/*
 * Simple script for running emcc on libjpeg by
 * @kalwalt Walter Perdan github.com/kalwalt
 * form original script developed by:
 * @author zz85 github.com/zz85
 * @author ThorstenBux github.com/ThorstenBux
 */


var
	exec = require('child_process').exec,
	path = require('path'),
  fs = require('fs'),
	child;

var EMSCRIPTEN_ROOT = process.env.EMSCRIPTEN;
//var LIBJPEG_INCLUDE = process.env.LIBJPEG_ROOT;

if (!EMSCRIPTEN_ROOT) {
	console.log("\nWarning: EMSCRIPTEN environment variable not found.")
	console.log("If you get a \"command not found\" error,\ndo `source <path to emsdk>/emsdk_env.sh` and try again.");
}

var EMCC = EMSCRIPTEN_ROOT ? path.resolve(EMSCRIPTEN_ROOT, 'emcc') : 'emcc';
var EMPP = EMSCRIPTEN_ROOT ? path.resolve(EMSCRIPTEN_ROOT, 'em++') : 'em++';
var OPTIMIZE_FLAGS = ' -Oz '; // -Oz for smallest size
var MEM = 256 * 1024 * 1024;

var OUTPUT_PATH = path.resolve(__dirname, '../lib/') + '/';

var libjpeg_sources = 'jcapimin.c jcapistd.c jccoefct.c jccolor.c jcdctmgr.c jchuff.c \
		jcinit.c jcmainct.c jcmarker.c jcmaster.c jcomapi.c jcparam.c \
		jcphuff.c jcprepct.c jcsample.c jctrans.c jdapimin.c jdapistd.c \
		jdatadst.c jdatasrc.c jdcoefct.c jdcolor.c jddctmgr.c jdhuff.c \
		jdinput.c jdmainct.c jdmarker.c jdmaster.c jdmerge.c jdphuff.c \
		jdpostct.c jdsample.c jdtrans.c jerror.c jfdctflt.c jfdctfst.c \
		jfdctint.c jidctflt.c jidctfst.c jidctint.c jidctred.c jquant1.c \
		jquant2.c jutils.c jmemmgr.c \
		jmemansi.c'

var FLAGS = '' + OPTIMIZE_FLAGS;
FLAGS += ' -Wno-warn-absolute-paths ';
FLAGS += ' -s TOTAL_MEMORY=' + MEM + ' ';
FLAGS += ' -s USE_ZLIB=1';
FLAGS += ' --memory-init-file 0 '; // for memless file

FLAGS += ' --bind ';

var INCLUDES = [
    OUTPUT_PATH,
    path.resolve(__dirname, './'),
].map(function(s) { return '-I' + s }).join(' ');

function format(str) {
    for (var f = 1; f < arguments.length; f++) {
        str = str.replace(/{\w*}/, arguments[f]);
    }
    return str;
}

function clean_builds() {
    try {
        var stats = fs.statSync(OUTPUT_PATH);
    } catch (e) {
        fs.mkdirSync(OUTPUT_PATH);
    }

    try {
        var files = fs.readdirSync(OUTPUT_PATH);
        if (files.length > 0)
            for (var i = 0; i < files.length; i++) {
                var filePath = OUTPUT_PATH + '/' + files[i];
                if (fs.statSync(filePath).isFile())
                    fs.unlinkSync(filePath);
            }
    }
    catch(e) { return console.log(e); }
}

var compile_libjpeg = format(EMCC + ' ' + INCLUDES + ' '
		+ path.resolve(__dirname, '../') + '/' + libjpeg_sources
		+ FLAGS + ' '  + ' -o {OUTPUT_PATH}libjpeg.bc ',
		OUTPUT_PATH);

/*
 * Run commands
 */

function onExec(error, stdout, stderr) {
    if (stdout) console.log('stdout: ' + stdout);
    if (stderr) console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error.code);
        process.exit(error.code);
    } else {
        runJob();
    }
}

function runJob() {
    if (!jobs.length) {
        console.log('Jobs completed');
        return;
    }
    var cmd = jobs.shift();

    if (typeof cmd === 'function') {
        cmd();
        runJob();
        return;
    }

    console.log('\nRunning command: ' + cmd + '\n');
    exec(cmd, onExec);
}

var jobs = [];

function addJob(job) {
    jobs.push(job);
}

addJob(compile_libjpeg);

runJob();
