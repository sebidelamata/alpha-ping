import React from "react";

interface ManageModsListItemProps{
    mod: string | undefined
}

const ManageModsListItem:React.FC<ManageModsListItemProps> = ({mod}) => {
    return(
        <div className="manage-mods-list-item-container">
            <h5>{mod}</h5>
        </div>
    )
}

export default ManageModsListItem