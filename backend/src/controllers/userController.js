const test = async (req, res) => {
    res.json({ message: "Hello World!" });
};

const testName = async (req, res) => {
    res.json({ message: `Hello ${req.params.name}!` });
};

export default { test, testName };
