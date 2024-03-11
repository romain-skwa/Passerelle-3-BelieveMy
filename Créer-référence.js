Pour créer une référence, récupérez une instance du service Storage à l'aide de getStorage() puis appelez ref() avec le service comme argument. Cette référence pointe vers la racine de votre bucket Cloud Storage. 


import { getStorage, ref } from "firebase/storage";

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();

// Create a storage reference from our storage service
const storageRef = ref(storage);




Vous pouvez créer une référence à un emplacement plus bas dans l'arborescence, par exemple 'images/space.jpg' en passant ce chemin comme deuxième argument lors de l'appel ref() . 


import { getStorage, ref } from "firebase/storage";

const storage = getStorage();

// Create a child reference
const imagesRef = ref(storage, 'images');
// imagesRef now points to 'images'

// Child references can also take paths delimited by '/'
const spaceRef = ref(storage, 'images/space.jpg');
// spaceRef now points to "images/space.jpg"
// imagesRef still points to "images"