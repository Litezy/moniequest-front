import React from 'react'

const Loading = ({className}) => {
    return (
        <div className={`w-full h-full absolute top-0 left-0 flex items-center justify-center bg-[#1415238a] z-50 ${className}`}>
            <div className="loader">
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>  
                <div className="bar4"></div>
                <div className="bar5"></div>
                <div className="bar6"></div>
                <div className="bar7"></div>
                <div className="bar8"></div>
                <div className="bar9"></div>
                <div className="bar10"></div>
                <div className="bar11"></div>
                <div className="bar12"></div>
            </div>
        </div>
    )
}

export default Loading