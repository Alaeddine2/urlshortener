const isURL = (url) => {
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-]*)*\/?$/;
    return urlRegex.test(url);
};

module.exports = { isURL };
