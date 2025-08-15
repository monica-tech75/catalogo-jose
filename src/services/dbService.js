import { openDB } from "idb";

export const saveArticle = async (article) => {
    const db = await openDB('CatalogDB', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('articles')) {
                db.createObjectStore('articles', { keyPath: 'id', autoIncrement: true });
            }
        },
    });
    await db.add('articles', article)
}
export const getAllArticles = async () => {
    const db = await openDB('CatalogDB', 1);
    const tx = db.transaction('articles', 'readonly');
    const store = tx.objectStore('articles');
    const allItems = await store.getAll();
    await tx.done;
    return allItems;
}
