import { openDB } from "idb";

// Crear y Guardar articulos en la database

export const getDB = async () => {
    return await openDB('CatalogDB', 4, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('articles')) {
                db.createObjectStore('articles', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('catalogs')) {
                db.createObjectStore('catalogs', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('exportQueue')) {
                db.createObjectStore('exportQueue', { keyPath: 'id', autoIncrement: true });
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
// Eliminar articulos

export const deleteArticleById = async (articleId) => {
    const db = await getDB();
    const tx = db.transaction('articles', 'readwrite');
    const store = tx.objectStore('articles');
    const existing = await store.get(articleId);
    if (!existing) {
        await tx.done;
        return { success: false, message: `Artículo con ID ${articleId} no encontrado.` };
    }
    await store.delete(articleId);
    await tx.done;
    return { success: true, message: `Artículo con ID ${articleId} eliminado correctamente.` };
};


// Obtener articulo por id

export const getArticleById = async (id) => {
    const db = await getDB();
    const tx = db.transaction('articles', 'readonly');
    const store = tx.objectStore('articles');
    const article = await store.get(id);
    await tx.done;
    return article;
}

// Funciones para exportqueue

export const addToExportQueue = async (catalogId) => {
    const db = await getDB();
    await db.add('exportQueue', { catalogId, addedAt: new Date().toISOString() });
};

export const getExportQueue = async () => {
    const db = await getDB();
    const tx = db.transaction('exportQueue', 'readonly');
    const store = tx.objectStore('exportQueue');
    const queue = await store.getAll();
    await tx.done;
    return queue;
};

export const removeFromExportQueue = async (id) => {
    const db = await getDB();
    const tx = db.transaction('exportQueue', 'readwrite');
    const store = tx.objectStore('exportQueue');
    await store.delete(id);
    await tx.done;
};

// Funciones para crear catalogs

export const createCatalog = async (name) => {
    const db = await getDB();
    const tx = db.transaction('catalogs', 'readwrite');
    const store = tx.objectStore('catalogs');

    const newCatalog = {
        name,
        articleIds: [],
        createdAt: new Date().toISOString()
    };

    const id = await store.add(newCatalog);
    await tx.done;
    return id;
};

export const addArticleToCatalog = async (catalogId, articleId) => {
    const db = await getDB();
    const tx = db.transaction('catalogs', 'readwrite');
    const store = tx.objectStore('catalogs');
    const catalog = await store.get(catalogId);

    if (catalog) {
        const currentIds = catalog.articleIds || [];
        if (!currentIds.includes(articleId)) {
            catalog.articleIds = [...currentIds, articleId];
            await store.put(catalog);
        }
    }

    await tx.done;
};

export const getArticlesByCatalog = async (catalogId) => {
    const db = await getDB();
    const catalog = await db.get('catalogs', catalogId);

    if (!catalog || !catalog.articleIds) return [];

    const tx = db.transaction('articles', 'readonly');
    const store = tx.objectStore('articles');

    const articles = await Promise.all(
        catalog.articleIds.map(id => store.get(id))
    );

    await tx.done;
    return articles.filter(Boolean); // Por si alguno no existe
};

export const removeArticleFromCatalog = async (catalogId, articleId) => {
    const db = await getDB();
    const tx = db.transaction('catalogs', 'readwrite');
    const store = tx.objectStore('catalogs');
    const catalog = await store.get(catalogId);

    if (catalog && Array.isArray(catalog.articleIds)) {
        catalog.articleIds = catalog.articleIds.filter(id => id !== articleId);
        await store.put(catalog);
    }

    await tx.done;
};
export const getAllCatalogs = async () => {
    const db = await getDB();
    const tx = db.transaction('catalogs', 'readonly');
    const store = tx.objectStore('catalogs');
    const catalogs = await store.getAll();
    await tx.done;
    return catalogs;
};
