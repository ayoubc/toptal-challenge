import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import "./style.css";


export const SelectTag = ({tags, existing, onSelect}) => {

    return (
        <DropdownButton id="dropdown-basic-button" title="Add" onSelect={onSelect}>
            {tags.map((tag, index) => {
                const ind = existing.indexOf(tag.id);
                if(ind != -1) return;
                return <Dropdown.Item as="button" key={index} eventKey={index}>{tag.name}</Dropdown.Item>;
            })}
        </DropdownButton>
    );
}

export default SelectTag
