const axios = require('axios')
const cheerio = require('cheerio')
require('dotenv').config({ path: '../nodemailer/.env' })
const nodemailer = require('../nodemailer/index.js')
const cron = require('node-cron')

// + express 추가
const express = require('express')
const app = express()

// + cors추가
const cors = require('cors')
app.use(cors())

// + body-parser 추가
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

const getHTML = async keyword => {
  try {
    const html = (
      await axios.get(
        `https://www.jobkorea.co.kr/Search/?stext=${encodeURI(keyword)}`
      )
    ).data

    return html
  } catch (e) {
    console.log(e)
  }
}

const parsing = async page => {
  const $ = cheerio.load(page)
  const jobs = []
  const $jobList = $('.post')
  $jobList.each((idx, node) => {
    const jobTitle = $(node).find('.title:eq(0)').text().trim()
    const company = $(node).find('.name:eq(0)').text().trim()
    const experience = $(node).find('.exp:eq(0)').text().trim()
    const education = $(node).find('.edu:eq(0)').text().trim()
    const regularYN = $(node).find('.option > span:eq(2)').text().trim()
    const region = $(node).find('.long:eq(0)').text().trim()
    const dueDate = $(node).find('.date:eq(0)').text().trim()
    const etc = $(node).find('.etc:eq(0)').text().trim()

    if (
      experience.indexOf('신입') > -1 ||
      experience.indexOf('경력무관') > -1
    ) {
      jobs.push({
        jobTitle,
        company,
        experience,
        education,
        regularYN,
        region,
        dueDate,
        etc,
      })
    }
  })

  return jobs
}

const getJob = async keyword => {
  const html = await getHTML(keyword)
  const jobs = await parsing(html)

  console.log(jobs)
  return jobs
}

const crawlingJob = async keyword => {
  const jobs = await getJob(keyword)

  const h = []
  h.push(`<table style="border:1px solid black;border-collapse:collapse;>"`)
  h.push(`<thead>`)
  h.push(`<tr>`)
  h.push(`<th style="border:1px solid black;">구인제목</th>`)
  h.push(`<th style="border:1px solid black;">회사명</th>`)
  h.push(`<th style="border:1px solid black;">경력</th>`)
  h.push(`<th style="border:1px solid black;">학력</th>`)
  h.push(`<th style="border:1px solid black;">정규직여부</th>`)
  h.push(`<th style="border:1px solid black;">지역</th>`)
  h.push(`<th style="border:1px solid black;">구인마감일</th>`)
  h.push(`<th style="border:1px solid black;">비고</th>`)
  h.push(`</tr>`)
  h.push(`</thead>`)
  h.push(`<tbody>`)
  jobs.forEach(job => {
    h.push(`<tr>`)
    h.push(`<td style="border:1px solid black;">${job.jobTitle}</td>`)
    h.push(`<td style="border:1px solid black;">${job.company}</td>`)
    h.push(`<td style="border:1px solid black;">${job.experience}</td>`)
    h.push(`<td style="border:1px solid black;">${job.education}</td>`)
    h.push(`<td style="border:1px solid black;">${job.regularYN}</td>`)
    h.push(`<td style="border:1px solid black;">${job.region}</td>`)
    h.push(`<td style="border:1px solid black;">${job.dueDate}</td>`)
    h.push(`<td style="border:1px solid black;">${job.etc}</td>`)
    h.push(`</tr>`)
  })
  h.push(`</tbody>`)
  h.push(`</table>`)

  const emailData = {
    from: 'leesh68481@gmail.com',
    to: 'leesh68481@gmail.com',
    subject: 'React.js 구인 회사 정보',
    html: h.join(''),
  }

  await nodemailer.send(emailData)
}
// crawlingJob('react')

// 매일 아침 7시 크롤링이 진행되고, 수집된 결과를 이메일로 전송
// cron.schedule('0 7 * * *', async () => {
//   crawlingJob('node.js')
// })

// 추가
app.listen(3000, () => {
  console.log('서버가 포트 3000번으로 시작 되었습니다.')
})

// app.get('/email', async (req, res) => {
//   crawlingJob('react')
//   res.send('Success')
// })

app.post('/post', function (요청, 응답) {
  console.log(요청.body.keyword)
  crawlingJob(요청.body.keyword)
  응답.send('전송완료')
})
