import translate from "@vitalets/google-translate-api";

export default async function Handler(req, res) {
    const json = (success, message, data) => res.json({ success, message, data });
    if (req.method != "POST") return json(false, "Invalid Method", null);
    if (!req.query.from) return json(false, "No 'from' query provided!", null);
    if (!req.query.to) return json(false, "No 'to' query provided!", null);
    try {
        const response = await Promise.all(req.query.to.split(",").map(async lang => {
            const translated = await translate(Object.values(req.body).join(`\r\n`), { from: req.query.from, to: lang });
            const translatedArr = translated.text.split(`\r\n`);
            const objKeys = Object.keys(req.body);
    
            return translatedArr.reduce((obj, text, index) => {
                obj[objKeys[index]] = text.trim();
                return obj;
            }, {});
        }));
    
        res.json({
            success: true,
            message: "Successful!",
            data: response.reduce((obj, texts, index) => {
                obj[req.query.to.split(",")[index]] = texts;
                return obj;
            }, {})
        });
    } catch(e) {
        res.json({
            success: false,
            message: "Something went wrong...",
            errors: [
                { code: e?.statusCode, message: e?.message }
            ],
            data: null
        });
    }

};
