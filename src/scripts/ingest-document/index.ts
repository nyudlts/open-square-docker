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
const dir = Deno.cwd() + '/../../dlts-epub-metadata/' + metadataCollection;

// Read the directory and loop through each file
for await (const dirEntry of  Deno.readDir(dir)) {
  try {
    const isbn = dirEntry.name
    // Read the file as a string
    const jsonStr = await readFileStr(`${dir}/${isbn}/intake-descriptive.json`)
    // Parse the JSON string into an object
    const doc = JSON.parse(jsonStr)

    const authors: string[] = doc.author.split(', ')
    console.log(authors)

    // create the full author object, unordered
    const oa = [];
    for (let i = 0; i < authors.length; i++) {
      oa.push({
        "contributors.bio": "",
        "contributors.name": authors[i],
        "contributors.nameSort": authors[i],
        "contributors.order": i + 1,
        "contributors.role": "author",
      })
    }
    const final = JSON.stringify(oa)

    const flatReviews = JSON.stringify([
      {
        "reviews.review": "",
        "reviews.reviewer": "",
      }
    ])

    // add the properties missing in the schema from Supadu
    doc.id = doc.identifier
    doc.contributors = final;
    doc.collection_code = 'oa-books'
    doc.handle = doc.identifier
    doc.publicationPlace = doc.coverage
    doc.dateBook = doc.date
    doc.descriptionHtml = doc.description_html
    doc.pages = doc.format
    doc.openSquareId = doc.identifier
    doc.licenseAbbreviation = doc.license_abbreviation
    doc.licenseIcon = doc.license_icon
    doc.licenseLink = doc.license_link
    doc.subjects = doc.subject
    doc.titleSort = doc.title_sort
    doc.pressUrl = doc.nyu_press_website_buy_the_book_url
    doc.reviews = flatReviews
    // required, but sometimes empty
    doc.series = doc.series_names | "";

    // remove the properties that are not in the schema
    delete doc.author
    delete doc.author_sort
    delete doc.coverHref
    delete doc.coverage
    delete doc.date
    delete doc.description_html
    delete doc.format
    delete doc.identifier
    delete doc.isDownloadable
    delete doc.license_abbreviation
    delete doc.license_icon
    delete doc.license_link
    delete doc.nyu_press_website_buy_the_book_url
    delete doc.packageUrl
    delete doc.permanent_url
    delete doc.rights
    delete doc.rootUrl
    delete doc.subject
    delete doc.series_names
    delete doc.thumbHref
    delete doc.title_sort

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
