import { useEffect, useRef } from 'react';
import '../App.css';

const importAll = require =>
  require.keys().reduce((acc, next) => {
    acc[next.replace("./", "")] = require(next);
    return acc;
  }, {});

const images = importAll(
  require.context("../assets/img/", false, /\.(png|jpe?g|svg)$/)
);


const ImgGen = () => {
    const hero_image  = useRef([]);

    const Animate = () => {
        for(let i=0; i<7; i++){
            let e = Math.round(Math.random() * 127)

            if(hero_image.current[e].classList.contains('is-animated')){
                hero_image.current[e].classList.remove('is-animated')
            } else {
                hero_image.current[e].classList.add('is-animated')
            }
        }
    }

    useEffect(() => {
        setInterval(Animate, 1000);
        // setInterval(() => {
        //     hero_image.current.forEach(el => {
        //         if(el.classList.contains('is-animated')){

        //             el.classList.remove('is-animated')
        //         }
        //     })
        // }, 3000)
    })

    const imgs = [...Array(127).keys()].map(x => {

        return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img src={images[`${x}.jpg`]} className="hero-image"
        ref={(element) => hero_image.current[x] = element}
        style={{
            left: Math.round(Math.random() * 100) + '%',
            top: Math.round(Math.random() * 100 + 7) + '%',
            zindex: Math.round(Math.random() * 10000)
            }}
        key={x}>
        </img>)
    });

    return (<div className='img-container'>{imgs}</div>)
};

const Tiles = () => {

    return (
        <div className="tile">
            <ImgGen/>
        </div>
    )
}


export default Tiles;
