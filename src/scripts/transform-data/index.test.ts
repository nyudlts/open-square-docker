import { assertEquals, assertDeepStrictEqual, assert } from "jsr:@std/assert"
import { buildContributorSentence } from "./index.ts"

Deno.test("single type of contributor", () => {
  const exampleContributors = [
    {
      bio: "<b>Michaël Roy </b>is Associate Professor of American studies at Université Paris Nanterre and a Fellow of the Institut Universitaire de France. He is the author of <i>Fugitive Texts: Slave Narratives in Antebellum Print Culture,</i> and the editor of <i>Frederick Douglass in Context</i> and <i>Escapes from Cayenne: A Story of Socialism and Slavery in an Age of Revolution and Reaction</i>.<b><i></i></b>",
      name: "Michaël Roy",
      nameSort: "Roy, Michaël",
      order: 1,
      role: "By (author)"
    }
  ]
  const resultingContributors = buildContributorSentence(exampleContributors);
  assertEquals(resultingContributors, "By Michaël Roy");
});

Deno.test("single type contributor, multiple contributors", () => {
  const exampleContributors = [
  {
    "bio": "\u003Cb\u003EShari L. Dworkin\u003C/b\u003E is Professor in the Department of Social and Behavioral Sciences and Associate Dean for Academic Affairs at the University of California, San Francisco School of Nursing. She is the author or editor of several books, most recently Body Panic: Gender, Health, and the Selling of Fitness and Men at Risk, both with NYU Press.",
    "name": "Shari L. Dworkin",
    "nameSort": "Dworkin, Shari L.",
    "order": 1,
    "role": "By (author)"
  },
  {
    "bio": "\u003Cb\u003EFaye Linda Wachs\u003C/b\u003E is an Associate Professor of Sociology in the Department of Psychology and Sociology at California State Polytechnic University, Pomona (Cal Poly Pomona).",
    "name": "Faye Linda Wachs",
    "nameSort": "Wachs, Faye Linda",
    "order": 2,
    "role": "By (author)"
  }
  ]
  const resultingContributors = buildContributorSentence(exampleContributors);
  // TODO: check for oxford comma, do we want it?
  assertEquals(resultingContributors,"By Shari L. Dworkin and Faye Linda Wachs");
});

Deno.test("single type of contributor `Edited by`", () => {
  // https://stage-sites.dlib.nyu.edu/viewer/api/v1/epubs/nyu-press/9780814708903
  const exampleContributors = [
    {
      "bio": "\u003Cb\u003EWerner Sollors\u003C/b\u003E is Henry B. and Anne M. Cabot Professor , Emeritus, of English Literature and Professor of Afro-American Studies. He is the author and editor of numerous books, including \u003Ci\u003EThe Multilingual Anthology of American Literature\u003C/i\u003E, \u003Ci\u003ETheories of Ethnicity: A Classical Reader\u003C/i\u003E, and \u003Ci\u003EMultilingual America: Transnationalism, Ethnicity, and the Languages of American Literature\u003C/i\u003E, all available from NYU Press.",
      "name": "Werner Sollors",
      "nameSort": "Sollors, Werner",
      "order": 1,
      "role": "Edited by"
    },
    {
      "bio": "\u003Cb\u003ECaldwell Titcomb\u003C/b\u003E was Professor Emeritus of Music at Brandeis University and wrote widely on aspects of black culture.",
      "name": "Caldwell Titcomb",
      "nameSort": "Titcomb, Caldwell",
      "order": 2,
      "role": "Edited by"
    },
    {
      "bio": "\u003Cb\u003EThomas Underwood\u003C/b\u003E is Senior Lecturer (Master Level) at Boston University, and the author of \u003Ci\u003EAllen Tate: Orphan of the South\u003C/i\u003E and coeditor of \u003Ci\u003EThe Southern Agrarians and the New Deal: Essays after I’ll Take My Stand\u003C/i\u003E",
      "name": "Thomas A. Underwood",
      "nameSort": "Underwood, Thomas A.",
      "order": 3,
      "role": "Edited by"
    },
    {
      "bio": "\u003Cb\u003ERandall Kennedy \u003C/b\u003Eis Michael R. Klein Professor of law at Harvard Law School. He is author of several books and scholarly articles, including \u003Ci\u003EFor Discrimination: Race, Affirmative Action, and the Law\u003C/i\u003E (Vintage Books, 2013); \u003Ci\u003EThe Persistence of the Color Line: Racial Politics and the Obama Presidency\u003C/i\u003E (Vintage Books, 2011); and \u003Ci\u003ERace, Crime, and the Law \u003C/i\u003E(Vintage Books, 1998), which won the 1998 Robert F. Kennedy Book Award.",
      "name": "Randall Kennedy",
      "nameSort": "Kennedy, Randall",
      "order": 4,
      "role": "Edited by"
    },
    {
      "bio": "\u003Cb\u003ERandall Kennedy \u003C/b\u003Eis Michael R. Klein Professor of law at Harvard Law School. He is author of several books and scholarly articles, including \u003Ci\u003EFor Discrimination: Race, Affirmative Action, and the Law\u003C/i\u003E (Vintage Books, 2013); \u003Ci\u003EThe Persistence of the Color Line: Racial Politics and the Obama Presidency\u003C/i\u003E (Vintage Books, 2011); and \u003Ci\u003ERace, Crime, and the Law \u003C/i\u003E(Vintage Books, 1998), which won the 1998 Robert F. Kennedy Book Award.",
      "name": "Randall Kennedy",
      "nameSort": "Kennedy, Randall",
      "order": 5,
      "role": "Edited by"
    }
  ]

  const resultingContributors = buildContributorSentence(exampleContributors);
  // noting that editedby has oxford comma
  assertEquals(resultingContributors, "Edited by Werner Sollors, Caldwell Titcomb, Thomas A. Underwood, Randall Kennedy, and Randall Kennedy");
});

