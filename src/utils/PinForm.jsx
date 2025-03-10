
import { useRef } from 'react'


export default function PinForm ({pins, setPins}) {
  const inputRefs = useRef([]);

  const handleInputChange = (index, value) => {
    const newPins = [...pins];
    newPins[index] = value;
  
    if (index < 5 && value !== '') {
      inputRefs.current[index + 1].focus();
    }
  
    setPins(newPins);
  };
  
  const handleInputBackspace = (index, event) => {
    if (event.key === 'Backspace' && index > 0 && pins[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };
  
  const handlePaste = (event) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text/plain').slice(0, 6);
    const sanitizedPins = pastedText.replace(/\D/g, ''); // remove non-digit characters
    const newPins = sanitizedPins.split('').concat(['', '', '', '', '', '']).slice(0, 6);
    
    setPins(newPins);
  
    for (let i = 0; i < newPins.length; i++) {
      if (newPins[i]) {
        inputRefs.current[i].value = newPins[i];
        if (i < 5) {
          inputRefs.current[i + 1].focus();
        }
      }
    }
  };


  return (
    <div>
      <div className='flex items-center justify-center gap-3'>
        {pins.map((part, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            className={`border border-gray-400 h-11 w-11 outline-none text-2xl rounded-lg py-2.5 px-3 text-center`}
            defaultValue={part}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleInputBackspace(index, e)}
            ref={(input) => (inputRefs.current[index] = input)}
            onPaste={(e) => handlePaste(e)}
          />
        ))}
      </div>
    </div>
  )
}

