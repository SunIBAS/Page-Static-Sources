async function generateUploadToken(options) {
    let { deadline, bucketName, assessKey, secretKey } = options;
    if (!deadline) {
        deadline = Math.floor((new Date().getTime() + 3600 * 1000) / 1000);
    }

    const putPolicy = JSON.stringify({ scope: bucketName, deadline });

    // URL-safe Base64 encoding
    const encodedPutPolicy = base64UrlSafeEncode(btoa(putPolicy)) + '=';

    // HMAC-SHA1 implementation
    const sign = await createHmacSha1(secretKey, encodedPutPolicy);

    // Combine to form the token
    return `${assessKey}:${base64UrlSafeEncode(sign)}=:${encodedPutPolicy}`;
}

// Function to perform URL-safe Base64 encoding
function base64UrlSafeEncode(base64String) {
    return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Function to create HMAC-SHA1 using Web Crypto API
async function createHmacSha1(secretKey, message) {
    // Convert secret key and message to ArrayBuffer
    const keyData = new TextEncoder().encode(secretKey);
    const messageData = new TextEncoder().encode(message);

    // Import the secret key for HMAC usage
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: { name: 'SHA-1' } },
        false,
        ['sign']
    );

    // Generate HMAC signature
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);

    // Convert signature to Base64 string
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function generateAccessToken(method, path, host, SecretKey, assessKey) {
    let signingStr = [
        `${method} ${path}`,
        `Host: ${host}`,
        ``,
        ``
    ].join('\n');
    let sign = await createHmacSha1(signingStr, SecretKey)
    let encodedSign = base64UrlSafeEncode(sign);
    return `${assessKey}:${encodedSign}`;
}

// var options = {
//     "assessKey": "YBpV7jqPr5TIdG4oMPW5sxmWsS9dhkLCSuM9cWJ4",
//     "secretKey": "-HQzgNogk-yQv9qGmjEpvoDT9JOZ0b_r-wHk_jhx",
//     "bucketName": "ibas",
//     "deadline": 1734680650
// };
// generateUploadToken(options).then(token => {
//     console.log(token);
// });

// Example usage
// (async () => {
//     const options = {
//         "assessKey": "YBpV7jqPr5TIdG4oMPW5sxmWsS9dhkLCSuM9cWJ4",
//         "secretKey": "-HQzgNogk-yQv9qGmjEpvoDT9JOZ0b_r-wHk_jhx",
//         "bucketName": "ibas",
//         "deadline": 1734680650
//     }
//
//     const token = await generateUploadToken(options);
//     console.log("Generated Upload Token:", token);
// })();
