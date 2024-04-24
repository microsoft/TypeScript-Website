// @ts-check

// Given that COVID dropped meetups, lets disable this
// until things pick up again in 2021

const { join } = require("path")
const { writeFileSync } = require("fs")
const { meetups } = require("./meetups")
// const xml2js = require("xml2js")
// const nodeFetch = require("node-fetch").default
// const icalToolkit = require("ical-utils")
const { format } = require("prettier")
// const moment = require("moment")
// require("moment-timezone")

const chalk = require("chalk")

const tick = chalk.bold.greenBright("✓")
const cross = chalk.bold.redBright("⤫")

const go = async () => {
  let meetupDeets = []
  console.log("Looking at meetups: ")

  for (const meetup of meetups) {
    if (meetup !== meetups[0]) process.stdout.write(", ")

    const meetupURL = meetup.meetup || meetup.url
    // if (meetupURL.includes('meetup.com')) {
    //   try {
    //     const meetupID = meetupURL.split('/').pop()
    //     process.stdout.write(meetupID)

    //     const icalResponse = await nodeFetch(`https://www.meetup.com/${meetupID}/events/ical/`)
    //     const icalText = await icalResponse.text()
    //     const ical = await icalToolkit.parseToJSON(icalText)

    //     const upcomingEvent = ical.events[0]
    //     if (!upcomingEvent) {
    //       process.stdout.write(' -')
    //       meetupDeets.push({ meetup })

    //       continue
    //     }

    //     const id = upcomingEvent.uid.split('_')[1].split('@')[0]
    //     const title = upcomingEvent.summary.replace(/\\,/g, ',')
    //     const location = upcomingEvent.location.replace(/\\,/g, ',')
    //     const textDescription = upcomingEvent.description.replace(/\\,/g, ',').replace(/\\n/g, '<br />')
    //     const date = moment(upcomingEvent.start.value).tz(upcomingEvent.start.tzid)
    //     const url = upcomingEvent.additionalTags.URL

    //     let richDescription = '<p>' + upcomingEvent.description + '</p>'

    //     // Best to not assume meetup.com's long term health, and it's rss
    //     const rssResponse = await nodeFetch(`https://www.meetup.com/${meetupID}/events/rss/`)
    //     const rssText = await rssResponse.text()
    //     const rss = await xml2js.parseStringPromise(rssText)

    //     // const removeDoubleLinks =

    //     const upcoming = rss.rss.channel[0].item[0]

    //     if (upcoming.title[0] === title) {
    //       richDescription = upcoming.description[0]
    //     }

    //     const linkifiedRegex = new RegExp(`<a href="[^>]+" class="linkified">`, "g")
    //     let filteredRichText = richDescription.replace(linkifiedRegex, "").replace(new RegExp("</a></a>"), "</a>")

    //     const event = {
    //       id,
    //       url,
    //       date,
    //       location,
    //       textDescription,
    //       richDescription: filteredRichText,
    //       title,
    //     }

    //     meetupDeets.push({ meetup, event })
    //     process.stdout.write(' ' + tick)
    //   } catch (error) {
    //     console.log(error)
    //     meetupDeets.push({ meetup })
    //     process.stdout.write(' ' + cross)
    //   }
    // } else {
    process.stdout.write(meetup.title)
    meetupDeets.push({ meetup })
    // }
  }

  if (meetups.length !== meetupDeets.length) throw new Error("\n\nMeetup Deets was not the same length\n\n")

  const path = join(__dirname, "..", "generated", "meetups.json")
  writeFileSync(path, format(JSON.stringify(meetupDeets), { filepath: path }))
}

go()
