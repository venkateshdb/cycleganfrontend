import { useRef,useState } from "react";
import { useEffect } from "react";
// import axios from 'axios';
import Loader from './loader/loader';
import "./dragdrop.css";
import img1 from '../assets/img/10.jpg';
import img2 from '../assets/img/12.jpg';

const DragandDrop = (props) =>{

    const [show,setShow] = useState(false)
    const [showDragDrop,setShowDragDrop] = useState(true)
    const [showDrag,setShowDrag] = useState(true)
    const [showLoading,setShowLoading] = useState(false)
    const [imageFile,setImageFile] = useState()
    const [result,setResult] = useState()
    const [orignalImg,setOrignalImg] = useState()


    // const URL = "http://localhost:8000/static/image_name";
    // const URL = "http://65.2.52.246:8000/api/";
    const URL = "https://55ff-103-203-62-92.in.ngrok.io/api/";

    const box = useRef()
    const selectGroup = useRef();
    const select = useRef();
    const convert = useRef();
    const reader = new FileReader()
    const orignalReader = new FileReader()

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        box.current.classList.add('highlight')
    }

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        box.current.classList.remove('highlight')

    }

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        box.current.classList.add('highlight')

    }

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let dt = e.dataTransfer;
        let files = dt.files;
        ([...files]).forEach( file =>  setImageFile(file) )

        selectGroup.current.style.display = "block";

        box.current.classList.remove('highlight')
        setShowDrag(false);

    }

    const getStyles = () => {
        try {
            select.current.length = 0;
        } catch (error) {
            console.log(error);
        }


        fetch(URL + 'convert/', {
            method: 'GET'
        })
        .then(resp => resp.json())
        .then(result => {
            result.styles.forEach(style => {
                let option = document.createElement('option');
                option.innerHTML = style
                option.value = style
                try{
                    select.current.add(option)
                } catch(e){
                    console.log(e)
                }
            })

        })
    }

    useEffect(
        () => {
            getStyles()

        },[]
    )

     const submithandler=(e)=>{
        // e.preventDefault();

        let data = new FormData()

        console.log(select.current.value)
        console.log(imageFile)
        orignalReader.readAsDataURL(imageFile);
        orignalReader.onload = () => {
            setOrignalImg(orignalReader.result)
        }
        data.append('image', imageFile)
        data.append('style', select.current.value)

        fetch(URL + 'convert/', {
            method: 'POST',
            mode: 'cors',
            body: data
        })
        .then(res => res.json())
        .then(result => {
            setResult(result)
            setShow(true);
            ShowImage(result)
            console.log("fetch")
        })
        .catch(err => console.log(err))

        setShowDragDrop(false);
        setShowLoading(true);

    }
    const ShowImage = (result) =>{
        let img = result.result

        fetch("https://55ff-103-203-62-92.in.ngrok.io/static/convert_img/"+img,
        {
            method: "get",
            mode: 'cors',
        })
        .then(response => response.blob())
        .then(imageBlob => {

            reader.readAsDataURL(imageBlob);
            reader.onloadend = () => {
                let img = document.createElement('img');
                img.src = reader.result;
                convert.current.insertBefore(img, convert.current.firstChild)
            }

        });

    }

    const downloadHandler = (e) =>{
        e.preventDefault();

        let img = result.result

        fetch("https://55ff-103-203-62-92.in.ngrok.io/static/convert_img/"+img,
        {
            method: "get",
            mode: 'cors',
        })
            .then(response => response.blob())
            .then(imageBlob => {
                // Then create a local URL for that image and print it
                const imageObjectURL = global.URL.createObjectURL(imageBlob);
                console.log(imageObjectURL);
                let a = document.createElement('a');
				a.href = imageObjectURL;
				a.download = img;
				a.click();
            });

    }

    const handleFile = (e) => {
        e.preventDefault();
        let file = e.target.files;
        if(file.length > 0){
            selectGroup.current.style.display = "block";
            setShowDrag(false);
            setImageFile(file[0]);
        }
    }

    return (
        <form method="post" action="" className="box"
        onDrop={e => handleDrop(e)}
        onDragOver={e => handleDragOver(e)}
        onDragEnter={e => handleDragEnter(e)}
        onDragLeave={e => handleDragLeave(e)}
        ref={box}>
            <div className="box__input">

            {
                   showDrag ?
                        <div>
                            <svg className="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"></path></svg>
                            <input className="box__file" id="file" type="file" onChange={handleFile}></input>
                            <label htmlFor="file"><strong>Choose file </strong>or drag it here.</label>

                        </div>

                    : null
               }
               <div className="box__upload">

               <span className="selectGroup" ref={selectGroup}>

               {
                   showDragDrop ?
                   <div>
                        <label htmlFor="select">Select Artistic Style</label>
                   </div>

                   :    null
                }



                   {
                   showDragDrop ?
                   <div>
                        <select id="select" name="style" ref={select}></select>
                        <label htmlFor="select"> photo.</label>
                   </div>

                   :    null
                }


               {
                   showDragDrop ?
                    <div>

                        <div className="buttons">
                            <button className="blob-btn" onClick={e => submithandler(e)}>
                                Convert Image
                                <span className="blob-btn__inner">
                                <span className="blob-btn__blobs">
                                    <span className="blob-btn__blob"></span>
                                    <span className="blob-btn__blob"></span>
                                    <span className="blob-btn__blob"></span>
                                    <span className="blob-btn__blob"></span>
                                </span>
                                </span>
                            </button>
                            <br/>

                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                            <defs>
                                <filter id="goo">
                                <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
                                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
                                <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
                                </filter>
                            </defs>
                            </svg>
                            </div>
                    </div>
               : null
               }
               </span>

               {
                   show ?


                    <div>
                        <div className="compare">
                            <div className="orignal">
                            <figure>
                            <img src={orignalImg}></img>
                            <figcaption>Orignal Image</figcaption>
                            </figure>
                            </div>

                            <div className="convert">
                            <figure ref={convert}>
                            <figcaption>Converted  Image</figcaption>
                            </figure>
                            </div>
                        </div>

                        <div>

            <div className="buttons" style={{marginTop:0, marginBottom:-75}}>
                <button className="blob-btn" onClick={e => downloadHandler(e)}>
                    Download Image
                    <span className="blob-btn__inner">
                    <span className="blob-btn__blobs">
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                    </span>
                    </span>
                </button>
                <br/>

                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                <defs>
                    <filter id="goo">
                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
                    <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
                    </filter>
                </defs>
                </svg>
                </div>
                </div>
                </div>

                   :
                       showDragDrop ? null : <Loader></Loader>
               }
                </div>
            </div>
        </form>
    )
}

export default DragandDrop
