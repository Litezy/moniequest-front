import React from 'react'
import anime from 'animejs'

const ToolsDiv = ({ item,handleCategory,array }) => {
    anime({
        targets: ".desc",
        translateY: 5,
        opacity: [0, 1], 
        duration: 1000,
        easing: "easeInOutQuad",
      });
    return (
        <div className='w-full'>
            <div onClick={()=>handleCategory(item.title)} className="flex cursor-pointer items-center gap-2 mb-1">
                <div className={`w-3 h-3 rounded-full ${array.includes(item.title) ? 'bg-lightgreen' : 'bg-zinc-100'}  `}></div>
                <div className="">{item.title}</div>
            </div>
            <div className="flex flex-col gap-1">
                {item.desc.map((desc, i) => {
                    return (
                        <div key={i} className="flex ml-6 text-sm text-zinc-300">
                            <div className="capitalize desc">{desc}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ToolsDiv