import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
    return {
        keyArgs: false, // Tells Apollo we will take care of everything
        read(existing = [], {args, cache}) {
            const {skip, first} = args;

            // Get total items count
            const data = cache.readQuery({ query: PAGINATION_QUERY });
            const count = data?._allProductsMeta?.count;
            const page = skip / first + 1;
            const pages = Math.ceil(count/first);

            // check if items exist
            const items = existing.slice(skip, skip + first).filter(x => x);

            // If there are items
            // AND there aren't enough items to satisfy how many we requested
            // AND we are on last page
            // THEN send it
            if (items.length && items.length !== first && page === pages) {
                return items;
            }
            if (items.length !== first) {
                // We don't have no items. Need to fetch from server
                return false;
            }
            if (items.length) {
                console.log(`There are ${items.length} items in the cache ! Gonna send them to apollo`);
                return items;
            }
            return false;
        },
        merge(existing, incoming, { args }) { // Runs when apollo client comes back from network with data
            const {skip, first} = args;
            console.log(`Merging ${incoming.length} items from network`);
            const merged = existing ? existing.slice(0) : [];
            for (let i = skip; i < skip + incoming.length; ++i) {
                merged[i] = incoming[i - skip];
            }

            return merged;
        }
    }
}