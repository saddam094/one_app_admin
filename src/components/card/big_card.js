import React from 'react'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const big_card = ({ title, subTitle, counts }) => {
  return (
    <div className='flex flex-col justify-between  h-40 w-80 bg-pink-200 rounded-xl p-4'>
        <div>
            <p className='text-md font-serif text-slate-700'>{title}</p>
            <p className='text-sm text-slate-500'>{subTitle}</p>
        </div> 

        <div className='flex justify-between'>
            <p className='text-lg font-medium text-slate-700'>{counts}</p> 
            <div className='h-8 w-8 bg-black rounded-md text-center'>
                <ArrowOutwardIcon className='text-white'/>
            </div>
        </div>
           
    </div>
  )
}

export default big_card