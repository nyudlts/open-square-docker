type Contributor = {
  bio: string | null;
  name: string;
  nameSort: string;
  order: number;
  role: string;
}
/**
 * helper function that takes a flat contributors list
 * and returns it ordered and in an easy way to render as an Array for react to map over.
 * Matching Hugo logic for naming here: https://github.com/NYULibraries/dlts-open-square/commit/601e7987c2440e182c747c294fe8a924341fe923#diff-13693fcffa921ef48b3fadcc2c6983d0820d73e7e989a48d97584e7e4904ccbcR4
 * this array is necessary since multiple contributor types have to exist in separa DOM items, but we don't need to do it with two items
 * NOTE: solr can support multivalued items (array insertion), this might be able to live as an array
 * [ ] JSON.stringify the array ?? is this searchable??
 * [>] or separate each result with a <br> or symbol unicode \u2028
 */
export function buildContributorSentence(contribs : Contributor[]): string[] {
// function sortContributorsIntoRoleBuckets(contribs) {
    // export function unflattenContributors(contribs) {
    // 1. transform contributors from flat string to JSON object
    // let rehydratedContribs = JSON.parse(contribs);

    // 1. sort the contributors by their `.order` key
    // O(n)
    // no more need to sort contributors with Albertos' API
    // rehydratedContribs.sort((a, b) => {
    //     // neg for a before b, positive for b before a, zero or nan a = b
    //     return a.order - b.order; // ascending order
    // });

    // 2. extract unique roles from that ordered list,
    // store contributors into array (bucket) for that role
    const uniqueContributorRoles = new Map();
    // O(n)
    // contribs.forEach((contributor) => {
    contribs.forEach((contributor : Contributor) => {
        // if the role exists add the name to the bucket for that role
        if (uniqueContributorRoles.has(contributor.role)) {
            let newContributorList = uniqueContributorRoles.get(
                contributor.role
            );
            newContributorList.push(contributor);
            uniqueContributorRoles.set(contributor.role, newContributorList);
        } else {
            // if the role does not exist in the map, add it and the contributor
            uniqueContributorRoles.set(contributor.role, [contributor]);
        }
    });

    // 3. loop over contributor roles to build the author string into catcher variable
    // O(n)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach
    uniqueContributorRoles.forEach((contributorArray, role) => {
        // 3.0 declare catcher
        let finalStringByRole = "";

        // 3.1 sort contributors (within their bucket) according to their `.order` property
        // O(n)*O(n) = O(n^2)  careful
        contributorArray.sort((a:Contributor, b:Contributor) => {
            // neg for a before b, positive for b before a, zero or nan a = b
            return a.order - b.order; // ascending order
        });

        // 3.2 handle "author" role exception by using a better word at render
        // other role types are used as-is
        if (role == "By (author)") {
            // finalString += "By ";
            finalStringByRole += "By ";
        } else {
            // finalString += role + " ";
            finalStringByRole += role + " ";
        }

        // 3.3 use the right connector words according to
        let connector = contributorArray.length > 2 ? ", and " : " and ";

        // 3.4 iterate over this group's bucket and create the final contributorString with connectors
        contributorArray.forEach((contrib: Contributor, index:number) => {
            // if we are on the second to last element add the connector
            finalStringByRole += contrib.name;
            if (index == contributorArray.length - 2) {
                // finalString += connector;
                finalStringByRole += connector;
                // insert comma between elements except for last one
            } else if (index != contributorArray.length - 1) {
                // finalString += ", ";
                finalStringByRole += ", ";
            }
        });
        // 3.5 set final contributorRoleString into the map and replace the old contributor array
        uniqueContributorRoles.set(role, finalStringByRole);
    });
    // TODO: this should be a sentence but it's returning an array... what am I missing?
    // TODO: consider that hugo opensquare displays some contributor lines in twho separate items, returning an array might be the best solution
    // return [...uniqueContributorRoles.values()];
    // return uniqueContributorRoles.values();
    // option 1: smash them together with JSON.stringify
    // return JSON.stringify([...uniqueContributorRoles.values()])
    // option 2: joing the array items together with a line separator
    return [...uniqueContributorRoles.values()].join("\u2028");
}
type Review = {
  review: string;
  reviewer: string;
}
type Publication = {
  contributors: string;
  contributorsAsASentence: string;
  dateBook: string;
  dateOpenAccess: string;
  description: string;
  descriptionHtml: string;
  doi: string;
  handle: string;
  hasHiResImages: boolean;
  hasVideo: boolean;
  isbnEbook: string;
  isbnHardcover: string;
  isbnLibrary: string;
  isbnPaperback: boolean | null;
  isDownloadable: boolean;
  language: string;
  license: string;
  licenseAbbreviation: string;
  licenseAbbreviationFacet: string;
  licenseIcon: string;
  licenseLink: string;
  openSquareId: string;
  pages: string;
  pressUrl: string;
  publisher: string;
  reviews: string;
  series: [];
  seriesOpenAccess: [];
  subjects: string[];
  subtitle: string;
  title: string;
  titleSort: string;
  titleGroupId: string;
  yearBook: string;
  yearOpenAccess: string;
  files: {
    pdf: {
      url: string;
      "Content-Type"?: string;
      "Last-Modified"?: string;
      "Content-Length"?: string;
      http_code: number;
    },
    epub: {
      url: string;
      "Content-Type"?: string;
      "Last-Modified"?: string;
      "Content-Length"?: string;
      http_code: number;
    },
    cloudreader: {
      url: string;
      "Content-Type"?: string;
      "Last-Modified"?: string;
      "Content-Length"?: string;
      http_code: number;
    }
  }
}

