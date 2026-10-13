export const checkPID = async (req, res) => {
    res.status(200).json({ result: 'OK', pid: process.pid });
};
