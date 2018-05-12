import * as cheerio from 'cheerio';
import Article from '../models/article.model';
import Publication from '../models/publication.model';
import * as requestPromise from "request-promise";

export default class ArticleCrawler {
    knownSites = {
        'hotnews.ro': 'hotnewsRo',
        'digi24.ro': 'digi24Ro',
        'sputnik.md': 'sputnikMd'
    };

    url: string;
    site: string;

    constructor(url) {
        this.url = url;
    }

    crawl() {
        this.site = Object.keys(this.knownSites).find((site) => this.url.includes(site));

        return requestPromise({
            method: 'GET',
            uri: this.url,
        }).then((html) => {
            return this[this.knownSites[this.site]](html)
        });
    }

    private async digi24Ro(html) {
        const $ = cheerio.load(html);

        const title = $('title').first().text();
        const articleLead = $('.data-app-meta-article p').first().text();
        const articleBody = $('.data-app-meta-article p').filter(i => i > 0).text();
        const thumbnail= $('.img-responsive img').attr('data-src-later');

        let publication = await Publication.findOne({ alias: this.site }).exec();

        return new Article({
            title,
            articleLead,
            articleBody,
            thumbnail,
            url: this.url,
            publication: publication._id,
            date: new Date()
        });
    }

    private async hotnewsRo(html) {
        const $ = cheerio.load(html);

        const title = $('title').first().text();
        const articleLead = $('#articleContent strong').first().text();
        const articleBody = $('#articleContent').remove('strong').text();
        const thumbnail = $('#articleContent img').attr('src');

        let publication = await Publication.findOne({ alias: this.site }).exec();

        return new Article({
            title,
            articleLead,
            articleBody,
            thumbnail,
            url: this.url, publication: publication._id,
            date: new Date()
        });
    }

    private async sputnikMd(html) {
        const $ = cheerio.load(html);

        const title = $('title').first().text();
        const articleBody = $('.b-article__text p').text();
        const articleLead = $('.b-article__text p').text();
        const thumbnail = $('.b-inject__media img').attr('src');

        let publication = await Publication.findOne({ alias: this.site }).exec();

        return new Article({
            title,
            articleLead,
            articleBody,
            thumbnail,
            url: this.url, publication: publication._id,
            date: new Date()
        });
    }
}
