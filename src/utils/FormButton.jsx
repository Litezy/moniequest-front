import React from 'react'

const FormButton = ({title, type="submit", onClick, disabled=false, className}) => {
  return (
    <button className={`bg-ash hover:bg-lightgreen text-white hover:text-ash w-full h-fit py-3.5 text-lg rounded-md ${className}`} type={type} disabled={disabled ? true: false} onClick={onClick}>{title}</button>
  )
}

export default FormButton