// Import Deno's built-in modules for file system operations
// import { readFileStr } from "https://deno.land/std@0.42.0/fs/mod.ts"
import { buildContributorSentence, cleanup } from "../transform-data/index.ts"

/**
 * Ingestion consists of three big parts:
 * 1. querying dlts-viewer-api for all the books (dlts-viewer-api queries supadu and returns results)
 * 2. transforming data according to the needs of solr6.6
 * 3. POSTing that data to solr document by document to ingest
 */

// Setup Solr Host
const solrHost = 'http://localhost:8983/solr'
// const solrHost = 'http://solr:8983/solr'
// const solrHost = 'http://127.0.0.1:8983/solr'
// const solrHost = 'https://stagediscovery.dlib.nyu.edu/solr'
// v0 schema
// const solrCollection = 'open-square-metadata'
// v1 schema
const solrCollection = 'open-square-metadata-v1'
// Solr Update Handler
const solrUrl = `${solrHost}/${solrCollection}/update/json?commit=true`
// Metadata collection
const metadataCollection = 'nyu-press/'

// 1. call dlts viewer api for all books in supadu by nyu press
const secondaryServiceHost = 'https://stage-sites.dlib.nyu.edu/viewer/api/v1/epubs/' + metadataCollection;
let pubs;
try {
  const response = await fetch(secondaryServiceHost)

  const data = await response.json()
  // console.log("data >>")
  // console.log(data);
  if (response.status !== 200) {
    console.log('failed request, remember to use VPN');
    console.log(data.error.msg)
    console.log()
    throw new Error(`request to ${secondaryServiceHost} failed: ${data.error.msg}`)
  } else {
    console.log('success');
    pubs = data.response.docs;
    console.log("publications", pubs[Object.keys(pubs)[0]]);
  }
} catch(err) {
  console.log("err:", err);
}

// 2. fetch the individual data of each book
// TODO: option 1 fetch all the pubs, process all the pubs, submit all the pubs

// option 2 fetch all the pub indexes, individual fetch, individual processing, individual ingestion
const pubkeys = Object.keys(pubs);
const publications = [];
const failedFetch = [];
try {
  // accumulate all the fetch calls
  // const promises = pubkeys.map(pub => {
  //   console.log('fetch promise for ', pubs[pub].uri);
  //   return fetch(pubs[pub].uri);
  // })
  // TODO: remove, temporary shortcut to only call one item from the dltsviewerapi
  const promises = await fetch(pubs[pubkeys[0]].uri);


  // resolve them all together
  // const responses = Promise.all(promises);
  const responses = await promises.json();
  console.log();
  console.log(responses);
  console.log();
  publications.push(responses)
  // process the results
  // for (const resp of responses) {
  //   if (!resp.ok) {
  //     failedFetch.push(resp)
  //     throw new Error(`HTTP error ${resp.status} for URL: ${resp.url}`)
  //   }
  //   const indivData = await resp.json();
  //   console.log('data fetch success for item');
  //   console.log(indivData);
  //   publications.push(indivData);
  // }
} catch(err){
  console.log(`Error: ${err}`)
}

// 3. modify data so that it's ready for solr
const transformedPublications = publications.map((indivData) => {
  // Problem: solr 6.6 does not use nested objects, contributors is a nested object.
  // Solution: flatten the contributors array of objects before inserting as a string. no need for the field to be multivalued
  const oldContribs = indivData.contributors
  indivData.contributors = JSON.stringify(oldContribs)

  // Problem: solr 6.6 does not use nested objects, revews is a nested object.
  // Solution: flatten the reviews array of objects before inserting as a string
  const oldReviews = indivData.reviews
  indivData.reviews = JSON.stringify(oldReviews);

  // Problem: flat contributors have no highlighting
  // Solution: create the contributor sentence before ingestion, and then search against a string in solr6.6
  indivData.contributorsAsASentence = buildContributorSentence(oldContribs);

  return cleanup(indivData);
})

console.log("--------------------------------")
console.log(transformedPublications);
console.log("--------------------------------")

// 4. POST the whole data set to solr
// TODO: come back with findings: is it better to post the whole thing? or to post one by one?
// try {
//   const headers = new Headers()
//   headers.set('Content-Type', 'application/json')
//   const requestOptions = {
//     method: 'POST',
//     headers: headers,
//     body: JSON.stringify([transformedPublications])
//   }

//   const response = await fetch(solrUrl, requestOptions)
//   const data = await response.json()

//   if (response.status !== 200) {
//     console.log()
//     // console.log(`Source: ${dir}/${isbn}/intake-descriptive.json`)
//     console.log('failed insertion');
//     console.log()
//     console.log(data.error.msg)
//     console.log()
//     // throw new Error(`ISBN13 ${doc.identifier}: ${data.error.msg}`)
//   } else {
//     // console.log(`Document with ISBN13 ${doc.id} posted successfully`);
//     console.log('success');
//   }

// } catch (err) {
//   console.log()
//   console.log(err)
//   console.log('-'.repeat(80))
// }

// old implementation using dlts-epub-metadata
// Read the directory and loop through each file
// const dir = Deno.cwd() + '/../../dlts-epub-metadata/' + metadataCollection;
// const dir = Deno.cwd() + 'metadata/dlts-epub-metadata/' + metadataCollection;
// for await (const dirEntry of  Deno.readDir(dir)) {
// const dirEntry = Deno.readDir(dir).next
  // try {
    // no longer needed since we are using the dlts viewer api now
    // why? epub-metadata has not been updated in years, while deployed data on Viewer API
    // TODO: remove the dlts-epub-metadata from this repository since it's no longer needed

    // const isbn = dirEntry.name
    // // Read the file as a string
    // const jsonStr = await readFileStr(`${dir}/${isbn}/intake-descriptive.json`)
    // // Parse the JSON string into an object
    // const doc = JSON.parse(jsonStr)
  // exit loop on first iteraction to only load 1 item
  // return
// }

