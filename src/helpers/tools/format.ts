/**
 * Get path from URL
 * 
 * @param {string} url 
 */
export function getPathFromURL(url: string): string {
    let endIndex: number = url.indexOf("?");

    if(endIndex < 0) return url;

    return url.substr(0, endIndex);
}

/**
 * Get query from URL
 * 
 * @param {string} url 
 */
export function getQueryFromURL(url: string): Object {

    let result: any = {};
    let startIndex: number | undefined = url.indexOf("?");

    if(startIndex && startIndex > 0) {
        url = url.substr(++startIndex, url.length);
        
        let queries: any[] = url.split("&");

        for(let query of queries) {
            query = query.split("=");
            if(query.length !== 2) continue;

            result[query[0] as string] = isNaN(query[1]) ? query[1] : Number(query[1]);
        }

        return result;
    }

    return result;
}