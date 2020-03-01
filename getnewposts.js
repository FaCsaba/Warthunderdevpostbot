const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://warthunder.com/en/news/?tags=Development';

const getNews = function(amount) {
if (amount > 12 ) {
    amount = 12                     //theres only 12 posts on the page, can be expended, but thats up to another dev
}

return rp(url)                                                                                              //using cheerio to parse the html
    .then(function(html) {
            newsitems = $('div.news-item', html)
            test = $('p.news-item__additional-date', html)
            let news = []                                                                                   //we create the news type, and gather info from `url`
            for (let i = 0; i < amount; i++ ) {
                news.push({                                                                                 //and push
                name: $($(newsitems, html)[i].children[3].children[1]).text(),                              //name from div.class="news-item__anons"
                descr: $($(newsitems, html)[i].children[3].children[3]).text(),                             //description from class="news-item__anons"
                img: "https:" + $(newsitems, html)[i].children[1].children[1].children[1].attribs.src,      //get the image from div.class="news-item__img"
                href: "https://warthunder.com" + $(newsitems, html)[i].children[3].children[1].attribs.href,//and the href as well
                date: $('p.news-item__additional-date', html)[i].children[0].data
            })
            }
            return news                                                                                     //send it all back
    })
    .catch(function(err) { }
);

}

module.exports = getNews                                                                                    //we export it