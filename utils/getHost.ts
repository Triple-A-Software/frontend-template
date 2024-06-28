export function getHost() {
    return window.location.host;
}

export function getProtocol() {
    return window.location.protocol;
}

export function isProtocolSecure() {
    return getProtocol() === "https";
}
