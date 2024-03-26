import React from "react";

function Menu({menu}){
    return(
        <>
            <div className="menu_icon">
                <img src={menu} alt="Menu" />
            </div>
        </>
    )
}

export default Menu;