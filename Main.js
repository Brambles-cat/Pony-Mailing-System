/**
 * Processes every url that was voted for, then sends an email
 * to the voter informing them of whether all their votes
 * were valid, or pointing out which urls were problematic and
 * suggests that they change their response so that every vote
 * would count
 * 
 * Should not include any errors that were caused because of a
 * programmers mistake. In this case, an error will be thrown after
 * sending an email so as to make the problematic executions visible
 * while not depriving the voter from confirmation that their votes
 * are fine or should be edited
 */
function send_voting_results_email(event, cache_sheet_url, ineligible_spreadsheet_url=null, test_input=null) {
  let response_items
  let vote_urls, email
  
  // The line below should only be used for type inference during development
  // const response_items = FormApp.getActiveForm().getResponses()[0].getItemResponses()

  if (test_input) {
    email = test_input.pop()
    vote_urls = test_input
      .filter(url => url !== "")
  }
  else {
    response_items = event.response.getItemResponses();
    email = response_items.pop().getResponse()

    vote_urls = response_items
      .filter(response_item => response_item !== "")
      .map(response_item => response_item.getResponse())
  }

  const ballot_data = Fetcher.fetchAll(vote_urls, cache_sheet_url)
  
  const problematic = Checks.run_checks(ballot_data)

  let subject, body

  if (Object.keys(problematic).length) {
    subject = Config.issue_msg_subject
    body = Config.issues_msg_body_start

    body += Object.entries(problematic).reduce(
      (message, [issue, problematic]) => message +=
      `\n\n${issue}\n${problematic.join("\n")}`,
      ""
    )

    if (Config.issues_msg_body_end)
      body += "\n\n" + Config.issues_msg_body_end
  }
  else {
    subject = Config.success_msg_subject
    body = Config.success_msg_body
  }

  if (Config.log_email_message)
    Logger.log(`${Config.log_recipient ? email : ""}\n\nsubject:\n${subject}\n\nbody:\n${body}`)
  
  if (!email || !email.match("^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$"))
    Logger.log("No email in response")

  else if (Config.send_emails)
    GmailApp.sendEmail(email, subject, body)

  Checks.throw_remaining_errs()
}

/**
 * For development testing purposes. Otherwise likelely of doing
 * nothing, throwing an error, or something irrelevant
 */
function test() {
  let sample_response = [
    "https://youtu.be/XfTdwzwrps8?si=R1HHduyMgNxUeqG0",
    "https://youtu.be/MvuWUURrxrY?si=_oaf04Fm0TntV_oA",
    "https://youtu.be/jAxDVnxWhSY?si=qzJH2fhjW46pXiCJ",
    "https://youtu.be/fZC5O8j90bs?si=RJJ1yXJLf4KNqplH",
    "https://youtu.be/9mgwO3lJoak?si=f5XkP8t7i0ZDIBMl",
    "https://youtu.be/qJFbWTs5Ns0?si=95iZZBigU1ZQ2hwl",
    "https://youtu.be/GhgzoCabbek?si=_XjdkJmOo77PGISo",
    "https://youtu.be/kLX02wYrigc?si=ANepQHJi9aa94Ko7",
    "https://youtu.be/8X1aksLwy3g?si=9hSk3g7I1yWop1lq",
    "https://youtu.be/_rPieklFf1s?si=XoFWanGqNp8Dj88c",
    "https://youtu.be/ZK9_7PtUgRI?si=dQcmsMVJT9-WF80F",
    "test recipient email addres"
  ]

  let june_videos = [
    'https://www.youtube.com/watch?v=gWDhSsvB7RM&t=0s',
    'https://www.youtube.com/watch?v=hr0j-i7t61g&t=0s',
    'https://www.youtube.com/watch?v=tNqcUv3rxdI&t=0s',
    'https://www.youtube.com/watch?v=fZC5O8j90bs&t=0s',
    'https://www.youtube.com/watch?v=_rPieklFf1s&t=0s',
    'https://www.youtube.com/watch?v=qJFbWTs5Ns0&t=0s',
    'https://www.youtube.com/watch?v=XfTdwzwrps8&t=0s',
    'https://www.youtube.com/watch?v=MvuWUURrxrY&t=0s',
    'https://www.youtube.com/watch?v=8X1aksLwy3g&t=0s',
    'https://www.youtube.com/watch?v=no7rLTL68Tw&t=0s',
    'test recipient email address'
  ]

  send_voting_results_email(null, "https://docs.google.com/spreadsheets/d/18aHMyUMGM1z-pZYo4bQ6DrLP8qFQ5EuHSxyQNqZS2Hw/edit#gid=0", null, june_videos)
}