import React, { Component, useState } from "react";
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import MainSearchPage from './MainSections/MainSearchPage';
import MainLivePage from './MainSections/MainLivePage'
import MainCategoryButton from './MainSections/MainCategoryButton';
import CurrentExhibitPage from './MainSections/CurrentExhibitPage';
import PlannedExhibitPage from './MainSections/PlannedExhibitPage';


function Mainpage () {
    return(
        <div style={{margin: '0', padding: '0'}}>
            <MainSearchPage />
            <MainLivePage />
            <MainCategoryButton />
            <CurrentExhibitPage />
            <PlannedExhibitPage />
        </div>
    )
}


export default Mainpage