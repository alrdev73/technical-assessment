/**
 * Utility function that performs async GET requests given an endpoint and returns the data as json
 * to the caller.
 */
export async function doGet(endpoint: string) {
    return await fetch(endpoint)
        .then((res) => {
            console.log(res)
            return res.json()
        })
}