# VOY!

<p align="center">
	<img src="resources/icon.png" alt="Voy App logo" width="230" />
</p>

<p align="center">
	<img src="https://img.shields.io/badge/Electron-191970?logo=electron&logoColor=white" alt="Electron" />
	<img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" alt="React" />
	<img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
	<img src="https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
	<img src="https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white" alt="SQLite" />
</p>

## Overview

VOY! is a desktop management application built to organize operational data and daily field workflows. It helps managers from Rosaprima's company to centralize records from each trip, track performance, and keep decision-making fast through a simple and reliable desktop experience without the need to have internet connection.

## Features

**Reports:** It allows the registration of each trip organized by farm and respective area. Additionally, each report can be downloaded as an Excel document with Rosaprima's corporate format.

<p align="center">
	<img src="resources/img/report_prev1.png" alt="report_1" width="80%" />
	<img src="resources/img/report_prev2.png" alt="report_2" width="80%" />
</p>

**Metrics:** Visualize the performance of trips for each farm, as well as a summary of the most important indicators in the work zones.

<p align="center">
	<img src="resources/img/metrics_prev1.png" alt="metrics_1" width="80%" />
	<img src="resources/img/metrics_prev2.png" alt="metrics_2" width="80%" />
</p>

**Search:** Quick filtering to obtain details of a particular type of trip among all records made.

<p align="center">
	<img src="resources/img/search_prev.png" alt="search_prev" width="80%" />
</p>

**Administrate:** Management of registration/editing of data relating to properties, their areas, managers and requesters.

<p align="center">
	<img src="resources/img/admin_prev.png" alt="admin_prev" width="80%" />
</p>

## Installation (Windows)

You can [download](https://github.com/devdiagon/ya-void/releases/latest) the latest `.exe` installer from the release assets in this repository. Then you need to run the installer and follow the setup steps on your machine.

## Development Setup

Install dependencies:

```bash
pnpm install
```

Run the app in development mode:

```bash
pnpm dev
```

Build the Windows binaries (output will be generated in the `dist` directory):

```bash
pnpm build:win
```

>*Since this is a Windows binary, you MUST run the build command from a terminal opened as Administrator to avoid permission issues while generating artifacts.*