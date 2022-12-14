<!--

When uploading your plugin to github/gitlab
start your repo name with "omegga-"

example: https://github.com/CriticalFloof/omegga-Default-Minigame-Enforcer

Your plugin will be installed via omegga install gh:CriticalFloof/Default-Minigame-Enforcer

-->

# Default-Minigame-Enforcer

A typed safe plugin for [omegga](https://github.com/brickadia-community/omegga).

This plugin allows the host to force any unauthorized users outside of any minigame into a selected fallback.

## Install

`omegga install gh:CriticalFloof/Default-Minigame-Enforcer`

## Usage

1. Create the fallback minigame.
2. Setup the Default-minigame Index via Omegga's Web UI (Index is ordered top-down in-game, in the minigame menu. Index starts at 0).
3. Set the preferred check interval. The lower the number, the more lag the plugin might experience.
4. Select the role(s) you wish to allow access outside of any minigame.
5. Inside the game, type the command /calibrate-gm. This allows the plugin to find the Global Team (minigame) ID. This is required for every restart.

That's it!