Deno.test("by + with ", () => {
  // https://stage-sites.dlib.nyu.edu/viewer/api/v1/epubs/nyu-press/9780814739105
  const exampleContributors =
  [
    {
      "bio": "\u003Cb\u003EDouglas Biklen\u003C/b\u003E is Professor of Cultural Foundations of Education, Teaching, and Leadership; and coordinates the Inclusive Education Program at Syracuse University. He is a senior faculty member in the Center on Disability Studies, Law and Human Policy. He is the author of Access to Academics and Contested Words, Contested Science. He was Educational Advisor for the Academy–Award–winning HBO documentary Educating Peter and is coproducer of the CNN documentary Autism is a World.",
      "name": "Douglas Biklen",
      "nameSort": "Biklen, Douglas",
      "order": 1,
      "role": "By (author)"
    },
    {
      "bio": null,
      "name": "Richard Attfield",
      "nameSort": "Attfield, Richard",
      "order": 2,
      "role": "With"
    },
    {
      "bio": null,
      "name": "Larry Bissonnette",
      "nameSort": "Bissonnette, Larry",
      "order": 3,
      "role": "With"
    },
    {
      "bio": null,
      "name": "Lucy Blackman",
      "nameSort": "Blackman, Lucy",
      "order": 4,
      "role": "With"
    },
    {
      "bio": "Jamie Burke lives in Syracuse, New York, where he attends high school. He was the subject of a research report published in 2001 and has written and narrated a video documentary, Inside the Edge, about how, as a teenager, he emerged from typing to speaking.",
      "name": "Jamie Burke",
      "nameSort": "Burke, Jamie",
      "order": 5,
      "role": "With"
    },
    {
      "bio": "Alberto Frugone lives with his mother and stepfather in Zoagli, Italy, on the coast of the Mediterranean. After attending inclusive secondary school, he recently passed Italy’s postsecondary qualifying exams and became the first nonspeaking Italian classified as autistic to attend a university.",
      "name": "Alberto Frugone",
      "nameSort": "Frugone, Alberto",
      "order": 6,
      "role": "With"
    },
    {
      "bio": "Tito Rajarshi Mukhopadhyay was born in India and learned to speak and write after much intense support from his mother, from a speech therapist, and from others. By the age of eleven, he had written a book, Beyond the Silence, and was the subject of a BBC documentary.",
      "name": "Tito Rajarshi Mukhopadhyay",
      "nameSort": "Mukhopadhyay, Tito Rajarshi",
      "order": 7,
      "role": "With"
    },
    {
      "bio": "\u003Cp\u003ESue Rubin grew up in southern California and is now a college student. Until the age of thirteen, she was diagnosed as both autistic and severely\u003Cbr\u003Eretarded and was thought incapable of academic work. She is featured in and was the writer for an autobiographical documentary titled Autism Is\u003Cbr\u003Ea World on CNN Presents.\u003C/p\u003E",
      "name": "Sue Rubin",
      "nameSort": "Rubin, Sue",
      "order": 8,
      "role": "With"
    }
  ]

  const resultingContributors = buildContributorSentence(exampleContributors);
  // noting that editedby has oxford comma
  // assertEquals(resultingContributors, ["By Douglas Biklen","With Richard Attfield, Larry Bissonnette, Lucy Blackman, Jamie Burke, Alberto Frugone, Tito Rajarshi Mukhopadhyay, and Sue Rubin"]);
  // assertEquals(resultingContributors, JSON.stringify(["By Douglas Biklen","With Richard Attfield, Larry Bissonnette, Lucy Blackman, Jamie Burke, Alberto Frugone, Tito Rajarshi Mukhopadhyay, and Sue Rubin"]));
  assertEquals(resultingContributors, "By Douglas Biklen\u2028With Richard Attfield, Larry Bissonnette, Lucy Blackman, Jamie Burke, Alberto Frugone, Tito Rajarshi Mukhopadhyay, and Sue Rubin");
  // assertEquals(resultingContributors, ["By Douglas Biklen","With Richard Attfield, Larry Bissonnette, Lucy Blackman, Jamie Burke, Alberto Frugone, Tito Rajarshi Mukhopadhyay, and Sue Rubin"]);
});



