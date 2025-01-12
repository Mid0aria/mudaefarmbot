/*
 * Mudae Farm Bot
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

const axios = require("axios");
const path = require("path");
const os = require("os");
const fse = require("fs-extra");
const readline = require("readline");

exports.checkUpdate = async (logger, cp, packageJson) => {
    const askUser = (question) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                rl.close();
                resolve(answer.trim().toLowerCase());
            });
        });
    };

    logger.info("Bot", "Updater", `Checking for updates...`);
    try {
        const headers = {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537",
        };
        const response = await axios.get(
            `https://raw.githubusercontent.com/Mid0aria/mudaefarmbot/main/package.json`,
            { headers },
        );
        const ghVersion = response.data.version;
        const version = packageJson.version;

        if (ghVersion > version) {
            logger.warn("Bot", "Updater", "A new update is available.");
            logger.info(
                "Bot",
                "Updater",
                `New Version Notes: ${response.data.version_note}`,
            );
            const userResponse = await askUser(
                "Would you like to update now? (yes/no): ",
            );

            if (userResponse === "yes" || userResponse === "y") {
                logger.warn("Bot", "Updater", "Updating bot. Please wait...");

                const configPath = path.resolve(__dirname, "../config.json");
                const backupPath = await backupConfig(logger, configPath);

                if (fse.existsSync(".git")) {
                    try {
                        cp.execSync("git --version");
                        logger.warn("Bot", "Updater", "Updating with Git...");
                        await gitUpdate(logger, cp);
                    } catch (error) {
                        logger.alert(
                            "Bot",
                            "Updater",
                            `Git update error: ${error}`,
                        );
                        // await manualUpdate(logger);
                    }
                } else {
                    // await manualUpdate(logger);
                    await downloaddotgit(logger, cp);
                }

                updateConfigFile(logger, configPath, backupPath);

                logger.warn("Bot", "Updater", "Please restart the bot.");
            } else {
                logger.info("Bot", "Updater", "Update skipped by user.");
            }
        } else {
            logger.info("Bot", "Updater", "No updates available.");
        }
    } catch (error) {
        logger.alert(
            "Bot",
            "Updater",
            `Failed to check for updates: ${error.message}`,
        );
    }
};

const backupConfig = async (logger, configPath) => {
    try {
        const tempDir = os.tmpdir();
        const backupPath = path.join(tempDir, "config.backup.json");

        if (!fse.existsSync(tempDir)) {
            logger.alert(
                "Updater",
                "Config",
                `Temp directory does not exist: ${tempDir}`,
            );
            throw new Error("Temp directory does not exist.");
        }

        if (!fse.existsSync(configPath)) {
            logger.alert(
                "Updater",
                "Config",
                `Config file does not exist: ${configPath}`,
            );
            throw new Error("Config file does not exist.");
        }

        fse.copySync(configPath, backupPath);
        logger.info(
            "Updater",
            "Config",
            `Config backed up successfully to ${backupPath}.`,
        );

        return backupPath;
    } catch (error) {
        logger.alert(
            "Updater",
            "Config",
            `Failed to back up config: ${error.message}`,
        );
        throw error;
    }
};

const updateConfigFile = (logger, configPath, backupPath) => {
    try {
        if (!fse.existsSync(backupPath)) {
            logger.alert(
                "Updater",
                "Config",
                "Backup file not found in temp directory. Skipping config update.",
            );
            return;
        }

        const backupConfig = fse.readJsonSync(backupPath);
        const updatedConfig = fse.readJsonSync(configPath);

        const mergedConfig = { ...updatedConfig, ...backupConfig };

        for (const key in backupConfig) {
            if (updatedConfig.hasOwnProperty(key)) {
                mergedConfig[key] = backupConfig[key];
            }
        }

        fse.writeJsonSync(configPath, mergedConfig, { spaces: 2 });
        logger.info("Updater", "Config", "Config updated successfully.");
        fse.unlinkSync(backupPath);
    } catch (error) {
        logger.alert(
            "Updater",
            "Config",
            `Failed to update config: ${error.message}`,
        );
    }
};

const gitUpdate = async (logger, cp) => {
    try {
        cp.execSync("git stash");
        cp.execSync("git pull --force");
        logger.info("Updater", "Git", "Git pull successful!");
        cp.execSync("git reset --hard");
    } catch (error) {
        logger.alert(
            "Updater",
            "Git",
            `Error updating project from Git: ${error.message}`,
        );
    }
};

const downloaddotgit = async (logger, cp) => {
    const repoUrl = "https://github.com/Mid0aria/mudaefarmbot.git";
    const targetFolder = path.join(__dirname, "../.git");

    if (!fse.existsSync(targetFolder)) {
        fse.mkdirSync(targetFolder, { recursive: true });
    }
    const cloneCommand = `git clone --bare ${repoUrl} ${targetFolder}`;

    cp.execSync(cloneCommand, { stdio: "inherit" });
    await gitUpdate(logger, cp);
};
