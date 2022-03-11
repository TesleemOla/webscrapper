// import dependencies
const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const cors = require('cors')

// create port 
const PORT = 5000

//call express
const app = express()

// cors middleware
app.use(cors())
//get news from sites
app.get('/',(req,res)=>{
    res.json('we are here')
})

const newspaper =[
    {
        name: "Bloomberg",
        url: "https://www.bloomberg.com/cryptocurrencies",
        base:''
    },
    {
        name: "Guardian",
        url: "https://www.theguardian.com/technology/cryptocurrencies",
        base: ''
    },
    {
        name: "Reuters",
        url: "https://www.reuters.com/business/future-of-money/",
        base:'https://www.reuters.com'
    },
    {
        name: "Financial Times",
        url: "https://www.ft.com/cryptocurrencies",
        base:''
    },
    {
        name: "BBC",
        url: "https://www.bbc.com/news/topics/cyd7z4rvdm3t/cryptocurrency",
        base:'https://www.bbc.com/news/topics/cyd7z4rvdm3t/cryptocurrency'
    }
]


const newsArray = []
    newspaper.forEach(newspaper=>{
        const url = newspaper.url
        axios.get(url)
            .then( result => {
                const html = result.data
                const $ = cheerio.load(html)
                $('a:contains("crypto")', html).each(function () {
                    const title = $(this).text()
                    const url = $(this).attr('href')
                    newsArray.push({
                        title,
                        url: newspaper.base + url,
                        source: newspaper.name
                    })
                })  
               
            })
        })

app.get('/news', (req,res)=>{
    res.json(newsArray)
})

//listen to port

app.listen(PORT, ()=>{
    console.log(`Server now listening on port ${PORT}`)
})
