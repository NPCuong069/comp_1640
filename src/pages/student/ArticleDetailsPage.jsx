import React from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { FaFilePdf } from "react-icons/fa";
import "./articleDetails.css";
import ArticleDropdown from './ArticleDropdown';


function StudentArticleDetails() {

    return (
        <div className='text-lg mx-[200px]' >
            <h1 className=' bg-gray-200 p-2 '>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores rerum corporis nisi </h1>
            <h2 className=' mt-3 '>Status: Selected</h2>
            <h3 className=' mt-3 '>Closure date: 12/27/2023</h3>
            <p className=' mt-3 '>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem blanditiis quidem, cupiditate, cumque, porro molestiae nobis facilis rerum magni ex quaerat quo! Sequi atque dolorem inventore impedit recusandae odio! Iusto.</p>
            <h1 className=' mt-5 font-semibold '>Submissions list</h1>
            <ArticleDropdown />
            <ArticleDropdown />
            <ArticleDropdown />
            <ArticleDropdown />
        </div>

    );
}

export default StudentArticleDetails;