// function that trims down the objects inserted into solr
export function cleanup(doc : Publication) {
    // doc.collection_code = 'oa-books'
    // doc.handle = doc.identifier
    // doc.publicationPlace = doc.coverage
    // doc.dateBook = doc.date
    // doc.descriptionHtml = doc.description_html
    // doc.pages = doc.format
    // doc.openSquareId = doc.identifier
    // doc.licenseAbbreviation = doc.license_abbreviation
    // doc.licenseIcon = doc.license_icon
    // doc.licenseLink = doc.license_link
    // doc.subjects = doc.subject
    // doc.titleSort = doc.title_sort
    // doc.pressUrl = doc.nyu_press_website_buy_the_book_url
    // required, but sometimes empty
    // doc.series = doc.series_names || "";

    // these dont' work since they are no longer part of the shape returned by supadu -> dltsviewerapi -> here
    // remove the properties that are not in the schema
    // note: deleting leaves the key, but makes the value undefined
    // do we really need to delete when
    // delete doc.author
    // delete doc.author_sort
    // delete doc.cover_href
    // delete doc.coverage
    // delete doc.date
    // delete doc.description_html
    // delete doc.files
    // delete doc.format
    // delete doc.identifier
    // delete doc.isDownloadable
    // // delete doc.licenseAbbreviation
    // delete doc.licenseIcon
    // delete doc.licenseLink
    // delete doc.nyu_press_website_buy_the_book_url
    // delete doc.packageUrl
    // delete doc.permanentUrl
    // delete doc.rights
    // delete doc.rootUrl
    // delete doc.subject
    // delete doc.series_names
    // delete doc.thumbHref
    // delete doc.title_sort

    // destructuring can remove the keys and only leave what is wanted by returning the spread variable
    const {
      dateBook,
      descriptionHtml,
      files,
      handle,
      isDownloadable,
      licenseAbbreviation,
      licenseAbbreviationFacet,
      licenseIcon,
      licenseLink,
      titleSort,
      openSquareId,
      pages,
      pressUrl,
      subjects,
      ...remains
    } = doc;
  return remains;
}


