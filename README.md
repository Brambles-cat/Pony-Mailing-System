[![clasp](https://img.shields.io/badge/clasp-4285f4.svg)](https://github.com/google/clasp) [![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](https://nodejs.org/en)

# Pony-Mailing-System
This project is a Google Apps Script for google forms that sends an email to voters notifying them about their vote eligibilities upon form submission. It uses matching the main voting processor's and fetches video data from an [external service](https://github.com/Brambles-cat/VidDataFetcherEndpoint). The endpoint for fetching video data is currently set with my domain `brambles-c.com`, but would be changed when the actual server is set up

## Usage

### Create an Apps Script for a Google Form
* In a form with short answer boxes, you can attach a script to it by using the script editor button as shown in the image below

<img width="295" alt="Script_btn" src="https://github.com/Brambles-cat/Pony-Mailing-System/assets/74834218/37f9796d-5e0c-46d0-be5a-db64851c7ba4">

### Set Timezone and Configure clasp
* Rename the .json files by removing `.template` from them
* Set the timezone in `appsscript.json` (e.g., America/Los_Angeles)
* Configure `.clasp.json` with the proper `rootDir` and the script ID. The script ID can be found in the Apps Script project settings.

### Deploy Project Files
* Deploying to the Apps Script is done with the [clasp](https://github.com/google/clasp) command-line tool, which can be installed by running:
```bash
npm install -g @google/clasp
```

* To allow clasp to edit your Apps Scripts, log in to your google account with:
```bash
clasp login
```

* Pushing all of the local project files into the Apps Script is done by `cd`'ing into the project directory and run
```bash
clasp push
```

### Add a Trigger
* A trigger needs to be added so that the form will execute the main function whenever a form response is submitted

To do this:
1. Navigate to the `Triggers` page
2. Add a trigger
3. Match settings with the image
4. Save

(Optional): Set how often you'd like to be emailed of execution failures within a specified time frame

<img width="921" alt="Script steps 2" src="https://github.com/Brambles-cat/Pony-Mailing-System/assets/74834218/e85b1eeb-55da-42f4-b858-e8ab4c2805b4">

### Authorization

* The Apps Script requires authorization for the specified permissions (listed below) in order to run. Clicking `run` or `debug` with any function selected will show the authorization prompt

Now when a form response is submitted, and if it has an email in the last response box, the eligibility of the urls for the current voting period will be sent to them

## Permissions

In order to function, the script requires the following permissions specified in appsscript.json:
* View and manage forms that this application has been installed in
* Send email on the account's behalf
* Connect to an external service

[Authorization scope source](https://developers.google.com/identity/protocols/oauth2/scopes)