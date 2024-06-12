class Checks {
  static run_checks(ballot) {
    const initial_vote_count = ballot.length

    // Duplicate check is outside of checks just so that
    // the ballot would be pruned of duplicates for the
    // remaining checks
    ballot = this.check_duplicates(ballot)

    const checks = [
      this.check_blacklist,
      this.check_durations,
      this.check_upload_dates,
      this.check_uploader_diversity,

      // Must be last since fail annotation should be applied
      // to a vote with another annotation first if present
      this.check_uploader_occurences,
      // this.check_fuzzy
    ]

    checks.forEach(check => check(ballot))

    let eligible_votes = ballot.length
    eligible_votes -= ballot.reduce(
      (sum, next_vote) => sum + (next_vote.annotations.length !== 0),
      0
    )

    const skipped_but_probably_eligible = this.skipped_votes - this.skipped_and_failing_votes
    
    this.user_errs["Eligible votes:"] = [`${eligible_votes + skipped_but_probably_eligible} / ${initial_vote_count + this.skipped_votes}`]
    
    // compare ballot with no duplicates with user_errs for the 5 votes minimum check
    return this.user_errs
  }

  static throw_remaining_errs() {
    if (!this.other_errs.length)
      return
    
    Logger.log("\n\n\n")
    this.other_errs.forEach(err => Logger.log(`${err.name}\n${err.stack})`))
    throw new Error("oops")
  }

  /**
   * Initializes the first error instance for a given url
   * Use this if at most one error is expected to be 
   * caught per url before the checking phase
   */
  static report_err(url, e) {
    if (e.name === UserError.name) {
      this.skipped_and_failing_votes++
      this.user_errs[e.message] = [url]
    }
    else
      this.other_errs.push(e)
  }

  static check_fail(issue, problematic) {
    if (issue in this.user_errs)
      this.user_errs[issue].push(problematic)
    else
      this.user_errs[issue] = [problematic]
  }

  // TODO: Make this better, maybe alternate platform aliases should be considered
  static same_video(video1, video2) {
    return (
      video1.title    === video2.title    &&
      video1.uploader === video2.uploader &&
      Math.abs(video1.duration - video2.duration) < 2
    )
  }

  static check_duplicates(ballot) {
    if (!ballot.length)
      return []
  
    const sim_matrix = [[ballot[0]]]
    let found_similar

    for (let i = 1; i < ballot.length; ++i) {
      found_similar = false
      
      for (const sim_array of sim_matrix) {
        if (this.same_video(ballot[i], sim_array[0])) {
          sim_array.push(ballot[i])
          ballot[i].annotations.push("duplicate")
          found_similar = true
          break
        }
      }

      if (!found_similar)
        sim_matrix.push([ballot[i]])
    }

    sim_matrix.forEach(sim_array => {
      if (sim_array.length > 1) {
        Checks.check_fail(
          "Potential duplicates found:",`${
          sim_array.reduce((result, next) => `${result}\n${next.url}`, sim_array.pop().url) + "\n"
        }`)
      }
    })

    return sim_matrix.map(sim_array => sim_array[0])
  }

  static check_blacklist(ballot) {}

  static check_durations(ballot) {
    ballot.forEach(video_data => {
      if (video_data.duration <= 30) {
        video_data.annotations.push("too short")
        Checks.check_fail("Too short:", video_data.url)
      }
      else if (video_data.duration <= 45) {
        video_data.annotations.push("may be too short")
        Checks.check_fail("May be too short:", video_data.url)
      }
    })
  }

  static check_upload_dates(ballot) {
    ballot.forEach(video_data => {
      const now = new Date()
      const
        current_year = now.getUTCFullYear(),
        upload_year = video_data.upload_date.getUTCFullYear(),
        current_month = now.getUTCMonth(),
        upload_month = video_data.upload_date.getUTCMonth()

      if (current_month === 0) {
        if (current_year - 1 === upload_year && upload_month !== 11)
          return
      }
      else if (current_month - 1 === upload_month && current_year === upload_year)
        return
      
      const issue = current_year === upload_year && current_month === upload_month ? "Video too new" : "Video too old"

      video_data.annotations.push(issue.toLowerCase())
      Checks.check_fail(`${issue}:`, video_data.url)
    })
  }

  static check_uploader_diversity(ballot) {
    const s = new Set()

    ballot.forEach(video_data => s.add(video_data.uploader))

    if (s.size < 5) {
      Checks.check_fail("Uploader Diversity:", `${s.size} out of a minimum of 5 different uploaders voted for`)
      ballot.forEach(video_data => video_data.annotations.push("5 channel rule"))
    }
  }

  static check_uploader_occurences(ballot) {
    const occurences = new Map()

    ballot.forEach(video_data => {
      const initial_value = occurences.get(video_data.uploader)
      occurences.set(video_data.uploader, initial_value === undefined ? 1 : initial_value + 1)
    })

    occurences.forEach((count, uploader) => {
      if (count >= 3)
        Checks.check_fail(
          "More than 2 videos by the following uploaders have been voted for, which is not allowed:",
          `${uploader}: ${count} votes`
        )
      else
        occurences.delete(uploader)
    })

    const uploader_array = Array.from(occurences).map(entry => entry[0])

    const rule_violating = ballot
      .filter(video_data => occurences.has(video_data.uploader))
      .sort((v1, v2) => uploader_array.indexOf(v1.uploader) - uploader_array.indexOf(v2.uploader))
      // ^ ignoring really bad time complexity bc of the 10 vote limit

    if (!rule_violating.length) return

    let removal_candidates = []
    let annotated_candidates = 0
    let group_index = 0

    // iterating over each uploader group to annotate videos to remove
    // while the uploader limit is exceeded and with priority given
    // to videos that are already annotated
    for (const count of occurences.values()) {
      const to_remove = count - 2

      for (
        let i = 0, relative_i;
        i < count && annotated_candidates < to_remove;
        ++i
      ) {
        relative_i = group_index + i

        if (removal_candidates.length < to_remove) {
          removal_candidates.push(rule_violating[relative_i])

          if (rule_violating[relative_i].annotations.length)
            ++annotated_candidates
        }

        else if (rule_violating[relative_i].annotations.length) {

          removal_candidates[
            removal_candidates.find(video_data => !video_data.annotations.length)
          ] = rule_violating[relative_i]

          ++annotated_candidates

        }

      }

      removal_candidates.forEach(video_data => video_data.annotations.push("exceeds uploader occurence (not a rule violator annotaton)"))
      removal_candidates = []
      group_index += count
    }
  }
}

Checks.user_errs = {}
Checks.other_errs = []
Checks.skipped_votes = 0
Checks.skipped_and_failing_votes = 0