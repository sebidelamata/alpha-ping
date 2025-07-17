// Function to extract iframe strings from message text
const extractIframeStrings = (text: string): string[] => {
    const regex = /<iframe src="(.*?)"/g;
    let match;
    const urls: string[] = [];
    while ((match = regex.exec(text)) !== null) {
    urls.push(match[1]);
    }
    return urls;
};

export default extractIframeStrings