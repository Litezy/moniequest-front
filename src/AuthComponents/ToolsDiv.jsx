import React from 'react'
import anime from 'animejs'

const ToolsDiv = ({ item, handleCategory, array }) => {
    anime({
        targets: ".desc",
        translateY: 5,
        opacity: [0, 1],
        duration: 1000,
        easing: "easeInOutQuad",
    });
    return (
        <div className='w-full'>
            <div onClick={() => handleCategory(item.name)} className="flex cursor-pointer items-center gap-2 mb-1">
                <div className={`w-3 h-3 rounded-full ${array.includes(item.name) ? 'bg-lightgreen' : 'bg-zinc-100'}  `}></div>
                <div className="capitalize">{item.name}</div>
            </div>
            <div className="flex flex-col gap-1">
                {Array.isArray(JSON.parse(item.features)) ? (
                    JSON.parse(item.features).map((tool, k) => (
                        <div key={k} className='ml-5 text-zinc-400'>{tool}</div>
                    ))
                ) : (
                    <div className="text-sm italic text-gray-500">No features available</div>
                )}
            </div>
        </div>
    )
}

export default ToolsDiv