import React from 'react';
import './ImageLinkForm.css';


const ImageLinkForm = ({ onInputChange, onPictureSubmit }) => {
    return (
        <div>
            <p className="f3">
                {'This magical app will detect friendly (and non-friendly) faces. Give it a try!'}
            </p>
            <div className="center">
                <div className="form center pa3 br3 shadow-5">
                    <input className="f4 pa2 w-70 center" type="text" 
                    onChange={onInputChange} placeholder="<paste your image url here>" />
                    <button className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple"
                    onClick={onPictureSubmit} >Detect</button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;