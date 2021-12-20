const dns = require('dns');

const startTime = Date.now();
const target = 1000;
let completed = 0;
let cacheHits = 0;
let coalescedHit = 0;

const randomDomains = [
    'google.com',
    'yahoo.com',
    'facebook.com',
    'apple.com',
    'microsoft.com',
    'alphabet.com',
    'twitter.com',
    'github.com',
    'reddit.com',
    'amazon.com',
    'tesla.com',
    'shutterstock.com',
    'coursera.org',
    'stackoverflow.com',
    'nodejs.org',
    'mozilla.org',
    'speedtest.net'
].map((d) => (Math.random().toString(36)).slice(2) + '.' + d);  // Ensures random domains every run (cached at other layers)

console.log('randomDomains', randomDomains)

const NO_CACHE = !!process.env.NO_CACHE;
let cache;
if (!NO_CACHE) {
    cache = require('./')({ ttl: 30000, max: 500 });
    cache.on('cacheHit', () => cacheHits++);
    cache.on('coalescedHit', () => coalescedHit++);
}

for (let i = 0; i < target; i++) {
    ((_i) => {
        setTimeout(() => {
            dns.lookup(randomDomains[Math.floor(Math.random() * randomDomains.length)], { family: 4, hints: dns.ADDRCONFIG | dns.V4MAPPED }, done);
        }, _i * 1);
    })(i);
}

function done(err, host) {
    completed++;
    if (completed % 100 === 0) console.log('completed', completed)
    if (completed === target) {
        console.log(`Completed in ${Date.now() - startTime} ms with ${cacheHits} cache hits and ${coalescedHit} coalesced hits`, cache && cache.size());
        process.exit();
    }
}
