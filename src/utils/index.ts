/**
 * 加载图片
 *
 * @export
 * @param {string} urlOrBase64OrFile - 图片地址，可为图片地址、base64 或 File对象
 * @param {boolean} [crossOrigin=false] - 是否允许跨域，仅对于 URL 时有效
 */
export async function loadImage(
    urlOrBase64OrFile: string | File,
    crossOrigin: boolean = false,
): Promise<HTMLImageElement> {
    const getFile = async (file: File): Promise<string> =>
        await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => (e.target ? resolve(e.target.result as string) : reject(new Error(`empty`)));
            reader.onerror = err => reject(err);
            reader.readAsDataURL(file);
        });
    const src = typeof urlOrBase64OrFile === 'string' ? urlOrBase64OrFile : await getFile(urlOrBase64OrFile);

    return new Promise((resolve, reject) => {
        const image = new Image();
        if (crossOrigin) {
            image.crossOrigin = 'Anonymous';
        }
        image.src = src;
        image.onload = () => resolve(image);
        image.onerror = reject;
    });
}
