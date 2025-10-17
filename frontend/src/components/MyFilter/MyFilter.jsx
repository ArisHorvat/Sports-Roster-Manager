import { useState } from 'react';
import { PiEqualsFill, PiLessThanFill, PiGreaterThanFill } from "react-icons/pi";
import './MyFilter.css';

function MyFilter(props) {
  const [inputValue, setInputValue] = useState(props.value);
  const [selectedCondition, setSelectedCondition] = useState(props.condition);

  const handleValueChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    props.onChange(value, selectedCondition);
  };

  const handleConditionChange = (newCondition) => {
    setSelectedCondition(newCondition);
    props.onChange(inputValue, newCondition);
  };

  return (
    <div className="filter-container">
      <h1>{props.filter}</h1>
      <input
        className="filter-input-text"
        placeholder="Enter a value..."
        value={inputValue}
        onChange={handleValueChange}
        type="number" // Only allow numbers in the input
      />
      <div className="filter-options">
        <PiLessThanFill
          onClick={() => handleConditionChange('less')}
          style={{
            stroke: selectedCondition === 'less' ? '#fff' : '#bbb',
            strokeWidth: '1vw',
            fill: selectedCondition === 'less' ? '#000' : '#aaa',
            fontSize: '2.5vw',
            cursor: 'pointer',
          }}
        />
        <PiEqualsFill
          onClick={() => handleConditionChange('equals')}
          style={{
            stroke: selectedCondition === 'equals' ? '#fff' : '#bbb',
            strokeWidth: '1vw',
            fill: selectedCondition === 'equals' ? '#000' : '#aaa',
            fontSize: '2.5vw',
            cursor: 'pointer',
          }}
        />
        <PiGreaterThanFill
          onClick={() => handleConditionChange('greater')}
          style={{
            stroke: selectedCondition === 'greater' ? '#fff' : '#bbb',
            strokeWidth: '1vw',
            fill: selectedCondition === 'greater' ? '#000' : '#aaa',
            fontSize: '2.5vw',
            cursor: 'pointer',
          }}
        />
      </div>
    </div>
  );
}

export default MyFilter;
