import React, { useState } from 'react';
import firebase from "../firebase";
const ImageUploader = () => {

  const [file, setFile] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [percent, setPercent] = useState(0);

  const [imageUrl, setImageUrl] = useState('');


  const handleChange = (event) => {

    setFile(event.target.files[0]);

  };


  const handleUpload = () => {

    if (!file) {

      alert('Please select an image to upload');

      return;

    }


    setUploading(true);


    const storageRef = firebase.storage().ref();

    const fileRef = storageRef.child(file.name);

    const uploadTask = fileRef.put(file);


    uploadTask.on(

      'state_changed',

      (snapshot) => {

        const percentage = Math.round(

          (snapshot.bytesTransferred / snapshot.totalBytes) * 100

        );

        setPercent(percentage);

      },

      (error) => {

        console.error(error);

        setUploading(false);

      },

      () => {

        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {

          setImageUrl(downloadURL);

          setUploading(false);

        });

      }

    );

  };


  return (

    <div>

      <input type="file" accept="image/*" onChange={handleChange} />

      <button onClick={handleUpload} disabled={uploading}>

        {uploading ? `Uploading ${percent}%` : 'Upload'}

      </button>

      {imageUrl && <img src={imageUrl} alt="uploaded" />}

    </div>

  );

};


export default ImageUploader;