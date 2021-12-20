# ha-dns-cache

A DNS cache using [ha-store](https://github.com/fed135/ha-store)!

- Smart TLRU cache
- Request coalescing and batching
- Insightful stats and [events](https://github.com/fed135/ha-store#Monitoring-and-events)
- Lightweight, configurable, battle-tested


## Installing

`npm install ha-dns-cache`


## Usage

```node
const DNSCache = require('ha-dns-cache')({ ttl: 30000, limit: 500 });

DNSCache.on('cacheHit', evt => console.log('cache-hit!', evt));
```

## Testing

You can benchmark this library by running:

```
npm run bench
```

And compare with regular results:

```
npm run bench:no-cache
```


## Contribute

Please do! This is an open source project - if you see something that you want, [open an issue](https://github.com/fed135/ha-dns-cache/issues/new) or file a pull request.

I am always looking for more maintainers, as well.


## License 

[Apache 2.0](LICENSE) (c) 2021 Frederic Charette

