function send_voting_results_email(cache_sheet_url) {
  let items = [
    "www.youtube.com/watch?v=XO3AYMmh6-s",
    "https://www.youtube.com/watch?v=b0B_1YoZMY4",
    "https://www.youtube.com/watch?v=vcgBUBeLWSc",
    "https://www.youtube.com/watch?v=5zQDgayNSGk",
    "https://www.youtube.com/watch?v=cf57Xsw1K3Y",
    "https://www.youtube.com/watch?v=4CbRYPVw7sA",
    "https://www.youtube.com/watch?v=4WK5chqSwts",
    "https://www.youtube.com/watch?v=hvF28l9M0OA",
    "https://www.youtube.com/watch?v=J77Y-5In2fw",
    "https://www.youtube.com/watch?v=4CbRYPVw7sA",
    "https://www.youtube.com/watch?v=alSPaZfOrCg",
    "https://www.youtube.com/watch?v=z0pGedFIL7k",
    "https://www.youtube.com/watch?v=b0B_1YoZMY4",
    "https://www.youtube.com/watch?v=cf57Xsw1K3Y",
    "https://www.youtube.com/watch?v=5zQDgayNSGk",
    "https://www.youtube.com/watch?v=vcgBUBeLWSc",
    "https://www.youtube.com/watch?v=XO3AYMmh6-s",
    "https://www.youtube.com/watch?v=f8NWlTYiafA",
    "https://www.youtube.com/watch?v=alSPaZfOrCg",
    "https://www.youtube.com/watch?v=4CbRYPVw7sA",
    "https://www.youtube.com/watch?v=b7XTGxYCXNQ",
    "https://www.youtube.com/watch?v=-QRlSf_Ffag",
    "https://www.youtube.com/watch?v=cf57Xsw1K3Y",
    "https://www.youtube.com/watch?v=lEvL-RMxRhY",
    "https://www.youtube.com/watch?v=vcgBUBeLWSc",
    "https://pony.tube/w/mvc9HMTY4JGDyTp1nPN61N",
    "https://www.youtube.com/watch?v=b7XTGxYCXNQ",
    "https://www.youtube.com/watch?v=alSPaZfOrCg",
    "https://www.youtube.com/watch?v=XO3AYMmh6-s",
    "www.youtube.com/watch?v=5zQDgayNSGk",
    "https://www.youtube.com/watch?v=XO3AYMmh6-s",
    "https://www.youtube.com/watch?v=_v8vIcOYw2U",
    "https://www.youtube.com/watch?v=4WK5chqSwts",
    "https://www.youtube.com/watch?v=WEQq_D9TXM4",
    "https://www.youtube.com/watch?v=XRHAAEbENbw",
    "https://www.bilibili.com/video/BV1UC4y1a76n/",
    "https://youtu.be/8wPr9DBlzrw?si=xJE8Yo2fZFUiwT3t",
    "https://www.bilibili.com/video/BV1Ts411D7XH/?spm_id_from=autoNext",
    "https://youtu.be/WmgzXvjKDSY?si=Wva_MIHXl2zaFy0W",
    "https://youtu.be/7NWN3wivxhA?si=L2ypUWboFNAPbFpy",
    "https://youtu.be/vtQR6FGHHFw?si=qQcmbppYjem5O_sO",
    "https://www.youtube.com/watch?v=1FwtC-1bpx0&list=PLx2GQaX8C7Wgj6CWD7ZtAy3OL5jtvswZ1&index=3",
    "https://youtu.be/8wPr9DBlzrw?si=xJE8Yo2fZFUiwT3t",
    "https://youtu.be/DL5e5-6CpAw?si=Hco0v4rpCKTZS6_e",
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
    "https://youtu.be/a5cmUcJ_8Co?si=81UvXkmnE7obRkL5",
    "https://www.dailymotion.com/video/x7kmdyb",
    "https://youtu.be/94OxnCnABZA?si=UBEiVnFy-4BXz4b4",
    "https://youtu.be/94OxnCnABZA?si=UBEiVnFy-4BXz4b4",
    "https://youtu.be/94OxnCnABZA?si=UBEiVnFy-4BXz4b4",
    "https://youtu.be/94OxnCnABZA?si=UBEiVnFy-4BXz4b4",
    "youtu.be/94OxnCnABZA?si=UBEiVnFy-4BXz4b4",
    "youtu.be",
    "www.youtube.com/",
    "hbdubvufd"
    ] // FormApp.getActiveForm().getItems(FormApp.ItemType.TEXT)
  const email = items.pop()

  ballot = Fetcher.fetchAll(items, cache_sheet_url)
  
  const invalid_votes = Checks.run_checks(ballot)

  if (invalid_votes) {}
}

function m() {
  send_voting_results_email("https://docs.google.com/spreadsheets/d/18aHMyUMGM1z-pZYo4bQ6DrLP8qFQ5EuHSxyQNqZS2Hw/edit#gid=0")
}