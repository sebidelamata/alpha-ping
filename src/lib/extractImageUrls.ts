// Function to extract image URLs from message text
const extractImageUrls = (text: string): string[] => {
    const regex = /!\[image\]\((.*?)\)/g;
    let match;
    const urls: string[] = [];
    while ((match = regex.exec(text)) !== null) {
        urls.push(match[1]);
    }
    return urls;
};

export default extractImageUrls;