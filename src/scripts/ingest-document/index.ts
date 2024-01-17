// Import Deno's built-in modules for file system operations
import { readFileStr } from "https://deno.land/std@0.42.0/fs/mod.ts"

// Solr Host
const solrHost = 'http://localhost:8983/solr'
// Solr Collection
const solrCollection = 'open-square-metadata'
// Solr Update Handler
const solrUrl = `${solrHost}/${solrCollection}/update/json?commit=true`
// Metadata collection
const metadataCollection = 'nyupress'
// Define the directory containing the JSON files
const dir = Deno.cwd() + '/../../dlts-epub-metadata/' + metadataCollection

// Read the directory
for await (const dirEntry of  Deno.readDir(dir)) {
  try {
    const isbn = dirEntry.name
    // Read the file as a string
    const jsonStr = await readFileStr(`${dir}/${isbn}/intake-descriptive.json`)
    // Parse the JSON string into an object
    const doc = JSON.parse(jsonStr)

    delete doc.isDownloadable
    delete doc.nyu_press_website_buy_the_book_url
    delete doc.permanent_url
    delete doc.rootUrl

    doc.id = doc.identifier
    doc.collection_code = 'oa-books'
    doc.handle = doc.identifier

    // Define the headers for the POST request
    const headers = new Headers()

    headers.set('Content-Type', 'application/json')

    // Define the options for the fetch request
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify([doc])
    }

    // Send the POST request
    const response = await fetch(solrUrl, requestOptions)

    const data = await response.json()

    if (response.status !== 200) {
      console.log()
      console.log(`Source: ${dir}/${isbn}/intake-descriptive.json`)
      console.log()
      console.log(doc)
      console.log()
      throw new Error(`ISBN13 ${doc.identifier}: ${data.error.msg}`)
    } else {
      console.log(`Document with ISBN13 ${doc.id} posted successfully`);
    }

  } catch (err) {
    console.log()
    console.log(err)
    console.log('-'.repeat(80))
  }

}



