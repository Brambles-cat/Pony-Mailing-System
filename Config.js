class Config {}

// BOOLEAN VARIABLES

// Whether or not the vote eligibility emails should be sent to voters
Config.send_emails                   = true

// TODO : Log each of the votes detected eligibility status and annotations
Config.log_detected_vote_eligibility = false

// Log the recipent of the sent or would-be sent email
Config.log_email_message             = true

// Log the email address of the recipient or would-be recipient of the ballot results
Config.log_recipient                 = false

// TODO : When creating the email body, use video titles instead of urls when referring to the user's votes
Config.use_titles                    = true

// STRING VARIABLES

// The subject line to use upon recieving a ballot with no issues
Config.success_msg_subject   = "Thank You For Voting!"

// The body text to use upon recieving a ballot with no issues
Config.success_msg_body      = "All of your votes have been counted, thanks for voting this month!"

// The subject line to use upon recieving a ballot with ineligible votes
Config.issue_msg_subject     = "I just don't know what went wrong D:",

// The beginning body text use upon recieving a ballot with ineligible votes, before pointing out each issue in the ballot
Config.issues_msg_body_start = "Some issues were detected with your recent votes. Please ensure that they all follow the voting rules so that every vote will count\n\nHere's a list of the detected issues:"

// The ending body text to use upon recieving a ballot with ineligible votes, after pointing out each issue in the ballot
Config.issues_msg_body_end   = ""


















// extra space for scrolling