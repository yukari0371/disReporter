const regexies = {
    age: /([0-9０-９]|[1１|][0-3０-３])[歳才]/,
    token: /[A-Za-z0-9]{23,40}\.[A-Za-z0-9]{5,10}\.[A-Za-z0-9\-]{20,40}/,
    steamcommunity: /\[(.*?steamcommunity\.com.*?)\]\((https?:\/\/[^\s\)]+)\)/
}

export async function violationDetector(message) {
    // 13歳未満
    if (regexies.age.test(message)) {
        return { success: true, type: 0 };
    }

    // token
    if (regexies.token.test(message)) {
        return { success: true, type: 1 };
    }

    // steam
    if (regexies.steamcommunity.test(message)) {
        return { success: true, type: 2 };
    }

    return { success: false };
}