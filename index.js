const dns = require('dns');
const Store = require('ha-store');

const backup_lookup = dns.lookup.bind(dns);

function haCache(opts) {
  const missed = ErrorPool(opts);
  const cache = Store({
    resolver: (hosts, params) => {
      return new Promise((resolve, reject) => {
        if (missed.has(hosts[0])) return reject(missed.error);

        backup_lookup(hosts[0], params.type, (err, addresses, family_r) => {
          if (err) {
            missed.add(hosts[0]);
            return reject(err);
          }
          resolve({ [hosts[0]]: { addresses, family_r } });
        });
      });
    },
    cache: opts,
    batch: null,
  });

  dns.lookup = function cachedLookup(host, type, callback) {
    return cache.get(host, { type })
      .then(res => callback(null, res.addresses, res.family_r), callback);
  };

  return cache;
}

function ErrorPool(opts) {
  let writeCursor = 0;
  let clearCursor = 0;
  let maxSize = opts.missedLimit === undefined ? 100 : Number(opts.missedLimit);
  const items = Array.from(new Array(maxSize));
  setInterval(clear, opts.missedTTL === undefined ? 10000 : Number(opts.missedTTL));

  function has(key) {
    return items.includes(key);
  }

  function add(key) {
    items[writeCursor] = key;
    writeCursor = ++writeCursor % maxSize;
  }

  function clear() {
    items[clearCursor] = undefined;
    clearCursor = ++clearCursor % maxSize;
  }

  return { add, has, error: new Error('Could not resolve DNS') };
}

module.exports = haCache;
