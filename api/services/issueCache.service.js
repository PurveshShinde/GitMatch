/**
 * IssueCacheService
 * In-memory TTL cache to avoid recomputing recommendations on every request.
 */

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

class IssueCacheService {
	constructor(ttl = DEFAULT_TTL) {
		this.cache = new Map();
		this.ttl = ttl;
	}

	/**
	 * Generate a cache key from userId and filter params.
	 */
	_key(userId, filters) {
		const filterStr = JSON.stringify(filters || {});
		return `${userId}:${filterStr}`;
	}

	/**
	 * Get cached result if it exists and is not expired.
	 */
	get(userId, filters) {
		const key = this._key(userId, filters);
		const entry = this.cache.get(key);

		if (!entry) return null;

		if (Date.now() - entry.timestamp > this.ttl) {
			this.cache.delete(key);
			return null;
		}

		return entry.data;
	}

	/**
	 * Store result in cache.
	 */
	set(userId, filters, data) {
		const key = this._key(userId, filters);
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
		});
	}

	/**
	 * Invalidate all cached results for a specific user.
	 */
	invalidateUser(userId) {
		const prefix = `${userId}:`;
		for (const key of this.cache.keys()) {
			if (key.startsWith(prefix)) {
				this.cache.delete(key);
			}
		}
	}

	/**
	 * Invalidate all cache entries.
	 */
	invalidateAll() {
		this.cache.clear();
	}

	/**
	 * Get cache stats.
	 */
	stats() {
		let active = 0;
		let expired = 0;

		for (const entry of this.cache.values()) {
			if (Date.now() - entry.timestamp > this.ttl) {
				expired++;
			} else {
				active++;
			}
		}

		return { active, expired, total: this.cache.size };
	}
}

// Singleton instance
const cacheInstance = new IssueCacheService();

export default cacheInstance;
