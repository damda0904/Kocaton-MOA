import React, { useState, useRef, useEffect } from 'react'
import { Tag, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function HashTag(props) {

    const [Tags, setTags] = useState([]);
    const [InputVisible, setInputVisible] = useState(false);
    const [InputValue, setInputValue] = useState('');

    const inputRef = useRef();

    const handleClose = removedTag => {
        const tags = Tags.filter(tag => tag !== removedTag)
        console.log(tags);
        setTags(tags);
    }

    const showInput = () => {
        setInputVisible(true);
        
    }

    const handleInputChange = e => {
        setInputValue(e.currentTarget.value);
    }

    const handleInputConfirm = () => {
        if (InputValue && Tags.indexOf(InputValue) === -1) {
            setTags([...Tags, InputValue]);
        }
        
        setInputVisible(false);
        setInputValue('');

    }

    const forMap = tag => {
        const tagElem = (
            <Tag    
                closable
                onClose={e => {
                    e.preventDefault();
                    handleClose(tag);
                }}
            >
                {tag}
            </Tag>
        );
        return (
            <span key={tag} style={{ display: 'inline-block'}}>
                {tagElem}
            </span>
        );
    }

    const tagChild = Tags.map(forMap);

    useEffect(() => {
        if (InputVisible) inputRef.current.focus();  
        props.addTags(Tags);
    }, [InputVisible])

    return (
        <div style={{ marginBottom: 16 }}>
           <div style={{ marginBottom: '10px' }}>{tagChild}</div>
           {InputVisible && (
               <Input   
                    ref={inputRef}
                    type="text"
                    size="small"
                    style={{ width: 78}}
                    value={InputValue}
                    onChange={handleInputChange}
                    onPressEnter={handleInputConfirm}
                />
           )}
           {!InputVisible && (
               <Tag onClick={showInput} style={{ borderStyle: 'dashed' }}>
                   <PlusOutlined />New Tag
               </Tag>
           )}
        </div>
    )
}

export default HashTag