// example data from DLTS Viewer API
const doc = {
  "contributors": [
    {
      "bio": "\u003Cb\u003ESteven H. Jaffe\u003C/b\u003E is a curator at the Museum of the City of New York. He is the author of New York at War: Four Centuries of Combat, Fear, and Intrigue in Gotham (2012) and Who Were the Founding Fathers? Two Hundred Years of Reinventing Ameriacn History (1996). He is the co-author of Envisioning Brooklyn: Family, Philanthropy, and the Growth of an American City (with Rebecca Amato, 2017), and Capital of Capital: Money, Banking, and Power in New York City (with Jessica Lautin, 2014).",
      "name": "Steven H. Jaffe",
      "nameSort": "Jaffe, Steven H.",
      "order": 1,
      "role": "By (author)"
    },
    {
      "bio": "\u003Cb\u003EEric Foner\u003C/b\u003E is the DeWitt Clinton Professor of History at Columbia University. He is the Pulitzer Prize winning author of the New York Times bestseller Gateway to Freedom: The Hidden History of the Underground Railroad (2016).",
      "name": "Eric Foner",
      "nameSort": "Foner, Eric",
      "order": 2,
      "role": "Foreword by"
    }
  ],
  "dateBook": "2018-05-01",
  "dateOpenAccess": "2024-03-29",
  "description": "Follows centuries of New York activism to reveal the city as a globally influential machine for social change  Activist New York surveys New York City’s long history of social activism from the 1650’s to the 2010’s. Bringing these passionate histories alive, Activist New York is a visual exploration  of these movements, serving as a companion book to the highly-praised Museum of the City of New York exhibition of the same name. New York’s primacy as a metropolis of commerce, finance, industry, media, and ethnic diversity has given it a unique and powerfully influential role in the history of American and global activism. Steven H. Jaffe explores how New York’s evolving identities as an incubator and battleground for activists have made it a “machine for change.” In responding to the city as a site of slavery, immigrant entry, labor conflicts, and wealth disparity, New Yorkers have repeatedly challenged the status quo.  Activist New York brings to life the characters who make up these vibrant histories, including David Ruggles, an African American shopkeeper who helped enslaved fugitives on the city’s Underground Railroad during the 1830s; Clara Lemlich, a Ukrainian Jewish immigrant who helped spark the 1909 “Uprising of 20,000” that forever changed labor relations in the city’s booming garment industry; and Craig Rodwell, Karla Jay, and others who forged a Gay Liberation movement both before and after the Stonewall Riot of June 1969. The city’s inhabitants have been at the forefront of social change on issues ranging from religious tolerance and minority civil rights to sexual orientation and economic justice.  Across 16 lavishly illustrated chronological chapters focusing on specific historical episodes, Jaffe explores how New York and New Yorkers have changed the way Americans think, feel, and act.",
  "descriptionHtml": "\u003Cp\u003E\u003Cb\u003EFollows centuries of New York activism to reveal the city as a globally influential machine for social change  \u003Cbr\u003E\u003C/b\u003E\u003Cbr\u003EActivist New York surveys New York City’s long history of social activism from the 1650’s to the 2010’s. Bringing these passionate histories alive, Activist New York is a visual exploration  of these movements, serving as a companion book to the highly-praised Museum of the City of New York exhibition of the same name. \u003Cbr\u003E\u003Cbr\u003ENew York’s primacy as a metropolis of commerce, finance, industry, media, and ethnic diversity has given it a unique and powerfully influential role in the history of American and global activism. Steven H. Jaffe explores how New York’s evolving identities as an incubator and battleground for activists have made it a “machine for change.” In responding to the city as a site of slavery, immigrant entry, labor conflicts, and wealth disparity, New Yorkers have repeatedly challenged the status quo.  \u003Cbr\u003E\u003Cbr\u003EActivist New York brings to life the characters who make up these vibrant histories, including David Ruggles, an African American shopkeeper who helped enslaved fugitives on the city’s Underground Railroad during the 1830s; Clara Lemlich, a Ukrainian Jewish immigrant who helped spark the 1909 “Uprising of 20,000” that forever changed labor relations in the city’s booming garment industry; and Craig Rodwell, Karla Jay, and others who forged a Gay Liberation movement both before and after the Stonewall Riot of June 1969. \u003Cbr\u003E\u003Cbr\u003EThe city’s inhabitants have been at the forefront of social change on issues ranging from religious tolerance and minority civil rights to sexual orientation and economic justice.  Across 16 lavishly illustrated chronological chapters focusing on specific historical episodes, Jaffe explores how New York and New Yorkers have changed the way Americans think, feel, and act.\u003C/p\u003E",
  "doi": "https://doi.org/10.18574/nyu/9781479828654.001.0001",
  "handle": "https://doi.org/10.18574/nyu/9781479828654.001.0001",
  "hasHiResImages": false,
  "hasVideo": false,
  "isbnEbook": null,
  "isbnHardcover": "9781479804603",
  "isbnLibrary": "9781479828654",
  "isbnPaperback": null,
  "isDownloadable": true,
  "language": "eng",
  "license": "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License",
  "licenseAbbreviation": "CC BY-NC-SA",
  "licenseAbbreviationFacet": null,
  "licenseIcon": "https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png",
  "licenseLink": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  "openSquareId": "9781479828654",
  "pages": "304 pages",
  "pressUrl": "https://nyupress.org/9781479804603",
  "publisher": "NYU Press",
  "reviews": [
    {
      "review": "\"Steven H.Jaffe incontrovertibly establishes New York as 'the capital city of social activism' by recounting a litany of provocative flash points, including the Flushing Remonstrance, the Zenger trial, the Stamp Act, slavery, immigration, slums, pay and safety standards for factory workers, womens suffrage, the Red Scare, Prohibition, the Cold War, school integration, civil rights, nuclear disarmament, feminism, gay rights, Occupy Wall Street and racial profiling by law enforcement.\"",
      "reviewer": "The New York Times"
    }
  ],
  "series": [],
  "seriesOpenAccess": [],
  "subjects": [
    "History",
    "New York City & Regional Interest"
  ],
  "subtitle": "A History of People, Protest, and Politics",
  "title": "Activist New York",
  "titleSort": "Activist New York",
  "titleGroupId": "9781479804603",
  "yearBook": "2018",
  "yearOpenAccess": "2024",
  "files": {
    "pdf": {
      "url": "https://mc.dlib.nyu.edu/files/nyupress/pdfs/9781479828654.pdf",
      "Content-Type": "application/pdf",
      "Last-Modified": "Fri, 13 Sep 2024 13:02:41 GMT",
      "Content-Length": "548957422",
      "http_code": 200
    },
    "epub": {
      "url": "https://mc.dlib.nyu.edu/files/nyupress/epubs/9781479828654.epub",
      "Content-Type": "text/html; charset=iso-8859-1",
      "Content-Length": "196",
      "http_code": 404
      },
      "cloudreader": {
        "url": "https://opensquare-stage.nyupress.org/open-square-reader/cloud-reader/?epub=epub_content/9781479828654&embedded=true",
        "http_code": 404
      }
  }
}
  // example using a single item manually inserted
  const contributors = [
      {
        "bio": "\u003Cb\u003ESteven H. Jaffe\u003C/b\u003E is a curator at the Museum of the City of New York. He is the author of New York at War: Four Centuries of Combat, Fear, and Intrigue in Gotham (2012) and Who Were the Founding Fathers? Two Hundred Years of Reinventing Ameriacn History (1996). He is the co-author of Envisioning Brooklyn: Family, Philanthropy, and the Growth of an American City (with Rebecca Amato, 2017), and Capital of Capital: Money, Banking, and Power in New York City (with Jessica Lautin, 2014).",
        "name": "Steven H. Jaffe",
        "nameSort": "Jaffe, Steven H.",
        "order": 1,
        "role": "By (author)"
      },
      {
        "bio": "\u003Cb\u003EEric Foner\u003C/b\u003E is the DeWitt Clinton Professor of History at Columbia University. He is the Pulitzer Prize winning author of the New York Times bestseller Gateway to Freedom: The Hidden History of the Underground Railroad (2016).",
        "name": "Eric Foner",
        "nameSort": "Foner, Eric",
        "order": 2,
        "role": "Foreword by"
      }
    ]
  const stringifiedContribs = JSON.stringify(contributors)

    const reviews = [
      {
        "review": "\"Steven H.Jaffe incontrovertibly establishes New York as 'the capital city of social activism' by recounting a litany of provocative flash points, including the Flushing Remonstrance, the Zenger trial, the Stamp Act, slavery, immigration, slums, pay and safety standards for factory workers, womens suffrage, the Red Scare, Prohibition, the Cold War, school integration, civil rights, nuclear disarmament, feminism, gay rights, Occupy Wall Street and racial profiling by law enforcement.\"",
        "reviewer": "The New York Times"
      }
    ]
    const flatReviews = JSON.stringify(reviews);

  const obj =    {
    "contributors": stringifiedContribs,
    "contributorsInOrder": ["Steven H. Jaffe", "Eric Foner"],
    "contributorsAsASentence": "By Steven H. Jaffe, and Eric Foner", // sentence hardcoded example
    // "contributorsAsASentence": buildContributorSentence(stringifiedContribs),
    "dateBook": "2018-05-01",
    "dateOpenAccess": "2026-05-03",
    "description": "Follows centuries of New York activism to reveal the city as a globally influential machine for social change  Activist New York surveys New York City’s long history of social activism from the 1650’s to the 2010’s. Bringing these passionate histories alive, Activist New York is a visual exploration  of these movements, serving as a companion book to the highly-praised Museum of the City of New York exhibition of the same name. New York’s primacy as a metropolis of commerce, finance, industry, media, and ethnic diversity has given it a unique and powerfully influential role in the history of American and global activism. Steven H. Jaffe explores how New York’s evolving identities as an incubator and battleground for activists have made it a “machine for change.” In responding to the city as a site of slavery, immigrant entry, labor conflicts, and wealth disparity, New Yorkers have repeatedly challenged the status quo.  Activist New York brings to life the characters who make up these vibrant histories, including David Ruggles, an African American shopkeeper who helped enslaved fugitives on the city’s Underground Railroad during the 1830s; Clara Lemlich, a Ukrainian Jewish immigrant who helped spark the 1909 “Uprising of 20,000” that forever changed labor relations in the city’s booming garment industry; and Craig Rodwell, Karla Jay, and others who forged a Gay Liberation movement both before and after the Stonewall Riot of June 1969. The city’s inhabitants have been at the forefront of social change on issues ranging from religious tolerance and minority civil rights to sexual orientation and economic justice.  Across 16 lavishly illustrated chronological chapters focusing on specific historical episodes, Jaffe explores how New York and New Yorkers have changed the way Americans think, feel, and act.",
    "descriptionHtml": "\u003Cp\u003E\u003Cb\u003EFollows centuries of New York activism to reveal the city as a globally influential machine for social change  \u003Cbr\u003E\u003C/b\u003E\u003Cbr\u003EActivist New York surveys New York City’s long history of social activism from the 1650’s to the 2010’s. Bringing these passionate histories alive, Activist New York is a visual exploration  of these movements, serving as a companion book to the highly-praised Museum of the City of New York exhibition of the same name. \u003Cbr\u003E\u003Cbr\u003ENew York’s primacy as a metropolis of commerce, finance, industry, media, and ethnic diversity has given it a unique and powerfully influential role in the history of American and global activism. Steven H. Jaffe explores how New York’s evolving identities as an incubator and battleground for activists have made it a “machine for change.” In responding to the city as a site of slavery, immigrant entry, labor conflicts, and wealth disparity, New Yorkers have repeatedly challenged the status quo.  \u003Cbr\u003E\u003Cbr\u003EActivist New York brings to life the characters who make up these vibrant histories, including David Ruggles, an African American shopkeeper who helped enslaved fugitives on the city’s Underground Railroad during the 1830s; Clara Lemlich, a Ukrainian Jewish immigrant who helped spark the 1909 “Uprising of 20,000” that forever changed labor relations in the city’s booming garment industry; and Craig Rodwell, Karla Jay, and others who forged a Gay Liberation movement both before and after the Stonewall Riot of June 1969. \u003Cbr\u003E\u003Cbr\u003EThe city’s inhabitants have been at the forefront of social change on issues ranging from religious tolerance and minority civil rights to sexual orientation and economic justice.  Across 16 lavishly illustrated chronological chapters focusing on specific historical episodes, Jaffe explores how New York and New Yorkers have changed the way Americans think, feel, and act.\u003C/p\u003E",
    "doi": "https://doi.org/10.18574/nyu/9781479828654.001.0001",
    "handle": "https://doi.org/10.18574/nyu/9781479828654.001.0001",
    "hasHiResImages": false,
    "hasVideo": false,
    "id": "9781479804603",
    "isbnEbook": null,
    "isbnHardcover": "9781479804603",
    "isbnLibrary": "9781479828654",
    "isbnPaperback": null,
    "isDownloadable": true,
    "language": "eng",
    "license": "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License",
    "licenseAbbreviation": "CC BY-NC-SA",
    "licenseAbbreviationFacet": null,
    "licenseIcon": "https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png",
    "licenseLink": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    "openSquareId": "9781479828654",
    "pages": "304 pages",
    "pressUrl": "https://nyupress.org/9781479804603",
    "publisher": "NYU Press",
    "reviews": flatReviews,
    "series": [],
    "seriesOpenAccess": [],
    "subjects": [
      "History"
    ],
    "subtitle": "A History of People, Protest, and Politics",
    "title": "Activist New York",
    "titleSort": "Activist New York",
    "titleGroupId": "9781479804603",
    "yearBook": "2018",
    "yearOpenAccess": "2026"
  }

