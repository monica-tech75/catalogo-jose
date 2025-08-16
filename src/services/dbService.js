import { openDB } from "idb";

// Crear y Guardar articulos en la database

export const getDB = async () => {
    return await openDB('CatalogDB', 2, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('articles')) {
                db.createObjectStore('articles', { keyPath: 'id', autoIncrement: true });
            }
        },
    });
};


export const saveArticle = async (article) => {
    const db = await getDB(); // ✅ Use the centralized DB opener
    await db.add('articles', article); // Save the article
};

// Leer todos los articulos

export const getAllArticles = async () => {
    const db = await getDB();
    const tx = db.transaction('articles', 'readonly');
    const store = tx.objectStore('articles');
    const allItems = await store.getAll();
    await tx.done;
    return allItems;
}

// Modificar los articulos

export const updateArticle = async (id, updatedData) => {
    const db = await getDB();
    const tx = db.transaction('articles', 'readwrite');
    const store = tx.objectStore('articles');
    const existing = await store.get(id);

    if (existing) {
        const updatedArticle = { ...existing, ...updatedData };
        await store.put(updatedArticle)
    }
    await tx.done;
}