Deno.test("Edited by + Foreword by", () => {
  // https://stage-sites.dlib.nyu.edu/viewer/api/v1/epubs/nyu-press/9780814708903
  const exampleContributors =
  [
    {
      "bio": "\u003Cb\u003EDavid Silver\u003C/b\u003E is an assistant professor of media studies at the University of San Francisco.",
      "name": "David Silver",
      "nameSort": "Silver, David",
      "order": 1,
      "role": "Edited by"
    },
    {
      "bio": "\u003Cb\u003EAdrienne Massanari\u003C/b\u003E is a Ph.D. candidate in communication at the University of Washington.",
      "name": "Adrienne Massanari",
      "nameSort": "Massanari, Adrienne",
      "order": 2,
      "role": "Edited by"
    },
    {
      "bio": null,
      "name": "Steve Jones",
      "nameSort": "Jones, Steve",
      "order": 3,
      "role": "Foreword by"
    }
  ]

  const resultingContributors = buildContributorSentence(exampleContributors);
  assertEquals(resultingContributors, "Edited by David Silver and Adrienne Massanari\u2028Foreword by Steve Jones");
});


Deno.test.only("cleanup", () => {

  // example of object that has
  // - contributors flattened
  // - reviews flattened
  // - contributorsAsASentence created
  const flatContribs = JSON.stringify([
    {
      bio: "<b>Michaël Roy </b>is Associate Professor of American studies at Université Paris Nanterre and a Fellow of the Institut Universitaire de France. He is the author of <i>Fugitive Texts: Slave Narratives in Antebellum Print Culture,</i> and the editor of <i>Frederick Douglass in Context</i> and <i>Escapes from Cayenne: A Story of Socialism and Slavery in an Age of Revolution and Reaction</i>.<b><i></i></b>",
      name: "Michaël Roy",
      nameSort: "Roy, Michaël",
      order: 1,
      role: "By (author)"
    }
  ]);
  const flatReviews = JSON.stringify([
    {
      review: '"A concise yet wide-ranging historical study that could not be timelier…Roy’s well-researched contribution to antislavery scholarship is so accessible that it also serves as a primer for the history of childhood and the history of reform in the antebellum northern US. Clear prose and apt illustrations will prompt specialists and general readers alike to see the abolitionist movement with fresh eyes."',
      reviewer: "David N. Gellman, author of Liberty’s Chain: Slavery, Abolition, and the Jay Family of New York"
    },
    {
      review: `"In this concise, well-researched, and engaging study, Michaël Roy provides a definitive history of juvenile abolitionism. He explains why adult antislavery activists reached out to young people and documents the large number of Black and white children who joined juvenile antislavery societies, signed petitions, read abolitionist literature and tried to convert adults to the cause. In the process, these young activists ignited a debate over the political competence of minors that continues to resonate in today's youth movements for climate and racial justice. This is essential reading for those interested in the history of childhood and the history of social reform."`,
      reviewer: "Corinne Field, author of The Struggle for Equal Adulthood: Gender, Race, Age and the Fight for Citizenship in Antebellum America"
    },
  ]);

  const sourceData = {
    contributors: flatContribs,
    contributorsAsASentence: "",
    dateBook: "2024-07-02",
    dateOpenAccess: "2025-07-08",
    description: "How children helped abolish slaveryDuring the antebellum period, several abolitionist figures, including William Lloyd Garrison, the editor of the Liberator; Susan Paul, an African American primary school teacher; Henry Clarke Wright, a white reformer; and Frederick Douglass, the internationally renowned activist, consistently appealed to the sympathies of children against slavery. In 1835, Garrison proclaimed, “If . . . we desire to see our land delivered from the curse of PREJUDICE and SLAVERY, we must direct our efforts chiefly to the rising generation.” This rallying cry found a receptive audience and ignited action.Despite their limited scholarly exploration, children occupied a crucial position within the US abolition movement. Through a reexamination of archival materials including antislavery newspapers, correspondence, and autobiographies, Young Abolitionists is the first book to center children’s participation in the campaign to eradicate slavery in the United States.Michaël Roy uncovers how young advocates—Black and white alike—confidently delivered antislavery speeches within their schools, enrolled in juvenile antislavery societies, and contributed to the editorial process of antislavery newspapers. They aided fugitive slaves, attended antislavery fairs, and engaged in activities commemorating John Brown’s legacy. They even affixed their signatures to antislavery petitions, thus challenging the boundaries of their own citizenship.Abolitionists saw childhood as a force for social change. With the help of parents and teachers, children acted in concrete ways against slavery and made a meaningful contribution toward its demise. Young Abolitionists honors their contributions and reminds us that children can—and must—be included in the fight for a better world.",
    descriptionHtml: "<p><b>How children helped abolish slavery</b><br><br>During the antebellum period, several abolitionist figures, including William Lloyd Garrison, the editor of the Liberator; Susan Paul, an African American primary school teacher; Henry Clarke Wright, a white reformer; and Frederick Douglass, the internationally renowned activist, consistently appealed to the sympathies of children against slavery. In 1835, Garrison proclaimed, “If . . . we desire to see our land delivered from the curse of PREJUDICE and SLAVERY, we must direct our efforts chiefly to the rising generation.” This rallying cry found a receptive audience and ignited action.<br><br>Despite their limited scholarly exploration, children occupied a crucial position within the US abolition movement. Through a reexamination of archival materials including antislavery newspapers, correspondence, and autobiographies, <i>Young Abolitionists</i> is the first book to center children’s participation in the campaign to eradicate slavery in the United States.<br><br>Michaël Roy uncovers how young advocates—Black and white alike—confidently delivered antislavery speeches within their schools, enrolled in juvenile antislavery societies, and contributed to the editorial process of antislavery newspapers. They aided fugitive slaves, attended antislavery fairs, and engaged in activities commemorating John Brown’s legacy. They even affixed their signatures to antislavery petitions, thus challenging the boundaries of their own citizenship.<br><br>Abolitionists saw childhood as a force for social change. With the help of parents and teachers, children acted in concrete ways against slavery and made a meaningful contribution toward its demise. <i>Young Abolitionists </i>honors their contributions and reminds us that children can—and must—be included in the fight for a better world.</p>",
    doi: "https://doi.org/10.18574/nyu/9781479830121.001.0001",
    handle: "https://doi.org/10.18574/nyu/9781479830121.001.0001",
    hasHiResImages: false,
    hasVideo: false,
    isbnEbook: "9781479830107",
    isbnHardcover: "9781479830091",
    isbnLibrary: "9781479830121",
    isbnPaperback: null,
    isDownloadable: true,
    language: "eng",
    license: "Creative Commons Attribution-NonCommercial 4.0 International License",
    licenseAbbreviation: "CC BY-NC",
    licenseAbbreviationFacet: null,
    licenseIcon: "https://i.creativecommons.org/l/by-nc/4.0/80x15.png",
    licenseLink: "https://creativecommons.org/licenses/by-nc/4.0/",
    openSquareId: "9781479830121",
    pages: "264 pages",
    pressUrl: "https://nyupress.org/9781479830091",
    publisher: "NYU Press",
    reviews: flatReviews,
    series: [],
    seriesOpenAccess: [],
    subjects: [ "American Studies", "History" ],
    subtitle: "Children of the Antislavery Movement",
    title: "Young Abolitionists",
    titleSort: "Young Abolitionists",
    titleGroupId: "9781479830091",
    yearBook: "2024",
    yearOpenAccess: "2025",
    files: {
      pdf: {
        url: "https://mc.dlib.nyu.edu/files/nyupress/pdfs/9781479830121.pdf",
        "Content-Type": "application/pdf",
        "Last-Modified": "Fri, 05 Sep 2025 15:37:20 GMT",
        "Content-Length": "52734490",
        http_code: 200
      },
      epub: {
        url: "https://mc.dlib.nyu.edu/files/nyupress/epubs/9781479830121.epub",
        "Content-Type": "application/epub+zip",
        "Last-Modified": "Fri, 05 Sep 2025 15:37:17 GMT",
        "Content-Length": "2412598",
        http_code: 200
      },
      cloudreader: {
        url: "https://opensquare-stage.nyupress.org/open-square-reader/cloud-reader/?epub=epub_content/9781479830121&embedded=true",
        http_code: 200
      }
    }
  }

  const resultExampleData = {
    contributors: '[{"bio":"<b>Michaël Roy </b>is Associate Professor of American studies at Université Paris Nanterre and a Fellow of the Institut Universitaire de France. He is the author of <i>Fugitive Texts: Slave Narratives in Antebellum Print Culture,</i> and the editor of <i>Frederick Douglass in Context</i> and <i>Escapes from Cayenne: A Story of Socialism and Slavery in an Age of Revolution and Reaction</i>.<b><i></i></b>","name":"Michaël Roy","nameSort":"Roy, Michaël","order":1,"role":"By (author)"}]',
    contributorsAsASentence: "By Michaël Roy",
    dateOpenAccess: "2025-07-08",
    description: "How children helped abolish slaveryDuring the antebellum period, several abolitionist figures, including William Lloyd Garrison, the editor of the Liberator; Susan Paul, an African American primary school teacher; Henry Clarke Wright, a white reformer; and Frederick Douglass, the internationally renowned activist, consistently appealed to the sympathies of children against slavery. In 1835, Garrison proclaimed, “If . . . we desire to see our land delivered from the curse of PREJUDICE and SLAVERY, we must direct our efforts chiefly to the rising generation.” This rallying cry found a receptive audience and ignited action.Despite their limited scholarly exploration, children occupied a crucial position within the US abolition movement. Through a reexamination of archival materials including antislavery newspapers, correspondence, and autobiographies, Young Abolitionists is the first book to center children’s participation in the campaign to eradicate slavery in the United States.Michaël Roy uncovers how young advocates—Black and white alike—confidently delivered antislavery speeches within their schools, enrolled in juvenile antislavery societies, and contributed to the editorial process of antislavery newspapers. They aided fugitive slaves, attended antislavery fairs, and engaged in activities commemorating John Brown’s legacy. They even affixed their signatures to antislavery petitions, thus challenging the boundaries of their own citizenship.Abolitionists saw childhood as a force for social change. With the help of parents and teachers, children acted in concrete ways against slavery and made a meaningful contribution toward its demise. Young Abolitionists honors their contributions and reminds us that children can—and must—be included in the fight for a better world.",
    doi: "https://doi.org/10.18574/nyu/9781479830121.001.0001",
    hasHiResImages: false,
    hasVideo: false,
    isbnEbook: "9781479830107",
    isbnHardcover: "9781479830091",
    isbnLibrary: "9781479830121",
    isbnPaperback: null,
    language: "eng",
    license: "Creative Commons Attribution-NonCommercial 4.0 International License",
    licenseAbbreviationFacet: null,
    publisher: "NYU Press",
    reviews: `[{"review":"\\"A concise yet wide-ranging historical study that could not be timelier…Roy’s well-researched contribution to antislavery scholarship is so accessible that it also serves as a primer for the history of childhood and the history of reform in the antebellum northern US. Clear prose and apt illustrations will prompt specialists and general readers alike to see the abolitionist movement with fresh eyes.\\"","reviewer":"David N. Gellman, author of Liberty’s Chain: Slavery, Abolition, and the Jay Family of New York"},{"review":"\\"In this concise, well-researched, and engaging study, Michaël Roy provides a definitive history of juvenile abolitionism. He explains why adult antislavery activists reached out to young people and documents the large number of Black and white children who joined juvenile antislavery societies, signed petitions, read abolitionist literature and tried to convert adults to the cause. In the process, these young activists ignited a debate over the political competence of minors that continues to resonate in today's youth movements for climate and racial justice. This is essential reading for those interested in the history of childhood and the history of social reform.\\"","reviewer":"Corinne Field, author of The Struggle for Equal Adulthood: Gender, Race, Age and the Fight for Citizenship in Antebellum America"},{"review":"\\"An exciting and compelling scholarly intervention, one that reframes our understanding of the abolitionist movement in the United States...Roy demonstrates that children were not simply passive recipients of antislavery dogma. Rather, they were young people with deeply considered political points of view who actively shaped the culture of the American abolitionist movement.\\"","reviewer":"Erica L. Ball, author of To Live an Antislavery Life: Personal Politics and the Antebellum Black Middle Class"},{"review":"\\"Impeccably researched, <i>Young Abolitionists</i> is essential reading for anyone studying the antislavery movement. In addition to chronicling what adults thought about children's capacities,  Roy reveals how both Black and White children imagined their own moral agency, and how they helped to both generate and propagate antislavery ideas,  through their work as readers, contributors, editors, and organizers. In short, this book expands the intellectual history of antislavery ideas in the transatlantic world.\\"","reviewer":"Anna Mae Duane, Educated for Freedom: The Incredible Story of Two Fugitive Schoolboys who Grew Up to Change a Nation"},{"review":"\\"<i>Young Abolitionists</i> succeeds in highlighting a dramatically understudied facet of both the history of childhood and the history of reform and abolitionism.\\"","reviewer":"The Civil War Monitor"},{"review":"\\"[A] thoughtful, deeply researched book.\\"","reviewer":"CHOICE Journal"},{"review":"\\"Young Abolitionists: Children of the Antislavery Movement makes a most welcome addition to the historiography of abolitionism.\\"","reviewer":"Emerging Civil War"},{"review":"\\"An important read for those interested in the history of children and in the history of abolitionism in the United States... <i>Young Abolitionists</i> is a powerful addition to our understanding of this history.\\"","reviewer":"American Historical Review"},{"review":"\\"<i>Young Abolitionists</i> stands out as one of the best works on antislavery activism in recent years, not only for its original interpretations of well-known literary sources, but also for its use of underutilized archival materials\\"","reviewer":"American Quarterly"},{"review":"\\"An illuminating new book... <i>Young Abolitionists</i> cleverly moves between imagined and historical children who are both in and out of the archives of abolition and antislavery.\\"","reviewer":"Miranda"},{"review":"\\"With its elegantly written prose its comprehensive bibliography and index, its well-chosen illustrations and rich notes, this volume not only fully deserves the tributes of the scholarly community as it definitely breaks new ground in the study of abolitionism . . . [but] is also highly recommended reading for wider audiences.\\"","reviewer":"e-Rea"},{"review":"\\"Through a meticulous and skillful analysis of a wide range of historical and literary sources, and the inclusion of several striking portraits of child abolitionists, Roy gives voice and visibility to an inspiring and remarkable group of young antislavery activists.\\"","reviewer":"Journal of Southern History"}]`,
    series: 0,
    seriesOpenAccess: [],
    subtitle: "Children of the Antislavery Movement",
    title: "Young Abolitionists",
    titleGroupId: "9781479830091",
    yearBook: "2024",
    yearOpenAccess: "2025",
    // hmmm I need the ID,
    id: undefined,
    collection_code: "oa-books",
  }

  assert.deepStrictEqual(resultExampleData, sourceData);
})
