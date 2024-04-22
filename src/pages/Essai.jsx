import { useEffect, useState } from "react";
import { storage } from "../firebase";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid"; // Pour générer un nom unique au fichier envoyé

function FirebaseImageUpload() {
  const [img, setImg] = useState("");
  const [imgUrl, setImgUrl] = useState([]);

  const handleClick = () => {
    if (img !== null) {
      const imgRef = ref(storage, `tentative/${v4()}`);
      uploadBytes(imgRef, img).then((value) => {
        console.log(value);
        getDownloadURL(value.ref).then((url) => {
          setImgUrl((data) => [...data, url]);
        });
      });
    }
  };
  
/*

useEffect pour lancer une fonction quand on le décide. Ici, dès l'ouverture de la page
listAll pour récupérer tous les fichiers et leurs préfixes
ref.... euh
On va chercher dans le dossier "tentative" présent dans le cloud de firebase "storage" importé par "getStorage"
then ensuite on enchaine
imgs représente les fichiers un par un. Des images en l'occurrence. Je crois

*/
  useEffect(()=>{
    listAll(ref(storage,"tentative")).then(imgs=>{
        console.log(imgs)
        imgs.items.forEach(val=>{
            getDownloadURL(val).then(url=>{
                setImgUrl(data=>[...data,url])
            })
        })
    })
},[])

  return (
    <div className="App">
      <input type="file" onChange={(e) => setImg(e.target.files[0])} />
      <button onClick={handleClick}>Upload</button>
      <br />
      {imgUrl.map((dataVal) => (
        <div key={dataVal.id}>
          <img src={dataVal} height="200px" width="200px" />
          <br />
        </div>
      ))}
    </div>
  );
}
export default FirebaseImageUpload;
