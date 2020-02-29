const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://warthunder.com/en/news/?tags=Development';

const getNews = function(amount) {
if (amount > 15 ) {
    amount = 15
}

return rp(url)                                                                                              //using cheerio to parse the html
    .then(function(html) {
            newsitems = $('div.news-item', html)
            let news = []                                                                                   //we create the news type, and gather info from `url`
            for (let i = 0; i < amount; i++ ) {
                news.push({                                                                                 //and push
                name: $($(newsitems, html)[i].children[3].children[1]).text(),                              //name from div.class="news-item__anons"
                descr: $($(newsitems, html)[i].children[3].children[3]).text(),                             //description from class="news-item__anons"
                img: "https:" + $(newsitems, html)[i].children[1].children[1].children[1].attribs.src,      //get the image from div.class="news-item__img"
                href: "https://warthunder.com" + $(newsitems, html)[i].children[3].children[1].attribs.href //and the href as well
            })
            }
            return news                                                                                     //send it all back
    })
    .catch(function(err) { }
);

}

module.exports = getNews                                                                                    //we export it