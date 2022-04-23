import React from 'react';
import brand from '../Images/brand.png';


function Loading() {
    return (
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>

            <img class="animate__animated animate__pulse animate__infinite" id="loadingImg" width="15%" src={brand}></img>

        </div>
    )
}

export default Loading
