const dns = require('dns');
const Store = require('ha-store');

const backup_lookup = dns.lookup.bind(dns);

function haCache(opts) {
  const cache = Store({
    resolver: (hosts, params) => {
      return new Promise((resolve) => {
        backup_lookup(hosts[0], params.type, (err, addresses, family_r) => {
          resolve({ [hosts[0]]: err || { addresses, family_r } });
        });
      });
    },
    cache: { ttl: opts.ttl || 1, limit: opts.max || opts.limit || 1 },
    batch: null,
  });

  dns.lookup = function cachedLookup(host, type, callback) {
    return cache.get(host, { type })
      .then((res) => {
        callback(!res?.addresses && res, res?.addresses, res?.family_r);
      });
  };

  return cache;
}

module.exports = haCache;
