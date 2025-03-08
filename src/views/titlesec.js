import React from "react";
import '../css/titlesec.css';

function Title({title}){
    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="alert title-alert mb-0 sigmar-regular">
                            {title}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Title;