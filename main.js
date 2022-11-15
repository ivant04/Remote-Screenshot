const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const remoteMain = require("@electron/remote/main");
remoteMain.initialize();


let mainWindow, args = {}, timeout, appReady = true;

const pargs = [
    "url",
    "scroll",
    "scrollh",
    "location",
    "name",
    "resolution",
    "format",
    "silent"
];

if(process.argv[1] != undefined)
{
    if(process.argv[1].toLowerCase().endsWith(".exe")) // If the app is run from a compressed SFX archive
    {
        let ind = process.argv[1].lastIndexOf("/");
        if(ind == -1) ind = process.argv[1].lastIndexOf("\\");

        if(ind != -1) process.chdir(process.argv[1].substring(0, ind));
    }
}

for(let i = 0; i < process.argv.length; i++)
{
    for(let j = 0; j < pargs.length; j++)
    {
        if(process.argv[i] === pargs[j] || process.argv[i] === "-" + pargs[j] || process.argv[i] === "--" + pargs[j])
        {
            args[pargs[j]] = true;
        }
        else if(process.argv[i].startsWith(pargs[j] + "=") || process.argv[i].startsWith("-" + pargs[j] + "=") || process.argv[i].startsWith("--" + pargs[j] + "="))
        {
            let val = process.argv[i].substring(process.argv[i].indexOf("=") + 1);
            if(val == undefined || val == null || val == "" || val == " ")
            {
                val = undefined;
            }
            args[pargs[j]] = val;
        }
    }
}
global.args = args;


if(args.url == undefined || args.url == null || args.url == "" || args.url == " ")
{
    if(args && Object.keys(args).length === 0 && Object.getPrototypeOf(args) === Object.prototype) showHelp();
    else fail(400);
}
else if(!isValidHttpUrl(args.url)) fail(404);


let resx, resy;
if(args.resolution != undefined)
{
    const xpos = args.resolution.indexOf("x");
    if(xpos == -1) fail(-4);
    resx = Number(args.resolution.substring(0, xpos));
    resy = Number(args.resolution.substring(xpos+1));
}


let location = "", format;
if(args.location != undefined && args.location != "" && args.location != " ")
{
    if(fs.existsSync(args.location))
    {
        location = args.location;
        if(args.location[args.location.length-1] != "/" && args.location[args.location.length-1] != "\\")
        {
            location += "\\";
        }
    }
    else fail(-1);
}

if(args.name != undefined)
{
    if(args.name.length > 250) fail(-2);
    else location += args.name;
}
else
{
    const da = new Date();
    const nn = "Remote Screenshot (" + da.getFullYear() + "-" + da.getMonth() + "-" + da.getDate() + " " + da.getHours() + "-" + da.getMinutes() + "-" + da.getSeconds() + ")";
    location += nn;
}

if(args.format != undefined)
{
    if(args.format === "png" || args.format === "jpg" || args.format === "jpeg")
    {
        location += ".";
        location += args.format;
        format = args.format;
    }
    else fail(-3);
}
else
{
    location += ".jpg";
    format = "jpg";
}


const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: resx || 1280,
        height: resy || 720,
        title: "Remote Screenshot",
        icon: "icon.ico",
        show: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.on("page-title-updated", (event, title) => {
        if(title === "RS-Ready-Toxic48")
        {
            clearTimeout(timeout);
            setTimeout(ssCallback, 300);
        }
    });
    remoteMain.enable(mainWindow.webContents);

    mainWindow.loadURL(args.url);

    timeout = setTimeout(() => fail(-5), 40000); // Exit the app if the renderer didn't return a response after 40 sec
};

app.on('ready', () => {
    if(appReady)
    {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

function isValidHttpUrl(string) 
{
    let url;
    try 
    {
        url = new URL(string);
    }
    catch (_) 
    {
        return false;  
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

function fail(errcode)
{
    appReady = false;
    let fmsg;
    if(errcode == -1)
    {
        fmsg = "The specified location is invalid.";
    }
    else if(errcode == -2)
    {
        fmsg = "The file name is too long.";
    }
    else if(errcode == -3)
    {
        fmsg = "The file format is invalid (use \"jpg\", \"jpeg\" or \"png\").";
    }
    else if(errcode == -4)
    {
        fmsg = "The screenshot resolution is invalid (e.g. -resolution=\"1280x720\").";
    }
    else if(errcode == -5)
    {
        fmsg = "The request timed out (the page didn't load in 40 seconds).\nPossible network error.\nTry again in a bit...";
    }
    else if(errcode == 400)
    {
        fmsg = "There was no URL specified (e.g. -url=\"https://example.com\").";
    }
    else if(errcode == 404)
    {
        fmsg = "Couldn't capture \"" + args.url + "\", the URL is invalid.";
    }
    else if(errcode == 504)
    {
        fmsg = "Couldn't capture \"" + args.url + "\", the URL was inaccessible.";
    }

    if(args.silent != true)
    {
        console.log("[Remote-Screenshot] " + fmsg);
    }
    app.quit();
}

function showHelp()
{
    appReady = false;
    console.log("Takes a screenshot of a remote wepage and saves it onto the drive");
    console.log("");
    console.log("");
    console.log("RSS --url=<url> [--scroll=<value>] [--scrollh=<value>] [--location=<path>] [--name=<name>]");
    console.log("    [--resolution=<resolution>] [--format=<format>] [--silent]");
    console.log("");
    console.log("    --url          URL of the wepage to take a screenshot of.");
    console.log("                   Example: --url=\"https://google.com\"");
    console.log("    --scroll       Vertical scroll value of the screenshotted wepage in pixels.");
    console.log("                   Example: --scroll=100, default: 0");
    console.log("    --scrollh      Horizontal scroll value of the screenshotted wepage in pixels.");
    console.log("                   Example: --scrollh=100, default: 0");
    console.log("    --location     Path where to save the screenshot file.");
    console.log("                   Example: --location=\"C:\\Users\\PC\\Desktop\", default: current directory");
    console.log("    --name         Name of the screenshot file.");
    console.log("                   Example: --name=\"Screenshot\", default: Remote Screenshot (current date and time)");
    console.log("    --resolution   Resolution of the screenshot image.");
    console.log("                   Example: --resolution=\"1920x1080\", default: \"1280x720\"");
    console.log("    --format       Format of the screenshot file (png, jpg or jpeg).");
    console.log("                   Example: --format=\"jpg\", default: \"png\"");
    console.log("    --silent       Do not echo any potential errors into the CLI.");
    console.log("                   Example: --silent, default: false");
    console.log("");
    console.log("");
    app.quit();
}

function ssCallback()
{
    mainWindow.webContents.capturePage({x: 0, y: 0, width: resx || 1280, height: resy || 720}).then((img) => {
        if(format === "jpg" || format === "jpeg") fs.writeFileSync(location, img.toJPEG(100), "base64");
        else if(format === "png") fs.writeFileSync(location, img.toPNG(), "base64");
        else
        {
            fail(-3);
            return;
        }
        
        if(fs.statSync(location).size == 0)
        {
            fail(504);
            return;
        }
        else
        {
            if(args.silent != true) console.log("[Remote-Screenshot] Screenshot succesfully saved in \"" + path.resolve(location) + "\".");
            app.quit();
        }
    });
}