const fs = require('fs');
const path = require('path');

// Crear una lista vacía para almacenar todos los textos de las leyendas
let all_captions = [];

// Obtener la lista de archivos JSON que contienen "allPosts" en el nombre
const jsonFiles = fs.readdirSync('./').filter(file => file.includes('allPosts'));

// Iterar sobre cada archivo JSON
jsonFiles.forEach(file => {
    try {
        // Leer el contenido del archivo JSON
        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));

        // Recorrer todos los elementos en 'reply_threads'
        data.reply_threads.forEach(reply_thread => {
            // Recorrer todos los elementos en 'thread_items' para cada 'reply_thread'
            reply_thread.thread_items.forEach(thread_item => {
                // Intentar acceder al texto de la leyenda
                try {
                    const caption_text = thread_item.post.caption.text;
                    all_captions.push(caption_text);
                } catch (error) {
                    // Si 'post', 'caption', o 'text' no existen, o si 'caption' es None, continuar con el siguiente elemento
                    return;
                }
            });
        });
    } catch (error) {
        console.error(`Error al procesar el archivo ${file}: ${error}`);
    }
});

// Escribir todos los textos de las leyendas en un archivo txt
fs.writeFileSync('output.txt', all_captions.join('\n'), { encoding: 'utf-8', flag: 'a' });
