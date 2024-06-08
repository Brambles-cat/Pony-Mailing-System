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
  let responses, email
  
  // The line below should only be used for the type inference during development
  // const response_items = FormApp.getActiveForm().getResponses()[0].getItemResponses()

  if (test_input) {
    email = test_input.pop()
    responses = test_input
      .filter(url => url !== "")
  }
  else {
    response_items = event.response.getItemResponses();
    email = response_items.pop().getResponse()

    responses = response_items
      .filter(response_item => response_item !== "")
      .map(response_item => response_item.getResponse())
  }
  
  if (!email || !email.match("^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$")) {
    Logger.log("No email in response")
    return
  }

  const ballot = Fetcher.fetchAll(responses, cache_sheet_url)
  
  const problematic = Checks.run_checks(ballot)

  let subject, body

  if (Object.keys(problematic).length) {
    subject = "Votes Recieved With Issues D:"
    body =
      "Some issues were detected with your recent votes. Please ensure that all of them follow the voting rules so all your votes count\n\nHere's a list of the detected issues:"

    body += Object.entries(problematic).reduce(
      (message, [issue, problematic]) => message +=
      `\n\n${issue}\n${problematic.join("\n")}`,
      ""
    )
  }
  else {
    subject = "Thank You For Voting!"
    body = "All of your votes appear to be valid, thank you for voting this month!"
  }
  
  if (Preferences.v_send_emails)
    GmailApp.sendEmail(email, subject, body)

  Checks.throw_remaining_errs()
}

function send_ineligible_video_email_announcement(ineligible_spreadsheet_url) {
  Logger.log("not implemented")
}

/**
 * High likelihood of not doing anything or causing errors
 * outside of development
 */
function test() {
  let sample_response = [
    "www.youtube.com/watch?v=bHB3XshiDc0",
    "https://www.youtube.com/watch?v=q4qyeRAmC94",
    "https://www.youtube.com/watch?v=SUvmldY-EDk",
    "https://www.youtube.com/watch?v=4VKvCJ49gcY",
    "https://www.youtube.com/watch?v=4VKvCJ49gcY",
    "https://www.youtube.com/watch?v=ZPpTBzy3M2o",
    "https://youtu.be/HaPXvPK-O3o?si=zJpEARYZf_GC0dAe",
    "https://youtu.be/HaPXvPK-O3o?si=testingtest",
    "https://www.youtube.com/watch?v=JYKEnxKFRh0",
    "https://www.youtube.com/watch?v=B6mWSS2CSQ8",
    "https://www.youtube.com/watch?v=o0T16Czgshg&list=LL&index=14",
    "https://www.youtube.com/watch?v=NNla7ai3GLs&list=LL&index=50",
    "https://www.youtube.com/watch?v=Qx2hokSdku8",
    "https://youtu.be/HaPXvPK-O3o?si=zJpEARYZf_GC0dAe&test=test",
    "https://www.youtube.com/watch?v=lfjEOQE7DxI",
    "https://youtu.be",
    "gael.alejos05@gmail.com"
  ]

  send_voting_results_email(null, "https://docs.google.com/spreadsheets/d/18aHMyUMGM1z-pZYo4bQ6DrLP8qFQ5EuHSxyQNqZS2Hw/edit#gid=0", null, sample_response)
}




/*
"www.youtube.com/watch?v=XO3AYMmh6-s",
    "https://www.youtube.com/watch?v=q4qyeRAmC94",
    "https://www.youtube.com/watch?v=JYKEnxKFRh0",
    "https://www.youtube.com/watch?v=SUvmldY-EDk",
    "https://pony.tube/w/mvc9HMTY4JGDyTp1nPN61N",
    "https://www.youtube.com/watch?v=b7XTGxYCXNQ",
    "https://www.youtube.com/watch?v=alSPaZfOrCg",
    "https://www.youtube.com/watch?v=XO3AYMmh6-s",
    "www.youtube.com/watch?v=5zQDgayNSGk",
    "https://www.youtube.com/watch?v=XO3AYMmh6-s",
    "https://www.youtube.com/watch?v=_v8vIcOYw2U",
    "https://www.youtube.com/watch?v=4WK5chqSwts",
    "https://www.youtube.com/watch?v=WEQq_D9TXM4",
    "www.youtube.com/watch?v=XRHAAEbENbw",
    "https://www.bilibili.com/video/BV1UC4y1a76n/",
    "https://youtu.be/8wPr9DBlzrw?si=xJE8Yo2fZFUiwT3t",
    "https://www.bilibili.com/video/BV1Ts411D7XH/?spm_id_from=autoNext",
    "https://youtu.be/WmgzXvjKDSY?si=Wva_MIHXl2zaFy0W",
    "https://youtu.be/7NWN3wivxhA?si=L2ypUWboFNAPbFpy",
    "https://youtu.be/vtQR6FGHHFw?si=qQcmbppYjem5O_sO",
    "https://www.youtube.com/watch?v=1FwtC-1bpx0&list=PLx2GQaX8C7Wgj6CWD7ZtAy3OL5jtvswZ1&index=3",
    "https://youtu.be/8wPr9DBlzrw?si=xJE8Yo2fZFUiwT3t",
    "youtu.be/DL5e5-6CpAw?si=Hco0v4rpCKTZS6_e",
    "https://youtu.be/HaPXvPK-O3o?si=zJpEARYZf_GC0dAe",
    "https://youtu.be/22V3rKriX60?si=e7C_W24i8yd37fDD",
    "https://youtu.be/Q-U-Jo9aWtE?si=YYaBy3nbk4oB4tO0",
    "https://youtu.be/dEBvE3zGHbU?si=mhiZWKEKfbxnMPWo",
    "https://youtu.be/vtQR6FGHHFw?si=qQcmbppYjem5O_sO",
    "https://youtu.be/ed0LUVzYDk8?si=bKNNHBou9o_vMmtZ",
    "https://youtu.be/DL5e5-6CpAw?si=Hco0v4rpCKTZS6_e",
    "https://youtu.be/HaPXvPK-O3o?si=zJpEARYZf_GC0dAe",
    "https://youtu.be/HaPXvPK-O3o?si=zJpEARYZf_GC0dAe",
    "https://youtu.be/22V3rKriX60?si=e7C_W24i8yd37fDD",
    "youtu.be/a5cmUcJ_8Co?si=81UvXkmnE7obRkL5",
    "https://www.dailymotion.com/video/x7kmdyb",
    "https://youtu.be/94OxnCnABZA?si=UBEiVnFy-4BXz4b4",
    "youtu.be/94OxnCnABZA?si=UBEiVnFy-4BXz4b4",
    "youtu.be", // intentionally leaving in invalid links
    "youtu.be",
    "hbdubvufdss",
    "gael.alejos05@gmail.com"
    */