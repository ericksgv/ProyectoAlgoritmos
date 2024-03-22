const { Client } = require('@threadsjs/threads.js');
const fs = require('fs');

(async () => {
    const client = new Client();

    try {
        await client.login('', '');

        let allPosts = []; // Array para almacenar todos los posts

        let nextPageToken = null; // Inicialmente no hay un token para la siguiente página

        // Bucle para obtener todas las páginas de resultados
        do {
            // Obtener la página actual de resultados
            const currentPage = await client.posts.fetch("3269332771279895163", nextPageToken);

            //Enviar currentArray a un nuevo archivo json llamado allPostsTemp.json

            const allPostsJSON = JSON.stringify(currentPage, null, 2);
            const filePath = 'Temp.json';
            // const filePath = `allPosts${nextPageToken}.json`;
            fs.writeFile(filePath, allPostsJSON, err => {
                if (err) {
                    throw err;
                }
                console.log(`El contenido de todos los posts se ha agregado al archivo ${filePath}`);
            });
            // Llamar a la función y obtener los resultados
            const leyendas = extraerLeyendas();

            // Escribir los resultados en un archivo txt
            fs.writeFileSync('output.txt', leyendas.join('\n'));

            //Eliminar el archivo temporal
            fs.unlinkSync('allPostsTemp.json');



            // Agregar los posts de la página actual al array allPosts 
            allPosts = allPosts.concat(currentPage);
            console.log(`Se han agregado ${currentPage.length} posts al array allPosts`);

            

            // Si hay una próxima página, actualizar el token para la siguiente solicitud
            nextPageToken = currentPage.paging_tokens.downwards;
            console.log(`Token de la próxima página: ${nextPageToken}`);

        } while (nextPageToken); // Continuar el bucle mientras haya una próxima página

        // Convertir el array allPosts a formato JSON
        const allPostsJSON = JSON.stringify(allPosts, null, 2);



        // Escribir el contenido de allPosts en un archivo de texto
        const filePath = 'AllPostsComments.json';

        // Agregar el contenido de allPosts al archivo existente
        fs.appendFile(filePath, allPostsJSON, err => {
            if (err) {
                throw err;
            }
            console.log(`El contenido de todos los posts se ha agregado al archivo ${filePath}`);
        });

        // Calcular y mostrar la cantidad total de respuestas
        let totalReplies = 0;
        allPosts.forEach(post => {
            totalReplies += post.reply_threads.length;
        });
        console.log(`Cantidad total de respuestas: ${totalReplies}`);


    } catch (error) {
        console.error('Error fetching threads:', error);
    }
})();

function extraerLeyendas() {
    // Leer el archivo JSON y cargar su contenido
    const rawData = fs.readFileSync('allPostsTemp.json', 'utf-8');
    const data = JSON.parse(rawData);

    // Crear un array vacío para almacenar todos los textos de las leyendas
    const allCaptions = [];

    // Recorrer todos los elementos en 'reply_threads'
    data.reply_threads.forEach(replyThread => {
        // Recorrer todos los elementos en 'thread_items' para cada 'reply_thread'
        replyThread.thread_items.forEach(threadItem => {
            // Intentar acceder al texto de la leyenda
            try {
                const captionText = threadItem.post.caption.text;
                // Añadir el texto de la leyenda al array
                allCaptions.push(captionText);
            } catch (error) {
                // Si 'post', 'caption', o 'text' no existen, o si 'caption' es null, continuar con el siguiente elemento
                if (error instanceof TypeError || error instanceof KeyError) {
                    return;
                }
            }
        });
    });

    // Devolver los textos de las leyendas
    return allCaptions;
}
