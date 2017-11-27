"use strict";

import { app, BrowserWindow, shell } from "electron";
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow | null = null;

const isDevelopment = process.env.NODE_ENV !== "production";

import * as reload from "electron-reload";
import * as path from "path";
import * as url from "url";
import * as config from "./config";

// TODO: force reload upon changed plugin in config.MAIN_PLUGIN_REPO
reload(__dirname, {
  electron: path.join(__dirname, "node_modules", ".bin", "electron"),
});

function createWindow() {
  mainWindow = new BrowserWindow({width: 800, height: 600, frame: false});

  const appEntryPage = url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true,
  });
  mainWindow.loadURL(appEntryPage);

  // Open the DevTools.
  if (isDevelopment) mainWindow.webContents.openDevTools({mode: "undocked"});

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  function handleRedirect(event, externalURL) {
    event.preventDefault();
    shell.openExternal(externalURL);
  }

  mainWindow.webContents.on("new-window", handleRedirect);
  mainWindow.webContents.on("will-navigate", handleRedirect);
  mainWindow.webContents.on("devtools-opened", () => {
    mainWindow.webContents.focus();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
