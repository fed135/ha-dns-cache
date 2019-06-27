const { randomBytes } = require('crypto');
const cache = require('./')({ ttl: 30000, max: 500 });
const axios = require('axios');
const dns = require('dns');

const startTime = Date.now();
const target = 1000;
let completed = 0;
let cacheHits = 0;

cache.on('cacheHit', () => cacheHits++)

for (let i = 0; i < target; i++) {
    ((_i) => {
        setTimeout(() => {
            //dns.lookup(`${randomBytes(1).toString('hex')}.com`, { family: undefined, hints: 32 }, done);
            axios.get(`http://${randomBytes(1).toString('hex')}.com`).then(done, done);
        }, _i * 1);
    })(i);
}

function done() {
    completed++;
    if (completed % 100 === 0) console.log('completed', completed)
    if (completed === target) {
        console.log(Date.now() - startTime);
        process.exit();
    }
}
