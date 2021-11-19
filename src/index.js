const fs = require('fs');
const path = require('path');
const execShPromise = require("exec-sh").promise;
const YAML = require('yaml');

const {waitForInput} = require('./utils');

const runOnlyScripts = process.env.ONLY_SCRIPTS || false;

(async () => {
    try {
        const configPath = path.join(__dirname, '../config/config.yaml');
        const configFile = fs.readFileSync(configPath, 'utf-8');
        const config = YAML.parse(configFile);

        console.log('config: ', config);
        await waitForInput();

        // TODO - Add checks for these to be backed up (I currently don't use these)
        // CustomAvatars
        // CustomNotes
        // CustomPlatforms
        // CustomSabers
        // Playlists

        const installFolder = path.join(config.steamAppsCommonFolder, 'Beat Saber');
        const customLevels = path.join(config.steamAppsCommonFolder, 'Beat Saber', 'Beat Saber_Data', 'CustomLevels');
        const beatSaberAppData = path.join(config.appDataHyperbolicMagnetismFolder, 'Beat Saber');
        const localScores = [
            'LocalDailyLeaderboards.dat',
            'LocalLeaderboards.dat',
            'PlayerData.dat',
        ]

        // Backup the above folders/files
        const backupCustomData = path.join(config.steamAppsCommonFolder, 'beatsaberbackup');
        const backupCustomLevels = path.join(config.steamAppsCommonFolder, 'beatsaberbackup', 'CustomLevels');
        if (!runOnlyScripts) {
            if(!fs.existsSync(backupCustomData)) {
                fs.mkdirSync(backupCustomData);
            }
            fs.renameSync(customLevels, backupCustomLevels);
        }

        const backupAppData = path.join(config.appDataHyperbolicMagnetismFolder, 'beatsaberbackup');
        if (!runOnlyScripts) {
            if(!fs.existsSync(backupAppData)) {
                fs.mkdirSync(backupAppData);
            }
            backupLocalScores = localScores.map((localScore) => {
                const appDataLocalScore = path.join(beatSaberAppData, localScore);
                const backupLocalScore = path.join(backupAppData, localScore);
                fs.renameSync(appDataLocalScore, backupLocalScore);
                return backupLocalScore;
            });
        }
        
        // Delete the contents of above folders/files
        if (!runOnlyScripts) {
            fs.rmSync(path.join(installFolder, '\\'), { recursive: true, force: true });
            fs.rmSync(path.join(beatSaberAppData, '\\'), { recursive: true, force: true });
            // TODO - don't delete the containing folder, just contents
            fs.mkdirSync(installFolder);
            fs.mkdirSync(beatSaberAppData);
        }

        // Uninstall and Reinstall
        // const steamScript = `steamcmd +login ${config.steamUserName} +app_uninstall 620980 +force_install_dir "${installFolder}" +app_update 620980 validate +quit`;
        // console.log(`Running script: ${steamScript}`);
        // await execShPromise(steamScript);
        console.log('\n======================================================================================');
        console.log('|| Uninstall BeatSaber: Open Steam, right-click on BeatSaber -> Manage -> Uninstall ||');
        console.log('======================================================================================\n');
        await waitForInput();
        
        console.log('\n========================================');
        console.log('|| Reinstall BeatSaber: Click install ||');
        console.log('========================================\n');
        await waitForInput();

        // Play and Quit the game
        console.log('\n=============================================');
        console.log('|| Please manually launch game, then quit. ||');
        console.log('=============================================\n');
        await waitForInput();

        // Replace the backups back to where they belong
        if (!runOnlyScripts) {
            fs.rmSync(customLevels, { recursive: true, force: true });
            fs.renameSync(backupCustomLevels, customLevels)
            localScores.map((localScore) => {
                const appDataLocalScore = path.join(beatSaberAppData, localScore);
                const backupLocalScore = path.join(backupAppData, localScore);
                fs.renameSync(backupLocalScore, appDataLocalScore);
            });
        }

        // Update and install mods
        console.log('\n=================================================================');
        console.log('|| Please update individual mods. Close Mod Assistant when done. ||');
        console.log('=================================================================\n');
        execShPromise(config.modAssistantExe);
        await waitForInput();

        console.log('Enjoy the game!');
    } catch (error) {
        console.error('Error: ', error);
    }
})();