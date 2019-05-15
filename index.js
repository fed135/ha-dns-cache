const dns = require('dns');
const Store = require('ha-store');

var backup_lookup = dns.lookup.bind(dns);

function haCache(opts) {
  const cache = Store({
    resolver: (hosts, params) => {
      return new Promise((resolve, reject) => {
        backup_lookup(hosts[0], params.type, (err, addresses, family_r) => {
          if (err) return reject(err);
          resolve({ [hosts[0]]: { addresses, family_r } });
        });
      });
    },
    batch: { tick: 0, max: Infinity },
    cache: opts,
  });

  dns.lookup = function cachedLookup(host, type, callback) {
    return cache.get(host, { type })
      .then(res => callback(null, res.addresses, res.family_r), callback);
  };

  return cache;
}

// haCache({ limit: 500, ttl: 300000 });

module.exports = haCache;
