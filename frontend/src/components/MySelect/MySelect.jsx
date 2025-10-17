import Select from 'react-select';
import './MySelect.css';

function MySelect(props) {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: '12vw',
      height: '5vh',
      backgroundColor: '#ffffff',
      borderColor: state.isFocused ? '#2c2c2c' : '#a4a4a4',
      boxShadow: state.isFocused ? '2c2c2c' : 'a4a4a4',
      '&:hover': {
        borderColor: '#2c2c2c',
      },
      color: '#fff',
      padding: '0.1vh 0.1vw',
      fontFamily: 'Jersey 25',
      fontSize: '1.2vw',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#000000',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#2c2c2c',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#000000' : '#2c2c2c',
      color: '#fff',
      cursor: 'pointer',
    }),
  };

  return (
    <div className="select-container">
      <h1>{props.text}</h1>
      <Select
        options={props.options}
        onChange={props.onChange}
        isClearable={true}
        styles={customStyles}
        className="select"
      />
    </div>
  );
}

export default MySelect;
