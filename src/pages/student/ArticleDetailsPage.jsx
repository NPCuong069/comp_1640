import React from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { FaFilePdf } from "react-icons/fa";
import "./articleDetails.css";

function StudentArticleDetails() {
    return (
        <div className='text-lg mx-[200px]' >
            <h1 className=' bg-gray-200 p-2 '>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores rerum corporis nisi </h1>
            <h2 className=' mt-3 '>Status: Selected</h2>
            <h3 className=' mt-3 '>Closure date: 12/27/2023</h3>
            <p className=' mt-3 '>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem blanditiis quidem, cupiditate, cumque, porro molestiae nobis facilis rerum magni ex quaerat quo! Sequi atque dolorem inventore impedit recusandae odio! Iusto.</p>
            <h1 className=' mt-5 font-semibold '>Submissions list</h1>
            <div className=' mt-3 grid grid-cols-1 text-xl gap-2'>
                <h1 className=' bg-gray-300 p-2 text-4xl flex items-center gap-2 '> <button><IoMdArrowDropdown className='' /></button> Submission no.#</h1>
                <form action="">
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
                                    <FaFilePdf /> Lorem ipsum dolor sit amet, consectetur adipiscing elit.pdf
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

                </form>

            </div>
            <div className=' mt-3 grid grid-cols-1 text-xl gap-2'>
                <h1 className=' bg-gray-300 p-2 text-3xl flex items-center gap-2 justify-between'> <div className='flex items-center'><button><IoMdArrowDropright className='text-5xl' /></button> Submission no.# </div> <p className='text-2xl text-red-500'>Commented</p>  </h1>

            </div>
            <div className=' mt-3 grid grid-cols-1 text-xl gap-2'>
                <h1 className=' bg-gray-300 p-2 text-3xl flex items-center gap-2 justify-between'> <div className='flex items-center'><button><IoMdArrowDropright className='text-5xl' /></button> Submission no.# </div> <p className='text-2xl text-red-500'>Commented</p>  </h1>

            </div>
            <div className=' mt-3 grid grid-cols-1 text-xl gap-2'>
                <h1 className=' bg-gray-300 p-2 text-3xl flex items-center gap-2 justify-between'> <div className='flex items-center'><button><IoMdArrowDropright className='text-5xl' /></button> Submission no.# </div> <p className='text-2xl text-red-500'>Commented</p>  </h1>

            </div>
        </div>

    );
}

export default StudentArticleDetails;
