//import and require dotenv

require('dotenv').config()
// import dependencies
const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const cors = require('cors')
const { v4: uuidv4} = require('uuid')

// create port
const PORT = process.env.PORT || 5000

//call express
const app = express()

// cors middleware
app.use(cors())

// cors options
// let whitelist = ["http://localhost:3000/", "http://webscrapperfrontend.vercel.app/"]

// let corsOptions = {
//     origin: function (origin, callback) {
//         if(whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         }
//         else{
//             callback(new Error("Not allowed by CORS"))
//         }
//     }
// }
//get news from sites
app.get('/',(req,res)=>{
    res.json('we are here')
})

const newspaper =[

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
        name: "BBC",
        url: "https://www.bbc.com/news/topics/cyd7z4rvdm3t/cryptocurrency",
        base:'https://www.bbc.com'
    },
    {
        name: "CNN",
        url: "https://edition.cnn.com/business/tech",
        base: "https://edition.cnn.com/"
    }
]

let id = 0
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
                    id = uuidv4()
                    
                    const newItem = {
                        title,
                        url: newspaper.base + url,
                        source: newspaper.name,
                        id
                    }
                    const check = newsArray.find(item=>{
                      return item.url == newItem.url
                    })
                    const imgtitle = (newItem.title.startsWith("<img"))
                    if(check || imgtitle){
                      return
                    }else{
                       newsArray.push(newItem)
                  }
                })

            })
        })

app.get('/news', (req,res)=>{
    return res.status(200).json(newsArray)
})

//listen to port

app.listen(PORT, ()=>{
    console.log(`Server now listening on port ${PORT}`)
})
