import React, { useState, useEffect } from 'react';
import { Input, Button, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import qs from 'qs';
import ReasultCards from './ResultBooths';
import './Search.css';
import * as BiIcons from "react-icons/bi";
// import NavigationBar from '../navbar/NavigationBar';

const { Option } = Select

function SearchResultPage({ location }) {
    const [alignType, setAlignType] = useState("date");
    const [queryText, setqueryText] = useState("");
    const [searchText, setSearchText] = useState("");

    const alignHandler = (value) => {
        setAlignType(value)
    }

    const queryHandler = (event) => {
        // debugger
        setSearchText(event.currentTarget.value)
        //console.log("바뀐 검색어", queryText)
    }

    useEffect(() => {
        const query = qs.parse(location.search, {
            ignoreQueryPrefix: true
        }).search_query;

        // if(query === ''){
        //     alert("검색어를 입력해주세요")
        // }

        setqueryText(query);
        setSearchText(query);
    }, [location])


    //console.log("검색어", queryText);

    return (
        <div>
            <div style={{ textAlign: "right" }}>
                <input
                    className="search"
                    type="text"
                    placeholder="검색어"
                    value={searchText}
                    onChange={queryHandler}
                />
                <Link to={{
                    pathname: './search',
                    search: `?search_query=${searchText}`
                }}>
                    <BiIcons.BiSearch className="searchicon_" />
                </Link>
            </div>
            <div style={{ float: "right", margin: "0 100px 0 0" }}>
                <Select
                    defaultValue={alignType}
                    style={{ width: "100px" }}
                    onChange={alignHandler}
                >
                    <Option value="date">날짜순</Option>
                    <Option value="name">이름순</Option>
                </Select>
            </div>
            <ReasultCards
                alignType={alignType}
                queryText={queryText}></ReasultCards>
        </div>
    );
}

export default SearchResultPage;