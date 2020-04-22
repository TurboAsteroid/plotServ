const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI('JY9277-RG39YQG8JY');

async function getWolframPlot(req, res) {
    try {
        let queryresult = await waApi.getFull(`plot ${req.query.equation} from x=${req.query.rangeStart} to ${req.query.rangeEnd}`);
        for (let pod of queryresult.pods) {
            if (pod.id === "Plot")
                return res.json({src: pod.subpods[0].img.src});
        }
        res.json({error: "Невозможно получить данные"});
    } catch (err) {
        res.json({error: "Невозможно получить данные"});
    }
}

module.exports = {getWolframPlot};