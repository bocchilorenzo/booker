import libgen from "libgen"
var sanitize = require("sanitize-filename");

let options = {
    mirror: 'https://libgen.is',
    query: '',
    count: 20,
    sort_by: 'def',
    reverse: false
}

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

async function search(settings) {
    try {
        const data = await libgen.search(settings)
        let n = data.length
        let toRtn = { response: 404, results: [] }
        if (n != 0) {
            toRtn.response = 200
            let coverId = ""
            while (n--) {
                coverId = data[n].id
                if (coverId.length >= 4) {
                    for (let i = coverId.length - 1; i > coverId.length - 4; i--) {
                        coverId = setCharAt(coverId, i, "0")
                    }
                }
                else {
                    coverId = "0"
                }
                toRtn.results.push({
                    id: data[n].id,
                    title: data[n].title,
                    author: data[n].author,
                    mirrors: ["https://libgen.is", "http://gen.lib.rus.ec"],
                    coverBase: "http://library.lol",
                    link: "/book/index.php?md5=" + data[n].md5.toLowerCase(),
                    cover: "/covers/" + coverId + "/" + data[n].md5.toLowerCase()
                })
                parseInt(coverId) >= 500000 ? toRtn.results[toRtn.results.length - 1].cover += "-g.jpg" : toRtn.results[toRtn.results.length - 1].cover += ".jpg"
            }
        }
        return toRtn
    } catch (err) {
        return { response: 500, results: [] }
    }
}

module.exports = async (req, res) => {
    options.query = sanitize(req.query.q)
    let results = await search(options)
    res.status(200).send({ results });
};
