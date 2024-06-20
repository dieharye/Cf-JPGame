export async function commitToFutureBlock() {
    const response = await fetch('https://eos.greymass.com/');
    return await response.json();
}