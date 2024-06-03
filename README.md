# Pony-Mailing-System
This project is a Google Apps Script with most of the main parts being a translation of parts of the pony voting processor.

## Usage
In a form with only short answer boxes, you can attach a script to it by using the script editor button as seen in the image below

<img width="295" alt="Script_btn" src="https://github.com/Brambles-cat/Pony-Mailing-System/assets/74834218/37f9796d-5e0c-46d0-be5a-db64851c7ba4">


1. The mailing system is deployed as a library, so use the add library button
2. Enter the id of the mailing system script, which is `12uaDINe_sUqFjprar7mDlm_kVY8zepbx93E4i2Kpz0vPeXfI4FLVAWWY`, but can also be found in the settings of the mailing system script
3. Look up
4. Use only the latest REVIEWED AND APPROVED deployment, since using this script requires permissions to take limited actions under your Google account (see permissions section)

<img width="637" alt="Script_steps" src="https://github.com/Brambles-cat/Pony-Mailing-System/assets/74834218/e3b1b5a1-7f8c-474d-a709-2fc54d5cf104">


Then, replace the code in the editor with
```js
function myFunction(event) {
  PonyMailingSystem.send_voting_results_email(event, "url to cache spreadsheet", "url to ineligible videos spreadsheet")
}
```
`myFunction` and `event` can be renamed to anything

Finally, a trigger needs to be added so that the form will execute the above function every time someone submits a form response.
To do this:
1. Navigate to the `Triggers` page
2. Add a trigger
3. Match settings with the image
4. Save

(Optional): Set how often you'd like to be emailed of execution failures within a specified time frame

<img width="921" alt="Script steps 2" src="https://github.com/Brambles-cat/Pony-Mailing-System/assets/74834218/e85b1eeb-55da-42f4-b858-e8ab4c2805b4">

## Permissions
[Authorization scope source](https://developers.google.com/identity/protocols/oauth2/scopes)

In order to function, the script requires the following permissions:
* View your YouTube account
* See, edit, create, and delete all your Google Sheets spreadsheets
* View and manage forms that this application has been installed in
* Send email on your behalf

Because of the permissions used, this script should only be used on a form owned by a google account that has no spreadsheets and an empty youtube channel

## To Do
 
