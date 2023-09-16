const express = require('express')
const app = express()
const port = 3000

app.listen(port)

app.get('/query', async (req, res) => {
  const query = req.query.query
  res.set('Content-Type', 'application/json')
  const result = await fetch('https://api.openai.com/v1/chat/completions', {
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            "You are an assistant that converts natural language\
          to SQL queries. I will provide a natural language query and\
          you have to convert it into a SQL query. If you don't know\
          the answer, just say \"I don't know.\" Don't say anything else.",
        },
        {
          role: 'user',
          content: `My natural query is ${query}`,
        },
      ],
    }),
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  if (result.ok) {
    result.json().then((response) => {
      res
        .send(
          JSON.stringify({
            query: query,
            raw: response,
            result: response.choices[0].message.content,
          })
        )
        .sendStatus(res.status)
    })
  } else {
    res.send(result.status).sendStatus(result.status)
  }
})
