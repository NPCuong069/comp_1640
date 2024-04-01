import React, { useState } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { FaFilePdf } from "react-icons/fa";
import "./articleDetails.css";

function ArticleDropdown() {

    const [show, setShow] = useState(false);

    return (

        <div className=' mt-3 grid grid-cols-1 text-xl gap-2'>
            <h1 className=' bg-gray-300 p-2 text-3xl flex items-center gap-2 justify-between'> <div className='flex items-center'><button className='text-5xl' onClick={(e) => setShow(!show)}>{show ? <IoMdArrowDropdown className='' /> : <IoMdArrowDropright className='' />}</button> Files and Comment</div> <p className='text-2xl text-red-500'>Commented</p>  </h1>
            {show && <form action="">
                <table className='w-full  [&>tbody>*:nth-child(odd)]:bg-gray-200 [&>tbody>*:nth-child()]:p-2  '>
                    <tbody className=' p-2'>
                        <tr className=' p-2 mt-2 '>
                            <td>
                                Status
                            </td>
                            <td>
                                Selected
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Upload date
                            </td>
                            <td>
                                12/26/2023
                            </td>
                        </tr>
                        <tr>
                            <td>
                                File submission
                            </td>
                            <td className='flex items-center gap-2'>
                                <FaFilePdf /> Filename.pdf
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Comments
                            </td>
                            <td>
                                <textarea placeholder='Enter your comment' name="" id="" cols="40" rows="3"></textarea>
                            </td>
                        </tr>


                    </tbody>
                </table>
                <div className=' w-full flex justify-end'>
                    <button className='px-5 p-2 bg-violet-600 text-white rounded-md'>
                        COMMENT
                    </button>
                </div>

            </form>}

        </div>
    );
}

export default ArticleDropdown;